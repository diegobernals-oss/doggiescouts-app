import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  Download, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Settings,
  Compass,
  Calendar,
  Image as ImageIcon,
  Bot,
  Calculator,
  Phone
} from 'lucide-react';
import { HERO_LOGO_URL, WHATSAPP_PHONE, GOOGLE_MAPS_LINK, LOCATION_ADDRESS } from '../data';

interface HeaderProps {
  onOpenRequirements: () => void;
  onOpenQR: () => void;
  onDownloadVCard: () => void;
  onOpenLeadMagnet: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRequirements,
  onOpenQR,
  onDownloadVCard,
  onOpenLeadMagnet,
  onOpenAdmin
}) => {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const bogotaTimeStr = now.toLocaleString("en-US", { timeZone: "America/Bogota" });
      const bogotaDate = new Date(bogotaTimeStr);
      
      const day = bogotaDate.getDay();
      const hours = bogotaDate.getHours();
      const minutes = bogotaDate.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      setTimeString(bogotaDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));

      // Mon-Fri: 06:00 (360m) - 20:00 (1200m)
      // Sat-Sun: 08:00 (480m) - 18:30 (1110m)
      if (day >= 1 && day <= 5) {
        setIsOpenNow(currentMinutes >= 360 && currentMinutes < 1200);
      } else {
        setIsOpenNow(currentMinutes >= 480 && currentMinutes < 1110);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Mobile Top Header with Guardería Logo (Non-sticky) */}
      <div className="md:hidden w-full bg-white border-b border-amber-900/15 shadow-2xs px-4 py-3 flex items-center justify-start">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          {/* Guardería Logo with halo border */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#8A58DC] via-[#8FB328] via-[#FF7B54] to-[#00A8E8] rounded-xl blur-2xs opacity-80"></div>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 border border-white shadow-xs flex items-center justify-center">
              <img 
                src={HERO_LOGO_URL} 
                alt="Logo Guardería DoggieScouts" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300';
                }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none flex items-center gap-1">
              Campus <span className="text-[#8FB328]">DoggieScouts</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
              Guardería Campestre & Hotel 🐾
            </p>
          </div>
        </div>
      </div>

      {/* Desktop PC Header */}
      <header className="hidden md:block sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-900/15 shadow-sm transition-all duration-300">
        
        {/* Top Utility Bar for PC */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            
            {/* Status & Address for PC */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOpenNow ? 'bg-emerald-400 opacity-75' : 'bg-rose-400 opacity-75'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span className={isOpenNow ? 'text-emerald-400' : 'text-rose-400'}>
                  {isOpenNow ? 'Abierto Ahora' : 'Cerrado (Abre 06:00 AM)'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-mono"><Clock size={11} className="inline mr-1" />{timeString}</span>
              </div>

              <span className="hidden md:inline text-slate-600">|</span>

              {/* Dirección destacada para PC */}
              <div className="hidden md:flex items-center gap-1 text-slate-200 font-medium">
                <MapPin size={12} className="text-[#00A8E8]" />
                <span>{LOCATION_ADDRESS}</span>
              </div>
            </div>

            {/* Quick Links / Admin Key Badge */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onOpenLeadMagnet}
                className="text-[#8FB328] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={11} />
                <span>GUIA PANADOG</span>
              </button>

              <span className="text-slate-700">|</span>

              <button
                onClick={onOpenAdmin}
                className="text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 text-[10px]"
                title="Administrador"
              >
                <Settings size={11} className="text-[#8FB328]" />
                <span>Administrador</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main PC Header Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title with 4-Color Motif from Card */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo with 4-Color Gradient Halo reflecting physical card (Purple, Lime, Coral, Cyan) */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#8A58DC] via-[#8FB328] via-[#FF7B54] to-[#00A8E8] rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-xl overflow-hidden bg-white p-1 border border-white shadow-xs flex items-center justify-center">
                <img 
                  src={HERO_LOGO_URL} 
                  alt="Logo Campus DoggieScouts" 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300';
                  }}
                />
              </div>
            </div>

            <div>
              <h1 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none flex items-center gap-1">
                Campus <span className="text-[#8FB328]">DoggieScouts</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                Bogotá • Guaymaral 🐾
              </p>
            </div>
          </div>

          {/* Section Links Bar for Desktop PC */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-extrabold text-slate-700 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button 
              onClick={() => scrollToSection('campus')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#8FB328] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Compass size={13} className="text-[#8FB328]" />
              <span>Campus</span>
            </button>

            <button 
              onClick={() => scrollToSection('galeria')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#00A8E8] transition-all flex items-center gap-1 cursor-pointer"
            >
              <ImageIcon size={13} className="text-[#00A8E8]" />
              <span>Galería</span>
            </button>

            <button 
              onClick={() => scrollToSection('modulo-agendamiento')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#8A58DC] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Calendar size={13} className="text-[#8A58DC]" />
              <span>Agendamiento</span>
            </button>

            <button 
              onClick={() => scrollToSection('consultas-ia')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#FF7B54] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Bot size={13} className="text-[#FF7B54]" />
              <span>Consultas IA</span>
            </button>

            <button 
              onClick={() => scrollToSection('cotizador-express')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#8FB328] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Calculator size={13} className="text-[#8FB328]" />
              <span>Cotizador</span>
            </button>

            <button 
              onClick={() => scrollToSection('ubicacion-guaymaral')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-[#00A8E8] transition-all flex items-center gap-1 cursor-pointer"
            >
              <MapPin size={13} className="text-[#00A8E8]" />
              <span>Ubicación</span>
            </button>

            <button 
              onClick={() => scrollToSection('contacto-horarios')}
              className="px-3 py-1.5 rounded-xl hover:bg-white hover:text-slate-900 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Clock size={13} className="text-slate-600" />
              <span>Horarios</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=Hola!%0AQuiero%20saber%20m%C3%A1s%20sobre%20el%20Campus%20DOGGIESCOUTS%20%F0%9F%90%B6%E2%9D%A4%EF%B8%8F`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-102"
            >
              <MessageCircle size={15} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={onOpenRequirements}
              className="hidden sm:flex bg-[#8A58DC]/10 hover:bg-[#8A58DC]/20 text-[#6B3BB0] font-extrabold px-3 py-2 rounded-xl text-xs border border-[#8A58DC]/20 items-center gap-1 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>Requisitos</span>
            </button>
          </div>

        </div>

      </header>
    </>
  );
};
