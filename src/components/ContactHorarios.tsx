import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircle, Phone, Download, QrCode, Mail, MapPin, X, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { WEEKLY_SCHEDULE, WHATSAPP_PHONE, WHATSAPP_DISPLAY, EMAIL_ADDRESS, LOCATION_ADDRESS, MI_DOMINIO } from '../data';

interface ContactHorariosProps {
  onOpenQR: () => void;
  onDownloadVCard: () => void;
}

export const ContactHorarios: React.FC<ContactHorariosProps> = ({
  onOpenQR,
  onDownloadVCard
}) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const bogotaDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
    const day = bogotaDate.getDay(); // 0 is Sun, 1 is Mon...
    // Map to array: 0 is Monday (index 0), 6 is Sunday (index 6)
    const mappedIndex = day === 0 ? 6 : day - 1;
    setCurrentDayIndex(mappedIndex);
  }, []);

  return (
    <section className="my-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow border border-amber-900/10">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-7 bg-[#8A58DC] rounded-full"></div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8A58DC]">Atención & Contacto</span>
            <h2 className="text-xl font-extrabold text-slate-800">Horarios & Vías de Comunicación</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Schedule Table */}
          <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-amber-900/10 pb-2">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Clock size={16} className="text-[#8FB328]" /> Horario de Operación Campus
                </span>
                <span className="text-[10px] font-bold bg-[#8FB328]/15 text-[#5F7817] px-2.5 py-0.5 rounded-full">
                  Sabana de Bogotá
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {WEEKLY_SCHEDULE.map((s, i) => {
                  const isToday = i === currentDayIndex;
                  return (
                    <div 
                      key={s.dayName}
                      className={`flex items-center justify-between py-1.5 px-3 rounded-xl transition-all ${
                        isToday ? 'bg-[#8FB328]/15 font-extrabold text-[#5F7817] border border-[#8FB328]/30' : 'text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#8FB328] animate-ping"></span>}
                        {s.dayName}
                      </span>
                      <span className="font-mono">{s.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic mt-4 text-center">
              * Festivos aplican horario especial de domingo. Atención en hotel 24 horas continuas.
            </p>
          </div>

          {/* Action Utilities Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=Hola!%0AQuiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Campus%20DOGGIESCOUTS%20%F0%9F%90%B6`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 flex flex-col items-center text-center justify-center gap-2 transition-all hover:scale-102"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xs">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#1f8f4a]">WhatsApp Directo</p>
                <p className="text-[10px] text-slate-500 font-mono">{WHATSAPP_DISPLAY}</p>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:+${WHATSAPP_PHONE}`}
              className="p-4 rounded-2xl bg-[#00A8E8]/10 hover:bg-[#00A8E8]/20 border border-[#00A8E8]/30 flex flex-col items-center text-center justify-center gap-2 transition-all hover:scale-102"
            >
              <div className="w-10 h-10 rounded-full bg-[#00A8E8] text-white flex items-center justify-center shadow-2xs">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#007EA7]">Llamada Telefónica</p>
                <p className="text-[10px] text-slate-500 font-mono">{WHATSAPP_DISPLAY}</p>
              </div>
            </a>

            {/* Download vCard */}
            <button
              onClick={onDownloadVCard}
              className="p-4 rounded-2xl bg-[#8FB328]/10 hover:bg-[#8FB328]/20 border border-[#8FB328]/30 flex flex-col items-center text-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#8FB328] text-white flex items-center justify-center shadow-2xs">
                <Download size={22} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#5F7817]">Guardar vCard</p>
                <p className="text-[10px] text-slate-500">Añadir a contactos</p>
              </div>
            </button>

            {/* QR Modal Trigger */}
            <button
              onClick={onOpenQR}
              className="p-4 rounded-2xl bg-[#8A58DC]/10 hover:bg-[#8A58DC]/20 border border-[#8A58DC]/30 flex flex-col items-center text-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#8A58DC] text-white flex items-center justify-center shadow-2xs">
                <QrCode size={22} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#6B3BB0]">Código QR</p>
                <p className="text-[10px] text-slate-500">Escaneo presencial</p>
              </div>
            </button>

            {/* Email link across full span */}
            <a
              href={`mailto:${EMAIL_ADDRESS}?subject=Consulta%20Campus%20DoggieScouts`}
              className="col-span-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-all"
            >
              <Mail size={16} className="text-[#00A8E8]" />
              <span>Correo: {EMAIL_ADDRESS}</span>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};
