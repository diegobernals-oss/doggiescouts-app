import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, MessageCircle, Bot, User, HelpCircle, HeartHandshake } from 'lucide-react';
import { AI_SUGGESTED_QUESTIONS, WHATSAPP_PHONE } from '../data';
import { AIConsultationMessage } from '../types';

export const AiConsultant: React.FC = () => {
  const [messages, setMessages] = useState<AIConsultationMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy la Niñera Canina Experta de Campus DoggieScouts Bogotá 🐾❤️. ¿Tienes dudas sobre la adaptación de tu perrito, requisitos sanitarios, rutas en Guaymaral o cuidado en nuestro hotel? Pregúntame lo que quieras.',
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: AIConsultationMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();

      const botReply: AIConsultationMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: data.reply || '¡Gracias por consultar! Te invitamos a escribirnos por WhatsApp al 322 8553138 para agendar tu visita.',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      const fallbackReply: AIConsultationMessage = {
        id: 'bot_err_' + Date.now(),
        sender: 'assistant',
        text: '¡Hola! En Campus DoggieScouts Bogotá cuidamos a cada perrito como si fuera nuestro. Escríbenos directamente a nuestro WhatsApp 322 8553138 para responder todas tus preguntas de forma personalizada. 🐾❤️',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-8">
      <div className="bg-gradient-to-br from-white via-[#FAF6EF] to-[#F3ECE0] rounded-3xl p-6 md:p-8 card-shadow border border-[#8A58DC]/20">
        
        {/* Title */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-7 bg-[#8A58DC] rounded-full"></div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8A58DC] flex items-center gap-1">
                <Sparkles size={12} /> Zona de Consultas Rápidas (IA)
              </span>
              <h2 className="text-xl font-extrabold text-slate-800">Pregúntale a nuestra Niñera Canina Experta</h2>
            </div>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-bold bg-[#8A58DC]/10 text-[#6B3BB0] px-3 py-1 rounded-full border border-[#8A58DC]/20">
            Respuesta Instantánea 24/7
          </span>
        </div>

        {/* Suggested Chips */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle size={12} /> Preguntas frecuentes de otros tutores en Bogotá:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AI_SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(q)}
                disabled={isLoading}
                className="bg-white hover:bg-[#8A58DC]/10 text-slate-700 hover:text-[#6B3BB0] text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-900/10 hover:border-[#8A58DC]/30 transition-all cursor-pointer shadow-2xs text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="bg-white rounded-2xl p-4 border border-amber-900/10 shadow-inner max-h-80 overflow-y-auto space-y-3 mb-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#8A58DC] text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-1">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#00A8E8] text-white rounded-tr-none font-medium'
                    : 'bg-[#FAF6EF] text-slate-800 rounded-tl-none border border-amber-900/10 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`text-[9px] mt-1 block text-right font-medium ${m.sender === 'user' ? 'text-white/75' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#00A8E8] text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-1">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-[#8A58DC] font-bold p-2 bg-[#8A58DC]/5 rounded-xl">
              <Bot size={16} className="animate-spin" />
              <span>Nuestra Niñera Canina está redactando tu respuesta... 🐾</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe aquí tu duda (ej: ¿Qué vacunas necesitan?)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            className="flex-1 p-3 rounded-2xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8A58DC]"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-[#8A58DC] hover:bg-[#7747C8] disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Consultar</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=Hola!%0AQuiero%20hablar%20con%20una%20ni%C3%B1era%20canina%20en%20vivo%20sobre%20el%20Campus%20DOGGIESCOUTS%20%F0%9F%90%B6`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold hover:underline"
          >
            <MessageCircle size={14} />
            <span>¿Prefieres hablar directamente por WhatsApp? Haz clic aquí</span>
          </a>
        </div>

      </div>
    </section>
  );
};
