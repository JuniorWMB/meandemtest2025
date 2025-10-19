import { NextRequest, NextResponse } from 'next/server';

const ANALYTICS_API_KEY = 'supersecretkey';

export async function POST(req: NextRequest) {
  try {
    // Read event sent from the frontend
    const adaptedEvent = await req.json();

    console.log('✅ Received event from client:', adaptedEvent);

    // Basic validation
    if (!adaptedEvent.event_type || !adaptedEvent.page_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send event to mock server
    const res = await fetch('http://localhost:4000/collect/gtm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ANALYTICS_API_KEY, // required API key
      },
      body: JSON.stringify(adaptedEvent),
    });

    // Check mock server response
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Mock server responded ${res.status}: ${text}`);
    }

    console.log('Event successfully sent to mock server');
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Handle any error
    console.error('Error in /api/analytics/gtm:', err);
    return NextResponse.json(
      {
        error: 'Failed to forward GTM event',
        details: String(err),
      },
      { status: 500 }
    );
  }
}
