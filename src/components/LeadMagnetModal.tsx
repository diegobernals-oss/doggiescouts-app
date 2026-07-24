import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Download, CheckCircle2, BookOpen, Heart, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { LeadContact } from '../types';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured?: (lead: LeadContact) => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  isOpen,
  onClose,
  onLeadCaptured
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [dogName, setDogName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogSize, setDogSize] = useState<'pequeño' | 'mediano' | 'grande'>('mediano');
  const [optInPromos, setOptInPromos] = useState(true);

  // Ficha Canina fields
  const [vaccinesUpToDate, setVaccinesUpToDate] = useState('Sí, vacunas al día');
  const [allergies, setAllergies] = useState('');
  const [vetContact, setVetContact] = useState('');
  const [feedingHabits, setFeedingHabits] = useState('');
  const [showFichaCanina, setShowFichaCanina] = useState(false);

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadGuia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !email.trim() || !dogName.trim() || !ownerPhone.trim() || !dogBreed.trim()) {
      alert('Por favor completa todos los campos para descargar la guía (Tutor, E-mail, Perrito, Raza, WhatsApp).');
      return;
    }

    setIsSubmitting(true);

    const lead: LeadContact = {
      id: 'lead_' + Date.now(),
      ownerName,
      email,
      ownerPhone,
      dogName,
      dogBreed,
      dogSize,
      source: 'lead_magnet_guia',
      optInPromos,
      vaccinesUpToDate,
      allergies,
      vetContact,
      feedingHabits,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      if (onLeadCaptured) onLeadCaptured(lead);
    } catch (err) {
      if (onLeadCaptured) onLeadCaptured(lead);
    }

    // Generate PDF Guía de Adaptación
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Colors
      doc.setFillColor(253, 251, 247); // Sand background
      doc.rect(0, 0, 210, 297, 'F');

      // Top Header
      doc.setFillColor(143, 179, 40); // Lime green
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CAMPUS DOGGIESCOUTS BOGOTÁ', 105, 16, { align: 'center' });
      doc.setFontSize(11);
      doc.text('GUIA PANADOG: ADAPTACIÓN & BIENESTAR CANINO', 105, 25, { align: 'center' });

      // Greeting
      doc.setTextColor(45, 55, 72);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`¡Hola ${ownerName}! Esta es la Guía de Adaptación para ${dogName} 🐾`, 15, 48);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('En Campus DoggieScouts sabemos que la transición al ambiente campestre es un proceso lleno de amor y comprensión.', 15, 56, { maxWidth: 180 });

      // Step 1
      doc.setFillColor(250, 246, 239);
      doc.roundedRect(15, 66, 180, 42, 3, 3, 'F');
      doc.setTextColor(143, 179, 40);
      doc.setFont('helvetica', 'bold');
      doc.text('PASO 1: LA EVALUACIÓN DE PERSONALIDAD Y TEMPERAMENTO', 20, 75);
      doc.setTextColor(45, 55, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('• Evaluamos la interacción inicial en un espacio neutro y tranquilo.\n• Identificamos si es extrovertido, analítico o timido.\n• Le asignamos a su niñera canina madrina para acompañamiento continuo.', 20, 83);

      // Step 2
      doc.setFillColor(250, 246, 239);
      doc.roundedRect(15, 114, 180, 42, 3, 3, 'F');
      doc.setTextColor(0, 168, 232);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PASO 2: INTEGRACIÓN A LA MANADA Y SOCIALIZACIÓN SEGURO', 20, 123);
      doc.setTextColor(45, 55, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('• Formamos grupos pequeños por tamaño y nivel de energía.\n• Juegos de olfato y caminatas libres en prados campestres de Guaymaral.\n• Sin jaulas ni guacales: socialización positiva supervisada.', 20, 131);

      // Step 3
      doc.setFillColor(250, 246, 239);
      doc.roundedRect(15, 162, 180, 42, 3, 3, 'F');
      doc.setTextColor(138, 88, 220);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PASO 3: RECOMENDACIONES SANITARIAS OBLIGATORIAS', 20, 171);
      doc.setTextColor(45, 55, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('• Carnet de vacunas al día (incluyendo Tos de Perrera / Kennel Cough).\n• Desparasitación interna y externa (antipulgas y garrapatas vigente).\n• Comida porcionada para su estadía y cobijita marcada de casa.', 20, 179);

      // Footer
      doc.setFillColor(45, 55, 72);
      doc.rect(0, 260, 210, 37, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('CAMPUS DOGGIESCOUTS BOGOTÁ - VÍA GUAYMARAL, KARIMAGUA', 105, 272, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('WhatsApp: +57 322 8553138 | Instagram: @Doggiescouts | www.doggiescouts.com', 105, 281, { align: 'center' });

      doc.save(`Guia_Adaptacion_DoggieScouts_${dogName}.pdf`);
    } catch (err) {
      console.error('Error creating PDF:', err);
    }

    setIsSubmitting(false);
    setIsDownloaded(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 card-shadow-lg relative border border-amber-900/10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {!isDownloaded ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8FB328]/15 text-[#8FB328] flex items-center justify-center shadow-2xs">
                  <BookOpen size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8FB328]">Descarga Especial</span>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    GUIA PANADOG: Adaptación & Cuidado Canino
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Aprende cómo apoyamos la integración gradual de tu perrito en los prados de Guaymaral. Descarga gratis nuestro PDF de consejos prácticos.
              </p>

              <form onSubmit={handleDownloadGuia} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo Tutor *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Andrés Morales"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Contacto *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Mascota *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Toby"
                      value={dogName}
                      onChange={(e) => setDogName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Raza del Perro *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Beagle, Criollo"
                      value={dogBreed}
                      onChange={(e) => setDogBreed(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tamaño *</label>
                    <select
                      value={dogSize}
                      onChange={(e) => setDogSize(e.target.value as 'pequeño' | 'mediano' | 'grande')}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#8FB328]"
                    >
                      <option value="pequeño">Pequeño</option>
                      <option value="mediano">Mediano</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp de Contacto *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Ej: 300 9876543"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                  />
                </div>

                {/* Ficha Canina de Ingreso / Salud / Hábitos Option */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3">
                  <button
                    type="button"
                    onClick={() => setShowFichaCanina(!showFichaCanina)}
                    className="w-full flex items-center justify-between text-xs font-bold text-amber-900 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#8FB328]" />
                      📋 Ficha Canina de Ingreso y Salud (Opcional)
                    </span>
                    <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full">
                      {showFichaCanina ? 'Ocultar' : 'Completar Ficha'}
                    </span>
                  </button>

                  {showFichaCanina && (
                    <div className="mt-3 space-y-3 pt-2 border-t border-amber-200/60">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Carnet de Vacunas al Día *</label>
                        <select
                          value={vaccinesUpToDate}
                          onChange={(e) => setVaccinesUpToDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        >
                          <option value="Sí, vacunas al día">Sí, esquemas y Tos de Perrera al día</option>
                          <option value="En proceso / Próximo esquema">En proceso / Pendiente refuerzo</option>
                          <option value="Incompleto">Aún sin vacunación completa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Alergias o Condición Médica</label>
                        <input
                          type="text"
                          placeholder="Ej: Alergico al pollo, cirugía reciente, medicación..."
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Veterinario de Confianza</label>
                          <input
                            type="text"
                            placeholder="Ej: Dr. Ramírez (300 1234567)"
                            value={vetContact}
                            onChange={(e) => setVetContact(e.target.value)}
                            className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Horarios y Porción de Comida</label>
                          <input
                            type="text"
                            placeholder="Ej: 200g a las 8am y 6pm"
                            value={feedingHabits}
                            onChange={(e) => setFeedingHabits(e.target.value)}
                            className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                  <input 
                    type="checkbox" 
                    checked={optInPromos}
                    onChange={(e) => setOptInPromos(e.target.checked)}
                    className="mt-0.5 rounded text-[#8FB328] focus:ring-[#8FB328]"
                  />
                  <span>Deseo recibir consejos de cuidado canino y promociones exclusivas para mi perro.</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Download size={16} />
                  <span>{isSubmitting ? 'Generando PDF...' : 'Descargar GUIA PANADOG en PDF'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">¡Guía Descargada con Éxito!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Hemos generado la guía para **{dogName}**. Además, guardamos tus datos para enviarte sorpresas y resolver cualquier inquietud sobre el Campus.
              </p>

              <button
                onClick={onClose}
                className="bg-[#8FB328] text-white font-bold px-6 py-3 rounded-2xl text-xs hover:bg-[#7a9b1f] transition-all cursor-pointer"
              >
                Volver a la Tarjeta
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
