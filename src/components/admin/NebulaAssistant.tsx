'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react'; // ícono moderno

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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white/5 border border-white/10 shadow-xl rounded-2xl p-6 backdrop-blur-md">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-purple-600 mb-6">
          <Sparkles className="w-6 h-6 animate-pulse" />
          Nebula Chat Admin
        </h1>

        <textarea
          className="w-full text-sm p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition min-h-[100px] resize-none text-black"
          placeholder="Escribe tu pregunta para Nebula..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Preguntar a Nebula'}
          </button>
        </div>

        <div className="mt-8 bg-gray-100 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Respuesta:
          </h2>
          <p className="whitespace-pre-line text-gray-700">
            {response || 'Sin respuesta'}
          </p>
        </div>
      </div>
    </div>
  );
}
