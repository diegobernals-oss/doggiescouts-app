import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Check, Syringe, Bug, HeartHandshake, Home } from 'lucide-react';

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequirementsModal: React.FC<RequirementsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const requirements = [
    {
      icon: Syringe,
      title: 'Carnet de Vacunación Completo al Día',
      desc: 'Sextuple o Múltiple + Rabia + Vacuna contra la Tos de Perrera (KC / Bordetella obligatoria).'
    },
    {
      icon: Bug,
      title: 'Protección Antipulgas y Garrapatas Vigente',
      desc: 'Pastilla o pipeta aplicada en los últimos 30 días para proteger a toda la manada campestre.'
    },
    {
      icon: HeartHandshake,
      title: 'Evaluación de Comportamiento Aprobada',
      desc: 'Prueba de socialización positiva para verificar que disfruta jugar en grupo sin agresividad.'
    },
    {
      icon: Home,
      title: 'Alimentación y Cobijita de Casa',
      desc: 'Para hotel o pasadía, traer su comida habitual porcionada y una prenda o mantita con olor a hogar.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 card-shadow-lg relative border border-amber-900/10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8A58DC]/15 text-[#8A58DC] flex items-center justify-center shadow-2xs">
              <ShieldCheck size={28} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8A58DC]">Seguridad y Salud</span>
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                Requisitos Obligatorios de Ingreso
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            Para garantizar un ambiente 100% seguro y saludable en nuestros prados verdes de Guaymaral, solicitamos cumplir con los siguientes requisitos sanitarios:
          </p>

          <div className="space-y-3 mb-6">
            {requirements.map((req, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#FAF6EF] border border-amber-900/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8FB328] text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                  <req.icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{req.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            Entendido y Aceptado
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
