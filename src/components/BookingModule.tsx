import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Ticket, Clock, CheckCircle2, MessageCircle, ExternalLink, User, Phone, Dog, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CALENDLY_LINK, DEFAULT_SERVICES, WHATSAPP_PHONE } from '../data';
import { VIPTicket } from '../types';

interface BookingModuleProps {
  preselectedServiceId?: string;
  onTicketCreated?: (ticket: VIPTicket) => void;
}

export const BookingModule: React.FC<BookingModuleProps> = ({
  preselectedServiceId = 'guarderia',
  onTicketCreated
}) => {
  const [activeTab, setActiveTab] = useState<'ticket' | 'calendly'>('ticket');
  
  // Ticket VIP Form state
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogSize, setDogSize] = useState<'pequeño' | 'mediano' | 'grande'>('mediano');
  const [selectedService, setSelectedService] = useState(preselectedServiceId);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM');

  // Real-time Agenda Availability State
  const [availability, setAvailability] = useState<{
    isDayBlocked: boolean;
    blockedSlots: string[];
    countsMap: Record<string, number>;
    maxDogsPerSlot: number;
    maxDogsPerDay: number;
    totalDayCount: number;
  }>({
    isDayBlocked: false,
    blockedSlots: [],
    countsMap: {},
    maxDogsPerSlot: 6,
    maxDogsPerDay: 25,
    totalDayCount: 0
  });

  // Ficha Canina optional fields
  const [vaccinesUpToDate, setVaccinesUpToDate] = useState('Sí, vacunas al día');
  const [allergies, setAllergies] = useState('');
  const [vetContact, setVetContact] = useState('');
  const [feedingHabits, setFeedingHabits] = useState('');
  const [showFichaCanina, setShowFichaCanina] = useState(false);
  
  const [generatedTicket, setGeneratedTicket] = useState<VIPTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

  // Check availability when selectedDate changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/agenda/availability?date=${selectedDate}`);
        const data = await res.json();
        if (data.success) {
          setAvailability({
            isDayBlocked: data.isDayBlocked || false,
            blockedSlots: data.blockedSlots || [],
            countsMap: data.countsMap || {},
            maxDogsPerSlot: data.maxDogsPerSlot || 6,
            maxDogsPerDay: data.maxDogsPerDay || 25,
            totalDayCount: data.totalDayCount || 0
          });
        }
      } catch (err) {
        console.error('Error checking agenda availability:', err);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !email.trim() || !ownerPhone.trim() || !dogName.trim() || !dogBreed.trim()) {
      alert('Por favor completa todos los campos requeridos (Tutor, E-mail, Teléfono, Perrito, Raza).');
      return;
    }

    setIsSubmitting(true);
    const serviceObj = DEFAULT_SERVICES.find(s => s.id === selectedService) || DEFAULT_SERVICES[0];
    const code = `#DS-BOG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: VIPTicket = {
      id: 'ticket_' + Date.now(),
      code,
      ownerName,
      email,
      ownerPhone,
      dogName,
      dogBreed,
      dogSize,
      serviceId: selectedService,
      serviceName: serviceObj.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      createdAt: new Date().toISOString(),
      status: 'pending',
      vaccinesUpToDate,
      allergies,
      vetContact,
      feedingHabits
    };

    try {
      // Post to backend API
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      const data = await res.json();
      if (data.ticket) {
        setGeneratedTicket(data.ticket);
        if (onTicketCreated) onTicketCreated(data.ticket);
      } else {
        setGeneratedTicket(newTicket);
        if (onTicketCreated) onTicketCreated(newTicket);
      }
    } catch (err) {
      // Fallback local ticket
      setGeneratedTicket(newTicket);
      if (onTicketCreated) onTicketCreated(newTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessage = (ticket: VIPTicket) => {
    const text = `¡Hola Campus DoggieScouts! 🐶❤️%0A%0AHe generado mi *TIQUETE VIP DE PRE-RESERVA*:%0A%0A🎫 *Código:* ${ticket.code}%0A👤 *Tutor:* ${ticket.ownerName}%0A🐾 *Perrito:* ${ticket.dogName}%0A🌲 *Servicio:* ${ticket.serviceName}%0A📅 *Fecha:* ${ticket.date}%0A⏰ *Hora:* ${ticket.timeSlot}%0A%0APor favor confirmen disponibilidad para coordinar la llegada al campus en Guaymaral. ¡Muchas gracias!`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  };

  return (
    <section id="modulo-agendamiento" className="my-8 scroll-mt-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 card-shadow border border-amber-900/10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-7 bg-[#8FB328] rounded-full"></div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8FB328]">Agendamiento Preferencial</span>
                <h2 className="text-xl font-extrabold text-slate-800">Reserva tu Cupo en el Campus</h2>
              </div>
            </div>
          </div>

          {/* Selector Pestañas */}
          <div className="flex p-1.5 bg-amber-900/5 rounded-2xl border border-amber-900/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ticket'
                  ? 'bg-[#8FB328] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket size={15} />
              <span>1. Tiquete VIP Express</span>
            </button>

            <button
              onClick={() => setActiveTab('calendly')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'calendly'
                  ? 'bg-[#00A8E8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon size={15} />
              <span>2. Sincronizar Calendly</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Tiquete VIP Pre-Reserva */}
        {activeTab === 'ticket' && (
          <div>
            {!generatedTicket ? (
              <form onSubmit={handleCreateTicket} className="space-y-5">
                
                <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-amber-900/10 text-xs text-slate-700 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#8FB328] flex-shrink-0" />
                  <span>
                    Genera tu **Tiquete VIP de Pre-Reserva** sin costo. Te responderemos por WhatsApp confirmando disponibilidad y ruta.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Owner Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User size={13} className="text-[#8FB328]" /> Nombre del Tutor *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Carolina Gómez"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User size={13} className="text-[#8FB328]" /> E-mail de Contacto *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone size={13} className="text-[#8FB328]" /> WhatsApp de Contacto *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ej: 310 1234567"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  {/* Dog Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Dog size={13} className="text-[#8FB328]" /> Nombre de la Mascota *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Mateo"
                      value={dogName}
                      onChange={(e) => setDogName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  {/* Dog Breed */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Dog size={13} className="text-[#8FB328]" /> Raza del Perrito *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Golden Retriever, Criollo, etc."
                      value={dogBreed}
                      onChange={(e) => setDogBreed(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />
                  </div>

                  {/* Dog Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Dog size={13} className="text-[#8FB328]" /> Tamaño *
                    </label>
                    <select
                      value={dogSize}
                      onChange={(e) => setDogSize(e.target.value as 'pequeño' | 'mediano' | 'grande')}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#8FB328]"
                    >
                      <option value="pequeño">Pequeño (hasta 10kg)</option>
                      <option value="mediano">Mediano (11 a 25kg)</option>
                      <option value="grande">Grande (más de 25kg)</option>
                    </select>
                  </div>
                </div>

                {/* Service Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Selecciona el Servicio
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {DEFAULT_SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedService === s.id
                            ? 'border-[#8FB328] bg-[#8FB328]/10 text-slate-800 font-bold shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <p className="text-xs font-bold">{s.name}</p>
                        <p className="text-[10px] opacity-75 line-clamp-1">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Selector with Real-time Agenda Engine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Fecha Estimada de Ingreso *</span>
                      {availability.isDayBlocked ? (
                        <span className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1">
                          <AlertTriangle size={11} /> Día Bloqueado
                        </span>
                      ) : availability.totalDayCount >= availability.maxDogsPerDay ? (
                        <span className="text-[10px] text-amber-600 font-extrabold">
                          Día Aforo Completo ({availability.totalDayCount}/{availability.maxDogsPerDay})
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          Cupos Disponibles ({availability.totalDayCount}/{availability.maxDogsPerDay})
                        </span>
                      )}
                    </label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-[#8FB328]"
                    />

                    {availability.isDayBlocked && (
                      <p className="text-[11px] text-rose-600 font-bold mt-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle size={13} /> El campus estará cerrado o en mantenimiento este día. Por favor elige otra fecha.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock size={13} className="text-[#8FB328]" /> Horario Preferido de Llegada *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => {
                        const isSlotBlocked = availability.blockedSlots.includes('ALL_DAY') || availability.blockedSlots.includes(slot);
                        const currentSlotCount = availability.countsMap[slot] || 0;
                        const isSlotFull = currentSlotCount >= availability.maxDogsPerSlot;
                        const isDisabled = availability.isDayBlocked || isSlotBlocked || isSlotFull;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-70'
                                : selectedTimeSlot === slot
                                ? 'bg-[#00A8E8] text-white border-[#00A8E8] shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{slot}</span>
                            {isSlotBlocked ? (
                              <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.2 rounded font-black">Cerrado</span>
                            ) : isSlotFull ? (
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black">Lleno</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Ficha Canina / Salud / Hábitos (Opcional) */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                  <button
                    type="button"
                    onClick={() => setShowFichaCanina(!showFichaCanina)}
                    className="w-full flex items-center justify-between text-xs font-bold text-amber-900 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#8FB328]" />
                      📋 Ficha Canina de Ingreso: Vacunas, Alergias y Alimentación (Opcional)
                    </span>
                    <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-bold">
                      {showFichaCanina ? 'Ocultar' : 'Completar Ficha'}
                    </span>
                  </button>

                  {showFichaCanina && (
                    <div className="mt-3 space-y-3 pt-3 border-t border-amber-200/60">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Carnet de Vacunas al Día</label>
                        <select
                          value={vaccinesUpToDate}
                          onChange={(e) => setVaccinesUpToDate(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                        >
                          <option value="Sí, vacunas al día">Sí, esquema completo y Tos de Perrera al día</option>
                          <option value="En proceso / Próximo esquema">En proceso de refuerzo</option>
                          <option value="Incompleto">Pendiente completar carnet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Alergias o Condición Médica Especial</label>
                        <input
                          type="text"
                          placeholder="Ej: Alérgico al pollo, piel sensible, condición articular..."
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Veterinario de Confianza</label>
                          <input
                            type="text"
                            placeholder="Ej: Clínica Vet Guaymaral / Dr. Pérez (300 0000000)"
                            value={vetContact}
                            onChange={(e) => setVetContact(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Horarios y Porción de Alimento</label>
                          <input
                            type="text"
                            placeholder="Ej: 2 tazas Barf a las 8 AM y 5 PM"
                            value={feedingHabits}
                            onChange={(e) => setFeedingHabits(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8FB328] hover:bg-[#7d9d22] text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Ticket size={18} />
                  <span>{isSubmitting ? 'Generando Tiquete...' : 'Generar Comprobante Tiquete VIP'}</span>
                </button>

              </form>
            ) : (
              /* Generated Ticket Result Voucher */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#FAF6EF] to-[#F3ECE0] p-6 rounded-3xl border-2 border-[#8FB328] shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#8FB328] text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                  TIQUETE VIP PRE-RESERVA
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8FB328] text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6E8B1A] uppercase tracking-wider">¡Pre-Reserva Creada!</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{generatedTicket.code}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-amber-900/10 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Tutor</span>
                    <span className="font-extrabold text-slate-800">{generatedTicket.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Perrito</span>
                    <span className="font-extrabold text-slate-800">{generatedTicket.dogName} 🐾</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Servicio</span>
                    <span className="font-extrabold text-[#00A8E8]">{generatedTicket.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Fecha & Hora</span>
                    <span className="font-extrabold text-slate-800">{generatedTicket.date} @ {generatedTicket.timeSlot}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>
                    **Siguiente paso:** Haz clic abajo para enviar tu tiquete por WhatsApp. Al dar respuesta de aceptación a la cita, esta se cargará automáticamente en Calendly.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={getWhatsAppMessage(generatedTicket)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    <MessageCircle size={18} />
                    <span>Enviar Tiquete VIP a WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setGeneratedTicket(null)}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs border border-slate-200 transition-all cursor-pointer"
                  >
                    Crear Otro Tiquete
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tab 2: Calendly Direct Sync */}
        {activeTab === 'calendly' && (
          <div className="bg-[#00A8E8]/5 p-6 rounded-3xl border border-[#00A8E8]/20 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#00A8E8] text-white flex items-center justify-center mx-auto shadow-md">
              <CalendarIcon size={30} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Sincronización Automática con Calendly</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Abre nuestra agenda digital oficial para sincronizar inmediatamente tu cita con tu calendario personal de Google o Outlook con confirmación en tiempo real.
              </p>
            </div>

            <a
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00A8E8] hover:bg-[#0092ca] text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-md transition-all hover:scale-102"
            >
              <span>Abrir Agenda Oficial en Calendly</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

      </div>
    </section>
  );
};
