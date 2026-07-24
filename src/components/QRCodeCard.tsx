import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Share2, Check, QrCode, X, Sparkles, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MI_DOMINIO } from '../data';

interface QRCodeCardProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ className = '', variant = 'full' }) => {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const qrImageUrl = '/qr_code_campus.png';

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campus DoggieScouts Bogotá',
          text: '¡Conoce Campus DoggieScouts en Guaymaral, Bogotá! Guardería Campestre & Hotel Canino 5★ 🐾',
          url: MI_DOMINIO,
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MI_DOMINIO);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2500);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleShare();
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 whitespace-nowrap border border-slate-700"
          >
            <Check size={13} className="text-emerald-400" />
            <span>¡Enlace del Campus copiado! 🐾</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive QR Card Container */}
      <div
        onClick={() => setIsZoomed(true)}
        onDoubleClick={handleDoubleClick}
        className="bg-white rounded-2xl p-3.5 border border-amber-900/15 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group/card hover:border-[#8FB328]"
        title="Clic para ampliar • Doble clic para compartir"
      >
        {/* Header Label */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-800">
            <QrCode size={14} className="text-[#8FB328]" />
            <span>Código QR Campus</span>
          </div>

          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
            Escaneo Rápido
          </span>
        </div>

        {/* QR Image Display Area with Hover Overlay */}
        <div className="relative bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-center group-hover/card:bg-slate-100/80 transition-colors">
          
          {/* Action Corner Icons Overlay */}
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1">
            {/* Zoom / Expand Corner Icon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-xs transition-transform hover:scale-110 shadow-xs cursor-pointer"
              title="Ampliar QR para escanear"
            >
              <Maximize2 size={11} />
            </button>

            {/* Share Corner Icon */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 bg-[#8FB328] hover:bg-[#7a9b1f] text-white rounded-lg transition-transform hover:scale-110 shadow-xs cursor-pointer"
              title="Doble Clic / Clic para Compartir"
            >
              <Share2 size={11} />
            </button>
          </div>

          {/* QR Image or Fallback SVG */}
          <div className="w-28 h-28 flex items-center justify-center relative">
            {!imageError ? (
              <img
                src={qrImageUrl}
                alt="Código QR Campus DoggieScouts"
                className="w-full h-full object-contain rounded-lg group-hover/card:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="p-1 bg-white rounded-lg shadow-2xs">
                <QRCodeSVG
                  value={MI_DOMINIO}
                  size={100}
                  bgColor="#FFFFFF"
                  fgColor="#1E293B"
                  level="M"
                />
              </div>
            )}
          </div>

          {/* Hover Guidance Label */}
          <div className="absolute inset-x-0 bottom-1 opacity-0 group-hover/card:opacity-100 transition-opacity text-center pointer-events-none">
            <span className="bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              🔍 Clic: Ampliar • 2 Clics: Compartir
            </span>
          </div>
        </div>

        {/* Footer info text */}
        <div className="mt-2 text-center">
          <p className="text-[10px] text-slate-500 font-medium">
            Escanea con la cámara de tu celular
          </p>
          <p className="text-[9px] font-mono text-slate-400 font-bold truncate">
            {MI_DOMINIO}
          </p>
        </div>
      </div>

      {/* EXPANDED / ZOOMED QR MODAL */}
      <AnimatePresence>
        {isZoomed && (
          <div 
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-slate-200 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="inline-flex p-2.5 bg-[#8FB328]/10 text-[#8FB328] rounded-2xl mb-3">
                <QrCode size={24} />
              </div>

              <h3 className="font-black text-lg text-slate-800">
                Código QR Campus
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-4 font-medium">
                Apunta la cámara de tu celular para ingresar directo a la web
              </p>

              {/* Large QR Display */}
              <div className="p-5 bg-slate-50 rounded-2xl inline-block border border-slate-200 mb-4 shadow-inner relative group/large">
                <div className="w-52 h-52 mx-auto flex items-center justify-center bg-white p-2 rounded-xl shadow-xs">
                  {!imageError ? (
                    <img
                      src={qrImageUrl}
                      alt="Código QR Ampliado"
                      className="w-full h-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <QRCodeSVG
                      value={MI_DOMINIO}
                      size={190}
                      bgColor="#FFFFFF"
                      fgColor="#1E293B"
                      level="H"
                    />
                  )}
                </div>
              </div>

              <p className="text-xs font-mono text-slate-600 font-extrabold bg-slate-100 py-1.5 px-3 rounded-xl inline-block mb-4">
                {MI_DOMINIO}
              </p>

              {/* Action Buttons inside Modal */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Share2 size={15} />
                  <span>{copied ? '¡Copiado!' : 'Compartir Enlace'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
