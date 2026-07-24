import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Sparkles, 
  X, 
  RefreshCw,
  Dog,
  ShieldCheck,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { VIPTicket, AgendaBlockedSlot, AgendaSettings } from '../types';

interface AgendaNativeCalendarProps {
  tickets: VIPTicket[];
  onRefreshTickets?: () => void;
}

export const TIME_SLOTS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', 
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM'
];

export const AgendaNativeCalendar: React.FC<AgendaNativeCalendarProps> = ({ tickets, onRefreshTickets }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [blockedSlots, setBlockedSlots] = useState<AgendaBlockedSlot[]>([]);
  const [settings, setSettings] = useState<AgendaSettings>({
    id: 'default',
    maxDogsPerSlot: 6,
    maxDogsPerDay: 25,
    openingTime: '07:00 AM',
    closingTime: '06:00 PM'
  });

  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [blockReasonInput, setBlockReasonInput] = useState('Fumigación y Adecuación Sanitaria');
  const [selectedSlotForBlock, setSelectedSlotForBlock] = useState<string>('');
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Multi-day Range Block State
  const [showRangeBlockModal, setShowRangeBlockModal] = useState(false);
  const [rangeStartDate, setRangeStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [rangeEndDate, setRangeEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [rangeReason, setRangeReason] = useState('Fumigación y Adecuación Sanitaria');

  // Load agenda blocks and settings from backend
  const fetchAgendaData = async () => {
    setLoading(true);
    try {
      const [blocksRes, settingsRes] = await Promise.all([
        fetch('/api/agenda/blocks'),
        fetch('/api/agenda/settings')
      ]);
      const blocksData = await blocksRes.json();
      const settingsData = await settingsRes.json();

      if (blocksData.success && blocksData.blocks) {
        setBlockedSlots(blocksData.blocks);
      }
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }
    } catch (err) {
      console.error('Error fetching agenda data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendaData();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Helper to format YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Check if a day has tickets
  const getDayTickets = (dateStr: string) => {
    return tickets.filter(t => t.date === dateStr && t.status !== 'archived' && t.status !== 'cancelled');
  };

  // Check if a day or slot is blocked
  const isDayBlocked = (dateStr: string) => {
    return blockedSlots.some(b => b.date === dateStr && b.timeSlot === 'ALL_DAY');
  };

  const isSlotBlocked = (dateStr: string, slot: string) => {
    return blockedSlots.some(b => b.date === dateStr && (b.timeSlot === 'ALL_DAY' || b.timeSlot === slot));
  };

  const getSlotBlockReason = (dateStr: string, slot: string) => {
    const block = blockedSlots.find(b => b.date === dateStr && (b.timeSlot === 'ALL_DAY' || b.timeSlot === slot));
    return block ? block.reason : '';
  };

  // Handle blocking a slot or day
  const handleToggleBlockSlot = async (timeSlot: string) => {
    const dateStr = selectedDateStr;
    const existingBlock = blockedSlots.find(b => b.date === dateStr && b.timeSlot === timeSlot);

    if (existingBlock) {
      // Delete block
      try {
        await fetch(`/api/agenda/blocks/${existingBlock.id}`, { method: 'DELETE' });
        setBlockedSlots(prev => prev.filter(b => b.id !== existingBlock.id));
      } catch (err) {
        alert('Error al desbloquear franja.');
      }
    } else {
      // Open modal to add block
      setSelectedSlotForBlock(timeSlot);
      setShowBlockModal(true);
    }
  };

  const confirmBlockSlot = async () => {
    try {
      const res = await fetch('/api/agenda/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDateStr,
          timeSlot: selectedSlotForBlock,
          reason: blockReasonInput
        })
      });
      const data = await res.json();
      if (data.success && data.block) {
        setBlockedSlots(prev => [...prev, data.block]);
      }
    } catch (err) {
      alert('Error al bloquear franja.');
    } finally {
      setShowBlockModal(false);
    }
  };

  const confirmRangeBlock = async () => {
    if (!rangeStartDate || !rangeEndDate) return alert('Selecciona fechas válidas.');
    if (rangeStartDate > rangeEndDate) return alert('La fecha final debe ser igual o posterior a la inicial.');

    try {
      const res = await fetch('/api/agenda/blocks/range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: rangeStartDate,
          endDate: rangeEndDate,
          reason: rangeReason
        })
      });
      const data = await res.json();
      if (data.success && data.blocks) {
        setBlockedSlots(prev => [...prev, ...data.blocks]);
        alert(`¡Éxito! Se han bloqueado ${data.blocks.length} días para "${rangeReason}".`);
      }
    } catch (err) {
      alert('Error al bloquear rango de fechas.');
    } finally {
      setShowRangeBlockModal(false);
    }
  };

  // Save agenda settings
  const handleSaveSettings = async () => {
    try {
      await fetch('/api/agenda/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Configuración de la Agenda Nativa guardada correctamente.');
      setShowConfigModal(false);
    } catch (err) {
      alert('Error al guardar configuración.');
    }
  };

  const selectedDayTickets = getDayTickets(selectedDateStr);

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8FB328]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#8FB328] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Sello ID Nativo • Zero Calendly Fees
              </span>
              <span className="bg-white/10 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={11} className="text-[#8FB328]" /> 100% Autogestionado
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <CalendarCheck size={26} className="text-[#8FB328]" />
              Agenda Nativa de Ingresos & Aforos VIP
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Garantiza el cupo justo por franja y día en el Campus Guaymaral. Bloquea horarios, visualiza la densidad por perro y coordina respuestas de WhatsApp en 1-Clic sin comisiones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => fetchAgendaData()}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer"
              title="Actualizar Agenda"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setShowRangeBlockModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Lock size={15} />
              <span>Bloquear Rango / Fumigación</span>
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Sliders size={15} />
              <span>Aforo & Reglas</span>
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Mascotas Agendadas Hoy</span>
            <span className="text-lg font-black text-[#8FB328]">
              {getDayTickets(new Date().toISOString().split('T')[0]).length} / {settings.maxDogsPerDay}
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Límite por Franja Horaria</span>
            <span className="text-lg font-black text-amber-300">
              {settings.maxDogsPerSlot} Perros / Franja
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Horario de Ingresos</span>
            <span className="text-lg font-black text-cyan-300">
              {settings.openingTime} - {settings.closingTime}
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Franjas Bloqueadas</span>
            <span className="text-lg font-black text-rose-300">
              {blockedSlots.length} Registros
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CALENDAR & DAY VIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MONTHLY CALENDAR GRID (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-800">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={handleToday}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full transition-colors"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-slate-400 uppercase mb-2">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 bg-slate-50/50 rounded-2xl" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateStr(year, month, dayNum);
              const dayTickets = getDayTickets(dateStr);
              const isBlocked = isDayBlocked(dateStr);
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              const count = dayTickets.length;
              let capacityColor = 'border-slate-200 bg-white hover:border-[#8FB328]/60';
              
              if (isBlocked) {
                capacityColor = 'bg-rose-50 border-rose-300 text-rose-900';
              } else if (count >= settings.maxDogsPerDay) {
                capacityColor = 'bg-rose-100 border-rose-400 text-rose-900 font-black';
              } else if (count >= Math.floor(settings.maxDogsPerDay * 0.7)) {
                capacityColor = 'bg-amber-50 border-amber-300 text-amber-900';
              } else if (count > 0) {
                capacityColor = 'bg-emerald-50/60 border-emerald-300 text-emerald-900';
              }

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 p-1.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative cursor-pointer ${capacityColor} ${
                    isSelected ? 'ring-2 ring-[#8FB328] ring-offset-1 shadow-md scale-[1.02] z-10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isToday ? 'bg-[#8FB328] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]' : 'text-slate-700'}`}>
                      {dayNum}
                    </span>

                    {isBlocked && (
                      <Lock size={11} className="text-rose-600" />
                    )}
                  </div>

                  <div className="mt-auto">
                    {count > 0 ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-white/80 border border-slate-200/80 text-slate-800 flex items-center gap-0.5 truncate">
                        <Dog size={10} className="text-[#8FB328]" /> {count} perr{count === 1 ? 'o' : 'os'}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-medium">
                        {isBlocked ? 'Bloqueado' : 'Disponible'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Disp. Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ocupación Alta
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Cupo Lleno / Bloqueo
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED DAY DETAILED SCHEDULE (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#8FB328]">
                  Control de Franjas • {selectedDateStr}
                </span>
                <h3 className="text-base font-black text-slate-800">
                  Ingresos del Día ({selectedDayTickets.length} / {settings.maxDogsPerDay} Mascotas)
                </h3>
              </div>

              {/* Block Day Toggle */}
              <button
                onClick={() => handleToggleBlockSlot('ALL_DAY')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                  isDayBlocked(selectedDateStr)
                    ? 'bg-rose-100 border-rose-300 text-rose-800 hover:bg-rose-200'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200'
                }`}
              >
                {isDayBlocked(selectedDateStr) ? (
                  <>
                    <Unlock size={13} /> Desbloquear Día
                  </>
                ) : (
                  <>
                    <Lock size={13} /> Bloquear Día
                  </>
                )}
              </button>
            </div>

            {/* List of Time Slots */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {TIME_SLOTS.map((slot) => {
                const slotTickets = selectedDayTickets.filter(t => t.timeSlot === slot);
                const blocked = isSlotBlocked(selectedDateStr, slot);
                const reason = getSlotBlockReason(selectedDateStr, slot);
                const isFull = slotTickets.length >= settings.maxDogsPerSlot;

                return (
                  <div
                    key={slot}
                    className={`p-3 rounded-2xl border transition-all ${
                      blocked 
                        ? 'bg-rose-50/70 border-rose-200' 
                        : isFull 
                        ? 'bg-amber-50/70 border-amber-200' 
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-[#8FB328]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={blocked ? 'text-rose-600' : 'text-[#8FB328]'} />
                        <span className="font-extrabold text-xs text-slate-800">{slot}</span>
                        
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          blocked 
                            ? 'bg-rose-200 text-rose-900' 
                            : isFull 
                            ? 'bg-amber-200 text-amber-900' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {blocked ? 'Bloqueado' : `${slotTickets.length} / ${settings.maxDogsPerSlot} cupos`}
                        </span>
                      </div>

                      {/* Block / Unblock Slot Button */}
                      <button
                        onClick={() => handleToggleBlockSlot(slot)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          blocked 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-800'
                        }`}
                        title={blocked ? 'Desbloquear esta hora' : 'Bloquear esta hora'}
                      >
                        {blocked ? <Unlock size={13} /> : <Lock size={13} />}
                      </button>
                    </div>

                    {blocked && reason && (
                      <p className="text-[11px] text-rose-700 italic mt-1 font-medium">
                        Motivo: {reason}
                      </p>
                    )}

                    {/* Dog Cards in this Slot */}
                    {slotTickets.length > 0 && (
                      <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-200/60">
                        {slotTickets.map((t) => {
                          let cleanPhone = t.ownerPhone ? t.ownerPhone.replace(/\D/g, '') : '';
                          if (cleanPhone.length === 10) cleanPhone = '57' + cleanPhone;
                          const message = `Hola ${t.ownerName}! 👋 Te confirmamos desde Campus DoggieScouts Guaymaral 🐾. Tu Tiquete ${t.code} para ${t.dogName} está listo para la franja de las ${t.timeSlot} del ${t.date}. ¿Tienes todo listo con la ficha de salud? 🌲✨`;
                          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

                          return (
                            <div key={t.id} className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-extrabold text-slate-800 block">
                                  {t.dogName} 🐾 <span className="text-[10px] font-normal text-slate-500">({t.dogBreed || 'Mediano'})</span>
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  Tutor: {t.ownerName} • {t.serviceName}
                                </span>
                              </div>

                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                                title="Enviar confirmación rápida por WhatsApp"
                              >
                                <MessageCircle size={12} />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CONFIGURATION */}
      {showConfigModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-[#8FB328]/10 text-[#8FB328] rounded-2xl">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Reglas de Agenda & Capacidad
                </h3>
                <p className="text-xs text-slate-500">Aforo nativo sin costos de terceros</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Máximo de Perros por Franja Horaria
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.maxDogsPerSlot}
                  onChange={(e) => setSettings({ ...settings, maxDogsPerSlot: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-1">Al llegar a este cupo, la franja se deshabilita automáticamente para los tutores en la web.</p>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Máximo de Perros Totales por Día
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxDogsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxDogsPerDay: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-1">Garantiza un ambiente campestre seguro sin sobrecupo.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Hora de Apertura</label>
                  <input
                    type="text"
                    value={settings.openingTime}
                    onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Hora de Cierre</label>
                  <input
                    type="text"
                    value={settings.closingTime}
                    onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full mt-2 bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Guardar Reglas de Agenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BLOCK SLOT REASON */}
      {showBlockModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowBlockModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <Lock size={18} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Bloquear {selectedSlotForBlock === 'ALL_DAY' ? 'Día Completo' : `Franja ${selectedSlotForBlock}`}
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Escribe el motivo del bloqueo (ej. Mantenimiento de piscina, mantenimiento de prados o evento privado).
            </p>

            <input
              type="text"
              value={blockReasonInput}
              onChange={(e) => setBlockReasonInput(e.target.value)}
              placeholder="Ej: Mantenimiento de Prados"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="w-1/2 bg-slate-100 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBlockSlot}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Confirmar Bloqueo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MULTI-DAY RANGE BLOCK (FUMIGATION, HOLIDAYS, LAWN MAINTENANCE) */}
      {showRangeBlockModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden">
            <button
              onClick={() => setShowRangeBlockModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Bloquear Rango de Días
                </h3>
                <p className="text-xs text-slate-500">Fumigaciones, adecuaciones de prados o festivos</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    value={rangeStartDate}
                    onChange={(e) => setRangeStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Fecha de Fin *</label>
                  <input
                    type="date"
                    value={rangeEndDate}
                    onChange={(e) => setRangeEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Motivo del Bloqueo</label>
                <input
                  type="text"
                  value={rangeReason}
                  onChange={(e) => setRangeReason(e.target.value)}
                  placeholder="Ej. Fumigación y Adecuación Sanitaria"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium mb-2"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setRangeReason('🦟 Fumigación y Adecuación Sanitaria')}
                    className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    🦟 Fumigación
                  </button>
                  <button
                    type="button"
                    onClick={() => setRangeReason('🌿 Mantenimiento de Prados Campestres')}
                    className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    🌿 Adecuación de Prados
                  </button>
                  <button
                    type="button"
                    onClick={() => setRangeReason('🇨🇴 Fin de Semana Festivo / Puente')}
                    className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    🇨🇴 Festivo / Puente
                  </button>
                  <button
                    type="button"
                    onClick={() => setRangeReason('🚧 Obras e Infraestructura')}
                    className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    🚧 Obras
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                💡 <strong>Nota del Sistema:</strong> Durante estas fechas no se permitirán nuevas reservas VIP desde la página web. Si ya existían reservas previas, podrás verlas en la lista pero no se permitirán sobrecupos.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRangeBlockModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 font-extrabold py-3 rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmRangeBlock}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Aplicar Bloqueo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
