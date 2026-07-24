import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  Download,
  ShieldCheck,
  PawPrint,
  Settings,
  X,
  QrCode,
  Sparkles,
  Heart
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Components
import { WatermarkBackground } from './components/WatermarkBackground';
import { Header } from './components/Header';
import { PillarsSection } from './components/PillarsSection';
import { GalleryGrid } from './components/GalleryGrid';
import { BookingModule } from './components/BookingModule';
import { AiConsultant } from './components/AiConsultant';
import { QuoterExpress } from './components/QuoterExpress';
import { LocationRouter } from './components/LocationRouter';
import { ContactHorarios } from './components/ContactHorarios';
import { RequirementsModal } from './components/RequirementsModal';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { AdminPanel } from './components/AdminPanel';
import { QRCodeCard } from './components/QRCodeCard';

import { ASLAN_URL, HERO_LOGO_URL, WHATSAPP_PHONE, MI_DOMINIO, INSTAGRAM_LINK } from './data';
import { PricingTable } from './types';

export default function App() {
  const [showRequirements, setShowRequirements] = useState(false);
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('guarderia');
  const [customPrices, setCustomPrices] = useState<PricingTable | undefined>(undefined);

  // Helper to trigger vCard download
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Campus DoggieScouts Bogotá
ORG:Campus DoggieScouts
TEL;TYPE=CELL,VOICE:+573228553138
EMAIL:contacto@doggiescouts.com
ADR;TYPE=WORK:;;Bogotá, Vía Guaymaral, Karimagua;Bogotá;;;Colombia
URL:${MI_DOMINIO}
NOTE:Guardería Campestre, Hotel Canino 5★, Spa y Recreación en Guaymaral, Bogotá.
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DoggieScouts_Bogota.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectServiceAndBook = (serviceId: string) => {
    setSelectedServiceForBooking(serviceId);
    const bookingEl = document.getElementById('modulo-agendamiento');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-sand-pattern text-slate-800 relative font-fredoka flex flex-col justify-between selection:bg-[#8FB328] selection:text-white">
      
      {/* Background Watermark Pattern "Día Feliz Canino" */}
      <WatermarkBackground />

      {/* Header Fijo con Navegación por Secciones para PC */}
      <Header 
        onOpenRequirements={() => setShowRequirements(true)}
        onOpenQR={() => setShowQRModal(true)}
        onDownloadVCard={handleDownloadVCard}
        onOpenLeadMagnet={() => setShowLeadMagnet(true)}
        onOpenAdmin={() => setShowAdminPanel(true)}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        
        {/* Desktop 2-Column Responsive Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Left Column (Desktop 4 Cols): Featured Hostinger Profile Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 mb-8 lg:mb-0 space-y-6">
            
            {/* Aslan Hero Card */}
            <div className="bg-white rounded-3xl p-5 card-shadow border border-amber-900/10 text-center relative overflow-hidden">
              <div className="relative w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#8A58DC] via-[#8FB328] via-[#FF7B54] to-[#00A8E8] mb-3 shadow-md">
                <img 
                  src={ASLAN_URL} 
                  alt="Aslan en DoggieScouts" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500';
                  }}
                />
              </div>

              <h2 className="text-xl font-black text-slate-800">¡Bienvenidos al Campus!</h2>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Aslan y todo el equipo de niñeras caninas están listos para recibir a tu perrito en los prados de Guaymaral.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-xs">
                <div>
                  <span className="block font-black text-[#8FB328] text-base">+3.000m²</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Prados Verdes</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <span className="block font-black text-[#00A8E8] text-base">24 / 7</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Niñeras Caninas</span>
                </div>
              </div>

              {/* Instagram link */}
              <a 
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#8A58DC] font-extrabold hover:underline"
              >
                <Instagram size={15} />
                <span>Síguenos en Instagram @Doggiescouts</span>
              </a>
            </div>

            {/* Quick Banner for Lead Magnet */}
            <div 
              onClick={() => setShowLeadMagnet(true)}
              className="bg-gradient-to-r from-[#8FB328] to-[#74961b] text-white p-5 rounded-3xl card-shadow cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">PDF Exclusivo</span>
                <h3 className="font-extrabold text-sm mt-1">GUIA PANADOG</h3>
                <p className="text-[11px] opacity-90">Adaptación & bienestar canino</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-[#8FB328] flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
                <Download size={20} />
              </div>
            </div>

            {/* Admin Database & Price Modification Button */}
            <div className="text-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <button
                onClick={() => setShowAdminPanel(true)}
                className="text-xs font-extrabold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings size={14} className="text-[#8FB328]" />
                <span>Administrador</span>
              </button>
            </div>

            {/* QR Code Component under "Bienvenido a Campus" & Admin Access for PC */}
            <QRCodeCard className="hidden lg:block mt-4" />

          </aside>

          {/* Right Column (Desktop 8 Cols): Interactive Main Modules */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Nuestra Experiencia Campus (3 Pillars) */}
            <PillarsSection />

            {/* 2. Galería Interactiva (3 Columns, Sin letrero de agendar) */}
            <GalleryGrid onSelectServiceAndBook={handleSelectServiceAndBook} />

            {/* 3. Agendamiento Preferencial (Calendly & Tiquete VIP) */}
            <BookingModule preselectedServiceId={selectedServiceForBooking} />

            {/* 4. Zona de Consultas Rápidas (IA Niñera Canina) */}
            <AiConsultant />

            {/* 5. Cotizador Express de Precios */}
            <QuoterExpress customPrices={customPrices} />

            {/* 6. Enrutador de Ubicación Inteligente ("Cómo Llegar") */}
            <LocationRouter />

            {/* 7. Horarios, Contacto y Utilidades */}
            <ContactHorarios 
              onOpenQR={() => setShowQRModal(true)}
              onDownloadVCard={handleDownloadVCard}
            />

          </div>

        </div>

      </main>

      {/* Mobile QR Code Section at the Bottom of Page */}
      <div className="lg:hidden max-w-sm mx-auto my-6 px-4">
        <QRCodeCard />
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-slate-300 py-8 px-4 text-center text-xs border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-extrabold text-white text-sm">Campus DoggieScouts Bogotá</p>
          <p className="text-slate-400">Vía Guaymaral, Karimagua, Bogotá - Sabana Norte</p>
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} Campus DoggieScouts. Cuidado Amoroso Canino 24/7.
          </p>
        </div>
      </footer>

      {/* Sticky Mobile WhatsApp & Quick Action Bar */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-amber-900/15 shadow-lg flex items-center justify-between gap-2">
        <a
          href={`https://wa.me/${WHATSAPP_PHONE}?text=Hola!%0AQuiero%20agendar%20una%20visita%20a%20DOGGIESCOUTS%20%F0%9F%90%B6`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs text-center"
        >
          <MessageCircle size={16} />
          <span>WhatsApp Directo</span>
        </a>

        <button
          onClick={() => {
            const bookingEl = document.getElementById('modulo-agendamiento');
            if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#8FB328] text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
        >
          <PawPrint size={15} />
          <span>Tiquete VIP</span>
        </button>
      </div>

      {/* Modals */}
      <RequirementsModal 
        isOpen={showRequirements}
        onClose={() => setShowRequirements(false)}
      />

      <LeadMagnetModal
        isOpen={showLeadMagnet}
        onClose={() => setShowLeadMagnet(false)}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onPricesUpdated={(prices) => setCustomPrices(prices)}
      />

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center card-shadow-lg relative border border-amber-900/10"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="font-extrabold text-lg text-slate-800 mb-1">Código QR Tarjeta Virtual</h3>
              <p className="text-xs text-slate-500 mb-4">Escanea para abrir la tarjeta o guardar el contacto en tu teléfono</p>

              <div className="p-4 bg-slate-50 rounded-2xl inline-block border border-slate-200 mb-4 shadow-inner">
                <QRCodeSVG value={MI_DOMINIO} size={180} />
              </div>

              <p className="text-[11px] font-mono text-slate-500 font-bold">{MI_DOMINIO}</p>

              <button
                onClick={() => setShowQRModal(false)}
                className="mt-4 w-full bg-[#8FB328] text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cerrar QR
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
