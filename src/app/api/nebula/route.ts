// src/app/api/nebula/route.ts
import { NextResponse } from 'next/server';

const NEBULA_URL = 'https://nebula-api.thirdweb.com/chat';
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    const response = await fetch(NEBULA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': SECRET_KEY || '',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Nebula API error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Nebula API route is active ✅' });
}
