import { NextRequest, NextResponse } from 'next/server';

const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  try {
    // Read request body
    const adaptedEvent = await req.json();

    // Basic validation
    if (!adaptedEvent.event_type || !adaptedEvent.page_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send event to mock server
    const res = await fetch('http://localhost:4000/collect/secure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ANALYTICS_API_KEY, // required auth key
      },
      body: JSON.stringify(adaptedEvent),
    });

    // Check server response
    if (!res.ok) {
      const text = await res.text();
      console.error('Mock server error:', res.status, text);
      throw new Error(`Mock server responded ${res.status}: ${text}`);
    }

    // Success response
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Handle error
    console.error('Error in /api/analytics/secure:', err);
    return NextResponse.json(
      {
        error: 'Failed to forward SECURE event',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
