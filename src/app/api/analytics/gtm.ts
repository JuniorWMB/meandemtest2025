import { NextRequest, NextResponse } from 'next/server';

// Key to access the /collect/secure endpoint, used in a header named 'Authorization' with the value 'supersecretkey'
/*
const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Logic to forward the analytics event goes here
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json({
      error: 'Failed to forward analytics event',
      details: err instanceof Error ? err.message : String(err),
    });
  }
}



// Key to access the /collect/secure endpoint on the mock server
const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // 1. Read the event from the incoming request
    const event = await req.json();

    // 2. Forward the event to the /collect/secure endpoint
    const res = await fetch('http://localhost:4000/collect/secure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ANALYTICS_API_KEY,
      },
      body: JSON.stringify(event),
    });

    // 3. Check for successful response
    if (!res.ok) {
      throw new Error(`Secure endpoint responded with status ${res.status}`);
    }

    // 4. Return success
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to forward analytics event',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
*/


/*
// Mock server secure endpoint key
const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // 1️⃣ Get the analytics event data from the request body
    const event = await req.json();

    // 2️⃣ Forward it to the mock server secure endpoint
    const response = await fetch('http://localhost:4000/collect/secure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ANALYTICS_API_KEY, // required by the mock server
      },
      body: JSON.stringify(event),
    });

    // 3️⃣ Check for a valid response
    if (!response.ok) {
      throw new Error(`Mock server responded with ${response.status}`);
    }

    // 4️⃣ Return success response to the client
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    // 5️⃣ Handle errors gracefully
    return NextResponse.json(
      {
        error: 'Failed to forward analytics event',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
  */


// Secure key required by the mock server
const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  try {
    // Parse the event payload
    const event = await req.json();

    // Forward to mock server (secure endpoint)
    const res = await fetch('http://localhost:4000/collect/gtm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ANALYTICS_API_KEY, // required by mock server
      },
      body: JSON.stringify(event),
    });

    // If the mock server returns an error, throw it
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Mock server responded with ${res.status}: ${text}`);
    }

    // Return a success response
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error in /api/analytics:', err);
    return NextResponse.json(
      {
        error: 'Failed to forward analytics event',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
