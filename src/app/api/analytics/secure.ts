import { NextRequest, NextResponse } from 'next/server';

// Secure key required by the mock server
const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  try {
    // Parse the event payload
    const event = await req.json();

    // Forward to mock server (secure endpoint)
    const res = await fetch('http://localhost:4000/collect/secure', {
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
