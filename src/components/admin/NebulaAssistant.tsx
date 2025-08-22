'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function NebulaAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(uuidv4());
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('https://api.thirdweb.com/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'x-secret-key': 'your-secret-key', // agrega tu key si la necesitas
        },
        body: JSON.stringify({
          context: {
            // from: '0x123...', // opcional
            // chain_ids: [1, 137], // opcional
            // session_id: 'tu-session-id', // opcional
          },
          messages: [{ role: 'user', content: input }],
          stream: false,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        let respText = '';
        if (typeof data.message === 'string') {
          respText = data.message;
        } else if (data.result && typeof data.result.content === 'string') {
          respText = data.result.content;
        } else {
          respText = 'Sin respuesta';
        }
        setResponse(respText);
        setInput('');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'nebula',
            content:
              'Error: ' +
              (typeof data.error === 'string'
                ? data.error
                : JSON.stringify(data.error) ||
                  'Error desconocido al comunicar con Nebula.'),
            timestamp: Date.now(),
          },
        ]);
      }
    } catch {
      setResponse('Error al comunicar con Nebula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-5 md:p-8 backdrop-blur-xl">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-purple-700 mb-6">
          <Sparkles className="w-7 h-7 animate-pulse" />
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
