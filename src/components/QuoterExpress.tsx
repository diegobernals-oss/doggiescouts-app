import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, MessageCircle, Dog, Calendar, Check, Sparkles, CheckSquare } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DEFAULT_PRICES, DEFAULT_SERVICES, WHATSAPP_PHONE } from '../data';
import { QuoteItem, LeadContact, PricingTable } from '../types';

interface QuoterExpressProps {
  onLeadCaptured?: (lead: LeadContact) => void;
  customPrices?: PricingTable;
}

export const QuoterExpress: React.FC<QuoterExpressProps> = ({ onLeadCaptured, customPrices }) => {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogSize, setDogSize] = useState<'pequeño' | 'mediano' | 'grande'>('mediano');
  const [serviceId, setServiceId] = useState('guarderia');
  const [days, setDays] = useState(1);
  const [optInPromos, setOptInPromos] = useState(true);

  const [activePrices, setActivePrices] = useState<PricingTable>(customPrices || DEFAULT_PRICES);
  const [quoteResult, setQuoteResult] = useState<QuoteItem | null>(null);

  useEffect(() => {
    if (customPrices) {
      setActivePrices(customPrices);
      return;
    }
    const stored = localStorage.getItem('doggiescouts_custom_prices');
    if (stored) {
      try {
        setActivePrices(JSON.parse(stored));
      } catch (e) {}
    } else {
      fetch('/api/prices')
        .then(r => r.json())
        .then(data => {
          if (data.prices) setActivePrices(data.prices);
        })
        .catch(() => {});
    }
  }, [customPrices]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !email.trim() || !ownerPhone.trim() || !dogName.trim() || !dogBreed.trim()) {
      alert('Por favor completa todos los campos (Tutor, E-mail, Teléfono, Perrito, Raza).');
      return;
    }

    const priceList = activePrices[serviceId] || DEFAULT_PRICES[serviceId] || DEFAULT_PRICES['guarderia'];
    const basePrice = priceList[dogSize] || 150000;
    
    let discount = 0;
    let total = basePrice;

    if (serviceId === 'hotel') {
      total = basePrice * days;
      if (days >= 8) {
        discount = 8; // 8% discount for hotel stays >= 8 days
        total = total * 0.92;
      }
    }

    const serviceObj = DEFAULT_SERVICES.find(s => s.id === serviceId) || DEFAULT_SERVICES[0];

    const newQuote: QuoteItem = {
      dogName,
      dogSize,
      serviceId,
      serviceName: serviceObj.name,
      days: serviceId === 'hotel' ? days : 1,
      total: Math.round(total),
      discount,
      createdAt: new Date().toISOString()
    };

    setQuoteResult(newQuote);

    // Save lead automatically with complete data
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerName,
        email,
        ownerPhone,
        dogName,
        dogBreed,
        dogSize,
        source: 'cotizador_express',
        optInPromos
      })
    }).catch(() => {});
  };

  const handleConfirmWhatsApp = () => {
    if (!quoteResult) return;
    const formatTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(quoteResult.total);
    
    const text = `¡Hola Campus DoggieScouts! 🐶❤️%0A%0AHe realizado una cotización en la tarjeta virtual:%0A%0A🐾 *Perrito:* ${quoteResult.dogName} (${quoteResult.dogSize})%0A🌲 *Servicio:* ${quoteResult.serviceName}${quoteResult.serviceId === 'hotel' ? ` (${quoteResult.days} días)` : ''}%0A💰 *Inversión Estimada:* ${formatTotal}${quoteResult.discount > 0 ? ` (Aplica ${quoteResult.discount}% de descuento)` : ''}%0A%0AMe gustaría confirmar la disponibilidad de fechas para la estadía de mi perrito. ¡Muchas gracias!`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
  };

  const handleDownloadPDF = () => {
    if (!quoteResult) return;
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Sand background
      doc.setFillColor(253, 251, 247);
      doc.rect(0, 0, 210, 297, 'F');

      // Top Banner
      doc.setFillColor(143, 179, 40);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('CAMPUS DOGGIESCOUTS BOGOTÁ', 105, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.text('PROPUESTA Y COTIZACIÓN OFICIAL DE SERVICIOS', 105, 24, { align: 'center' });

      // Body text
      doc.setTextColor(45, 55, 72);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Propuesta Especial para el consentido: ${quoteResult.dogName} 🐾`, 15, 45);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Agradecemos sinceramente la oportunidad de atender a tu mascota en nuestras instalaciones campestres en Vía Guaymaral. Nos comprometemos a dedicar nuestro mejor esfuerzo y cariño para que se sienta feliz, seguro y como en su propio hogar.', 15, 53, { maxWidth: 180 });

      // Table Box
      doc.setFillColor(250, 246, 239);
      doc.roundedRect(15, 72, 180, 50, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.text('DETALLE DEL SERVICIO:', 20, 82);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Servicio Seleccionado: ${quoteResult.serviceName}`, 20, 90);
      doc.text(`• Tamaño de la Mascota: ${quoteResult.dogSize.toUpperCase()}`, 20, 97);
      if (quoteResult.serviceId === 'hotel') {
        doc.text(`• Días de Estadía: ${quoteResult.days} noches`, 20, 104);
      }
      if (quoteResult.discount > 0) {
        doc.text(`• Descuento Especial Aplicado: ${quoteResult.discount}% por estadía prolongada`, 20, 111);
      }

      // Investment total box
      const formatTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(quoteResult.total);
      
      doc.setFillColor(138, 88, 220);
      doc.roundedRect(15, 130, 180, 24, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`INVERSIÓN ESTIMADA TOTAL: ${formatTotal}`, 105, 145, { align: 'center' });

      // Note
      doc.setTextColor(45, 55, 72);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Nota: Esta cotización es válida por 15 días. Incluye atención supervisada 24/7, acceso a prados campestres y reporte diario en fotos/videos.', 15, 165, { maxWidth: 180 });

      // Footer
      doc.setFillColor(45, 55, 72);
      doc.rect(0, 260, 210, 37, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CAMPUS DOGGIESCOUTS BOGOTÁ - VÍA GUAYMARAL, KARIMAGUA', 105, 272, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('WhatsApp: +57 322 8553138 | Instagram: @Doggiescouts', 105, 281, { align: 'center' });

      doc.save(`Cotizacion_DoggieScouts_${quoteResult.dogName}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <section id="cotizador-express" className="my-8 scroll-mt-24">
      <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow border border-amber-900/10">
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-7 bg-[#8FB328] rounded-full"></div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8FB328]">Inversión Transparente</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">Cotizador Express de Servicios</h2>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Tutor *</label>
              <input 
                type="text" 
                required
                placeholder="Ej: Carolina Gómez"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Contacto *</label>
              <input 
                type="email" 
                required
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp de Contacto *</label>
              <input 
                type="tel" 
                required
                placeholder="Ej: 310 1234567"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
            </div>

            {/* Dog Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de tu Perro *</label>
              <input 
                type="text" 
                required
                placeholder="Ej: Max"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
            </div>

            {/* Dog Breed */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Raza del Perro *</label>
              <input 
                type="text" 
                required
                placeholder="Ej: Labrador, Criollo, etc."
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tamaño / Contextura *</label>
              <select
                value={dogSize}
                onChange={(e) => setDogSize(e.target.value as any)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328] bg-white font-medium"
              >
                <option value="pequeño">Pequeño (hasta 10 kg)</option>
                <option value="mediano">Mediano (11 a 25 kg)</option>
                <option value="grande">Grande (más de 25 kg)</option>
              </select>
            </div>
          </div>

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Servicio de Interés *</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328] bg-white font-medium"
            >
              {DEFAULT_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Days if Hotel */}
          {serviceId === 'hotel' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-bold text-slate-700 mb-1">Número de Días / Noches de Hotel</label>
              <input 
                type="number" 
                min="1"
                max="60"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
              {days >= 8 && (
                <p className="text-[10px] text-[#8FB328] font-bold mt-1">
                  ¡Aplica 8% de descuento por estadía larga mayor a 8 días!
                </p>
              )}
            </motion.div>
          )}

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input 
              type="checkbox" 
              checked={optInPromos}
              onChange={(e) => setOptInPromos(e.target.checked)}
              className="rounded text-[#8FB328] focus:ring-[#8FB328]"
            />
            <span>Deseo recibir consejos de cuidado y promociones exclusivas para mi perro.</span>
          </label>

          <button
            type="submit"
            className="w-full bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Calculator size={16} />
            <span>Calcular Propuesta de Inversión</span>
          </button>
        </form>

        {/* Result Card */}
        {quoteResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#FAF6EF] to-[#F3ECE0] border border-[#8FB328]/30 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#8FB328]">Propuesta Generada</span>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {quoteResult.dogName} ({quoteResult.dogSize}) - {quoteResult.serviceName}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Inversión Estimada</span>
                <span className="text-2xl font-black text-[#8FB328]">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(quoteResult.total)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Gracias por la oportunidad de atender a **{quoteResult.dogName}** en nuestras instalaciones campestres en Guaymaral. Ratificamos nuestro compromiso de dedicarle el mejor esfuerzo para que se sienta feliz como en casa.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleConfirmWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-102 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Confirmar por WhatsApp</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={16} className="text-[#00A8E8]" />
                <span>Descargar Cotización PDF</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
