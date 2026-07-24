import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Eye } from 'lucide-react';
import { DEFAULT_GALLERY } from '../data';

interface GalleryGridProps {
  onSelectServiceAndBook: (serviceId: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ onSelectServiceAndBook }) => {
  const [selectedImg, setSelectedImg] = useState<{ url: string; title: string } | null>(null);

  return (
    <section id="galeria" className="my-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-7 bg-[#00A8E8] rounded-full"></div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00A8E8]">Galería Interactiva</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-800">Conoce el Campus en Acción</h2>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Haz clic sobre cualquier imagen para verla en pantalla completa 📷
        </p>
      </div>

      {/* Grid distribuidos ordenadamente en 3 columnas en desktop / 2 columnas en mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {DEFAULT_GALLERY.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedImg({ url: item.url, title: item.title })}
            className="group relative rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-amber-900/10 cursor-pointer h-52 sm:h-60 md:h-64 flex flex-col justify-end"
          >
            {/* Image */}
            <img 
              src={item.url} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop`;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity"></div>

            {/* Top Right Zoom Icon Indicator */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                <Maximize2 size={14} />
              </div>
            </div>

            {/* Bottom Caption - Sin letrero de agendar */}
            <div className="relative z-10 p-4 text-white">
              <p className="text-xs md:text-sm font-bold leading-snug drop-shadow-md">
                {item.title}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-amber-200/90 font-medium">
                <Eye size={11} /> Toca para ver en detalle
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal para ver la foto ampliada */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImg.url} 
                alt={selectedImg.title} 
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="p-4 bg-slate-900 text-white w-full text-center border-t border-slate-800 flex items-center justify-between px-6">
                <span className="font-bold text-sm">{selectedImg.title}</span>
                <button
                  onClick={() => setSelectedImg(null)}
                  className="bg-slate-800 hover:bg-rose-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X size={16} /> Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
