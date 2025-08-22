import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  if (!path) {
    return NextResponse.json(
      { error: 'Falta el parámetro "path"' },
      { status: 400 },
    );
  }
<<<<<<< HEAD
  // Validación básica de hash IPFS
  if (!/^[a-zA-Z0-9]+$/.test(path)) {
    return NextResponse.json(
      { error: 'Parámetro "path" inválido' },
      { status: 400 },
    );
  }
  const url = `https://ipfscdn.io/ipfs/${path}`;
  const response = await fetch(url, {
    headers: {
      'x-client-id': process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '',
    },
  });
=======
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '';
  if (!clientId) {
    return NextResponse.json(
      { error: 'Falta NEXT_PUBLIC_THIRDWEB_CLIENT_ID' },
      { status: 500 },
    );
  }

  const url = `https://ipfscdn.io/ipfs/${path}`;
  let response: Response;
  try {
    response = await fetch(url, { headers: { 'x-client-id': clientId } });
  } catch {
    return NextResponse.json(
      { error: 'Error de red al intentar acceder al gateway IPFS' },
      { status: 502 },
    );
  }

>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
  if (!response.ok) {
    return NextResponse.json(
      { error: 'No se pudo obtener el archivo IPFS' },
      { status: response.status },
    );
  }

  const contentType =
    response.headers.get('content-type') || 'application/octet-stream';
  const contentLength = response.headers.get('content-length');
  const blob = await response.blob();

  return new NextResponse(blob, {
    status: 200,
    headers: {
<<<<<<< HEAD
      'Content-Type':
        response.headers.get('content-type') || 'application/octet-stream',
=======
      'Content-Type': contentType,
      ...(contentLength ? { 'Content-Length': contentLength } : {}),
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
