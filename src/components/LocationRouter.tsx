import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink, Compass, ShieldCheck } from 'lucide-react';
import { GOOGLE_MAPS_LINK, WAZE_LINK, LOCATION_ADDRESS } from '../data';

export const LocationRouter: React.FC = () => {
  return (
    <section className="my-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow border border-amber-900/10">
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-7 bg-[#00A8E8] rounded-full"></div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00A8E8]">Ubicación Campestre</span>
            <h2 className="text-xl font-extrabold text-slate-800">¿Cómo Llegar a Campus DoggieScouts?</h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Ubicados en la zona campestre de Guaymaral al norte de Bogotá, rodeados de aire puro, naturaleza y tranquilidad para la diversión de tu mascota.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Google Maps Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/40 border border-sky-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#00A8E8] font-bold text-xs mb-2">
                <MapPin size={18} />
                <span>Navegación Google Maps</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Abre la ruta oficial paso a paso en tu app de Google Maps para llegar sin complicaciones a nuestro campus en Vía Guaymaral.
              </p>
            </div>

            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00A8E8] hover:bg-[#0092ca] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-102"
            >
              <span>Abrir en Google Maps</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Waze Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50/40 border border-cyan-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#33CCFF] font-bold text-xs mb-2">
                <Navigation size={18} className="text-cyan-600" />
                <span className="text-slate-800 font-extrabold">Navegación Waze GPS</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Inicia la ruta en tiempo real con alertas de tráfico directamente en la aplicación Waze.
              </p>
            </div>

            <a
              href={WAZE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-102"
            >
              <span>Abrir en Waze GPS</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>

        {/* Embedded Map Visual Card */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8FB328]/20 text-[#6E8B1A] flex items-center justify-center flex-shrink-0 font-bold">
              <Compass size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{LOCATION_ADDRESS}</p>
              <p className="text-[11px] text-slate-500">Ruta segura con servicio de transporte puerta a puerta en Bogotá y alrededores.</p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-[#8FB328]/15 text-[#5F7817] px-3 py-1 rounded-full whitespace-nowrap">
            Zona Campestre Segura
          </span>
        </div>

      </div>
    </section>
  );
};
