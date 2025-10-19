
/*
// ✅ Define a generic GA4 event interface

export interface GAEvent<P extends Record<string, unknown> = Record<string, unknown>> {
  event_name: string;
  params: P;
}



// ✅ Check if the analytics consent cookie is set
export function hasConsent(): boolean {
  return document.cookie.includes('analytics_consent=true');
}

// ✅ Send a GA4 event to the mock server
export function sendGaEvent<P extends Record<string, unknown>>(event: GAEvent<P>): void {
  // Don't send anything if user hasn't given consent
  if (!hasConsent()) return;

  const url = 'http://localhost:4000/collect/gtm';
  const body = JSON.stringify(event);

  // ✅ Prefer sendBeacon — no CORS issue, non-blocking
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } catch (err) {
      console.error('sendBeacon failed, falling back to fetch:', err);
      sendViaFetch(url, body);
    }
  } else {
    sendViaFetch(url, body);
  }
}

// ✅ Fallback using fetch, CORS-safe (no credentials)
function sendViaFetch(url: string, body: string): void {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    // 🚀 Critical: prevents CORS errors
    credentials: 'omit', // don’t send cookies or credentials
    mode: 'cors',        // explicitly set CORS mode
    keepalive: true,     // allow request to finish even if page unloads
  }).catch((err) => {
    console.error('fetch fallback failed:', err);
  });
}

*/



// ✅ Define a generic GA4 event interface
export interface GAEvent<P extends Record<string, unknown> = Record<string, unknown>> {
  event_name: string;
  params: P;
}

// ✅ Check if the analytics consent cookie is set
export function hasConsent(): boolean {
  return document.cookie.includes('analytics_consent=true');
}


/*
// ✅ Send a GA4 event via your local API route (no CORS issue)
export function sendGaEvent<P extends Record<string, unknown>>(event: GAEvent<P>): void {
  // Don't send anything if user hasn't given consent
  if (!hasConsent()) return;

  const url = '/api/analytics'; // ✅ Local route (Next.js proxy to mock server)
  const body = JSON.stringify(event);

  // ✅ Prefer sendBeacon — non-blocking and CORS-safe
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    } catch (err) {
      console.error('sendBeacon failed, falling back to fetch:', err);
    }
  }

  // ✅ Fallback using fetch (same-origin, so no CORS)
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true, // allow request even when page unloads
  }).catch((err) => {
    console.error('fetch fallback failed:', err);
  });
}
*/


export function sendGaEvent<P extends Record<string, unknown>>(event: GAEvent<P>): void {
  if (!hasConsent()) return;

  // ✅ choose endpoint dynamically
  const isSecure = event.event_name === 'checkout_success' || event.event_name === 'purchase';
  const url = isSecure ? '/api/analytics/secure' : '/api/analytics/gtm';
  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    } catch (err) {
      console.error('sendBeacon failed, falling back to fetch:', err);
    }
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch((err) => {
    console.error('fetch fallback failed:', err);
  });
}
