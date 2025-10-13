import { NextRequest, NextResponse } from 'next/server';

// Key to access the /collect/secure endpoint, used in a header named 'Authorization' with the value 'supersecretkey'
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
