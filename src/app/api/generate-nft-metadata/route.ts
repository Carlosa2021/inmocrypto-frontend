export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.THIRDWEB_SECRET_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'Falta OPENAI_API_KEY o THIRDWEB_SECRET_KEY',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const { prompt } = await request.json();
  if (!prompt || !prompt.trim()) {
    return new Response(
      JSON.stringify({
        error: 'Prompt inválido. Proporciona una idea creativa.',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    // 1. Genera nombre y descripción usando IA (Nebula)
    const metaResp = await fetch(
      'https://nebula-api.thirdweb.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 't0',
          messages: [
            {
              role: 'system',
              content: 'Eres un generador de metadata NFT profesional.',
            },
            {
              role: 'user',
              content: `Crea un nombre y descripción profesional para un NFT basado en: "${prompt}". Devuélvelo en JSON: {"name":"...","description":"..."}`,
            },
          ],
        }),
      },
    );
    const metaRaw = await metaResp.json();
    let meta: { name?: string; description?: string } = {};
    try {
      meta = JSON.parse(metaRaw?.choices?.[0]?.message?.content ?? '{}');
    } catch {
      // No lanzamos error, respondemos con mensaje controlado
      return new Response(
        JSON.stringify({
          error: 'La IA no devolvió metadatos válidos.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    if (!meta.name || !meta.description) {
      return new Response(
        JSON.stringify({
          error: 'La IA no devolvió metadatos válidos.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 2. Pedir imagen IA a Nebula
    const imgResp = await fetch(
      'https://nebula-api.thirdweb.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '1024x1024',
        }),
      },
    );
    const imgResult = await imgResp.json();
    const imageUrl = imgResult?.data?.[0]?.url ?? null;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({
          error: 'No se generó la imagen.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Responde con la metadata generada
    return new Response(
      JSON.stringify({
        name: meta.name,
        description: meta.description,
        imageUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch {
    // Quita 'err' aquí para evitar el warning de variable sin usar
    return new Response(
      JSON.stringify({
        error: 'Error llamando a la IA. Revisa tu clave y consola.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
