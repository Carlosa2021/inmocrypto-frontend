'use client';

import { useState } from 'react';

export default function NebulaAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/nebula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          // Puedes dejar esto vacío o usar un UUID válido si necesitas sesiones persistentes
          sessionId: undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message || 'Sin respuesta');
      } else {
        setResponse(data.error || 'Error desconocido al comunicar con Nebula.');
      }
    } catch (err) {
      console.error('Error en handleAsk:', err);
      setResponse('Error al comunicar con Nebula.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        🧠 Nebula Chat Admin
      </h1>

      <textarea
        className="w-full border border-gray-400 p-3 rounded mb-4 text-black"
        rows={3}
        placeholder="Escribe tu pregunta..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Consultando...' : 'Preguntar a Nebula'}
        </button>
      </div>

      <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50 min-h-[80px]">
        <strong>Respuesta:</strong>
        <p className="mt-2 whitespace-pre-line text-gray-700">
          {response || 'Sin respuesta'}
        </p>
      </div>
    </div>
  );
}
