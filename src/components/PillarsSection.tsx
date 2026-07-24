import React from 'react';
import { motion } from 'framer-motion';
import { Trees, Heart, Users, Sparkles, CheckCircle } from 'lucide-react';

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: Trees,
      title: 'Aire Puro Campestre',
      tag: 'Guaymaral, Bogotá',
      color: 'bg-[#8FB328]/10 text-[#6E8B1A] border-[#8FB328]/20',
      iconBg: 'bg-[#8FB328] text-white',
      description: 'Más de 3.000m² de prados verdes al aire libre para correr libres, respirar naturaleza y disfrutar el sol de la Sabana de Bogotá.',
      perks: ['Césped natural suave', 'Zona de sombra y descanso', 'Libertad absoluta supervisada']
    },
    {
      icon: Heart,
      title: 'Cuidado Estilo Niñera 24/7',
      tag: 'Atención Con Amor',
      color: 'bg-[#8A58DC]/10 text-[#6E3BB0] border-[#8A58DC]/20',
      iconBg: 'bg-[#8A58DC] text-white',
      description: 'Nuestras niñeras caninas están presentes en todo momento. Brindamos abrazos, medicamentos a tiempo y acompañamiento nocturno en el hotel.',
      perks: ['Atención personalizada', 'Reportes diarios con foto/video', 'Sin guacales ni encierros']
    },
    {
      icon: Users,
      title: 'Socialización Segura',
      tag: 'Manada Harmoniosa',
      color: 'bg-[#00A8E8]/10 text-[#007EA7] border-[#00A8E8]/20',
      iconBg: 'bg-[#00A8E8] text-white',
      description: 'Evaluamos la personalidad de cada peludito para agruparlo con amigos afines por tamaño, energía y temperamento.',
      perks: ['Integración paulatina', 'Supervisión constante', 'Juegos de estimulación mental']
    }
  ];

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-7 bg-[#8FB328] rounded-full"></div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8FB328]">Nuestra Experiencia Campus</span>
          <h2 className="text-xl font-extrabold text-slate-800">¿Por qué elegir DoggieScouts Bogotá?</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-3xl border bg-white card-shadow flex flex-col justify-between transition-all hover:-translate-y-1`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl ${p.iconBg} flex items-center justify-center shadow-sm`}>
                  <p.icon size={24} />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.color}`}>
                  {p.tag}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-800 mb-1.5">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{p.description}</p>
            </div>

            <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
              {p.perks.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-[#8FB328] flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
