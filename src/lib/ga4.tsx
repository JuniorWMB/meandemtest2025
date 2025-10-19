//Generic GA4 event interface
export interface GAEvent<P extends Record<string, unknown> = Record<string, unknown>> {
  event_name: string;
  params: P;
}

//Check if user gave analytics consent
export function hasConsent(): boolean {
  return document.cookie.includes('analytics_consent=true');
}

//Hash any string (email, address field, etc.)
async function hashString(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

//Hash all address fields
async function hashAddress(address: Record<string, string>): Promise<Record<string, string>> {
  const entries = Object.entries(address);
  const hashedEntries = await Promise.all(
    entries.map(async ([key, value]) => [key, await hashString(value || '')])
  );
  return Object.fromEntries(hashedEntries);
}

//Send GA4 event
export function sendGaEvent<P extends Record<string, unknown>>(event: GAEvent<P>): void {
  if (!hasConsent()) {
    console.warn('Analytics consent not given — event blocked:', event.event_name);
    return;
  }


  const secureEvents = ['checkout_success', 'purchase'];
  const url = secureEvents.includes(event.event_name)
    ? '/api/analytics/secure'
    : '/api/analytics/gtm';

  const params = event.params as Record<string, unknown>;
  const getStr = (key: string, fallback: string): string =>
    typeof params[key] === 'string' ? (params[key] as string) : fallback;
  const getNum = (key: string, fallback: number): number => {
    const val = params[key];
    return typeof val === 'number' ? val : (val !== undefined ? Number(val) : fallback);
  };

  //Get raw email
  const rawEmail =
    typeof params['user_email'] === 'string'
      ? (params['user_email'] as string)
      : typeof params['email'] === 'string'
      ? (params['email'] as string)
      : undefined;

  const defaultHash =
    'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514';

  //Final send function after hashing
  const sendWithHashes = (emailHash: string, hashedAddress: Record<string, string>): void => {
    let adaptedEvent: Record<string, unknown> = {
      event_type: event.event_name,
      page_url: getStr('page_location', window.location.href),
    };

    switch (event.event_name) {
      case 'checkout_success':
      case 'purchase':
        adaptedEvent = {
          ...adaptedEvent,
          event_type: 'checkout_success',
          order_id:
            getStr('order_id', '') || getStr('transaction_id', 'order-1'),
          total: getNum('value', 0),
          email: emailHash,
          address: hashedAddress, //send hashed address
        };
        break;

      case 'add_to_cart':
        adaptedEvent = {
          ...adaptedEvent,
          product_id: getStr('item_id', 'unknown'),
          quantity_added: getNum('quantity', 1),
        };
        break;

      case 'page_view':
      default:
        break;
    }

    const body = JSON.stringify(adaptedEvent);

    //Try sendBeacon first (faster)
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        console.log('Sent via sendBeacon');
        return;
      } catch (err) {
        console.error('sendBeacon failed, fallback to fetch:', err);
      }
    }

    //Fallback: use fetch
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) {
          console.error('Mock-server error:', res.status, res.statusText);
        } else {
          console.log('Event sent to', url);
        }
      })
      .catch((err) => {
        console.error('Fetch failed:', err);
      });
  };

  //1. Get raw address fields
  const rawAddress = {
    line1: getStr('line1', ''),
    street: getStr('street', ''),
    city: getStr('city', ''),
    state: getStr('state', ''),
    postcode: getStr('postcode', ''),
    country: getStr('country', ''),
  };

  //2. Hash email + address at the same time
  Promise.all([
    rawEmail ? hashString(rawEmail) : Promise.resolve(defaultHash),
    hashAddress(rawAddress),
  ])
    .then(([emailHash, hashedAddress]) => {
      console.log('Hashed email:', emailHash);
      console.log('Hashed address:', hashedAddress);
      sendWithHashes(emailHash, hashedAddress);
    })
    .catch((err) => {
      console.error('Hashing failed:', err);
      sendWithHashes(defaultHash, {
        line1: defaultHash,
        street: defaultHash,
        city: defaultHash,
        state: defaultHash,
        postcode: defaultHash,
        country: defaultHash,
      });
    });
}
