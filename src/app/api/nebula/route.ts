<<<<<<< HEAD
import { NextResponse } from 'next/server';

const AI_CHAT_URL = 'https://api.thirdweb.com/ai/chat';
=======
import { NextRequest, NextResponse } from 'next/server';

const NEBULA_URL = 'https://api.thirdweb.com/ai/chat';
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

interface NebulaAPIRequest {
  message: string;
  sessionId?: string;
}

interface NebulaAPIResponse {
  message?: string;
  result?: { content?: string };
  choices?: { message?: { content?: string } }[];
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
<<<<<<< HEAD
    const { message, sessionId, walletAddress, chainIds } = await req.json();
=======
    const { message, sessionId }: NebulaAPIRequest = await req.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Falta el mensaje de usuario.' },
        { status: 400 },
      );
    }

    const payload: {
      messages: { role: 'user'; content: string }[];
      stream: boolean;
      context?: { session_id: string };
    } = {
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: false,
    };

    if (sessionId) {
      payload.context = { session_id: sessionId };
    }
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad

    // Construir el payload según la nueva API
    const payload = {
      context: {
        from: walletAddress, // Opcional: dirección de wallet
        chain_ids: chainIds, // Opcional: array de chain IDs
        session_id: sessionId, // Opcional: para mantener la sesión
      },
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: false,
    };

    const response = await fetch(AI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': SECRET_KEY || '',
      },
      body: JSON.stringify(payload),
    });

    const data: NebulaAPIResponse = await response.json();

    // Normaliza y escoge la respuesta principal usando const (no let)
    const content: string =
      (typeof data.message === 'string' && data.message) ||
      (typeof data.result?.content === 'string' && data.result.content) ||
      (Array.isArray(data.choices) &&
      typeof data.choices[0]?.message?.content === 'string'
        ? data.choices[0].message?.content
        : '') ||
      '';

    return NextResponse.json({
      ...data,
      message: content || 'Sin respuesta',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('AI Chat API error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'AI Chat API route is active ✅',
  });
}
