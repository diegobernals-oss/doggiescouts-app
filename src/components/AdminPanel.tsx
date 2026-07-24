import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Ticket, 
  Users, 
  DollarSign, 
  Download, 
  Lock, 
  RefreshCw, 
  X, 
  Check, 
  Save, 
  ShieldCheck, 
  Sparkles,
  MessageCircle,
  History,
  AlertTriangle,
  RotateCcw,
  FileText,
  Syringe,
  Stethoscope,
  Utensils,
  CalendarCheck
} from 'lucide-react';
import { VIPTicket, LeadContact, PricingTable } from '../types';
import { DEFAULT_PRICES, DEFAULT_SERVICES } from '../data';
import { AgendaNativeCalendar } from './AgendaNativeCalendar';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPricesUpdated?: (newPrices: PricingTable) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onPricesUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'tickets' | 'leads' | 'prices' | 'agenda'>('agenda');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'historico'>('pending');
  const [selectedCanineFile, setSelectedCanineFile] = useState<{
    ownerName: string;
    dogName: string;
    dogBreed?: string;
    vaccinesUpToDate?: string;
    allergies?: string;
    vetContact?: string;
    feedingHabits?: string;
  } | null>(null);

  const [tickets, setTickets] = useState<VIPTicket[]>([]);
  const [leads, setLeads] = useState<LeadContact[]>([]);
  const [prices, setPrices] = useState<PricingTable>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getWhatsAppUrl = (
    type: 'ticket' | 'lead', 
    name: string, 
    phone: string, 
    dogName: string, 
    serviceOrSource?: string, 
    date?: string, 
    timeSlot?: string
  ) => {
    let cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (cleanPhone.length === 10) {
      cleanPhone = '57' + cleanPhone;
    }
    
    let message = '';
    if (type === 'ticket') {
      message = `Hola ${name}! 👋 Te escribimos de Campus DoggieScouts Guaymaral 🐾. Recibimos tu Tiquete VIP para ${dogName} (${serviceOrSource || 'Guardería Campestre'}) programado para el ${date || 'próximo día'} a las ${timeSlot || '09:00 AM'}. ¿Nos confirmas para alistar la bienvenida en el Campus? 🌲✨`;
    } else {
      message = `Hola ${name}! 👋 Te escribimos de Campus DoggieScouts Guaymaral 🐾. Vimos tu registro para la Guía de Adaptación y la solicitud de ${dogName}. ¿Te gustaría agendar una visita o día de prueba VIP sin costo para conocer nuestros prados campestres? 🐶🌲`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getTimeElapsedBadge = (createdAt?: string, status?: string) => {
    if (status === 'atendido' || status === 'confirmed' || status === 'completed') {
      return <span className="bg-[#8FB328]/10 text-[#67821c] border border-[#8FB328]/30 px-2 py-0.5 rounded-md text-[10px] font-bold">Atendido</span>;
    }
    if (!createdAt) return null;

    const hours = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60));
    if (hours >= 24) {
      return (
        <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 animate-pulse">
          🚨 +24h Urgente
        </span>
      );
    }
    if (hours >= 12) {
      return (
        <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
          ⚠️ +12h Pendiente
        </span>
      );
    }
    return (
      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
        ✨ Reciente ({hours === 0 ? 'Hace un instante' : `Hace ${hours}h`})
      </span>
    );
  };

  const handleReactivateTicket = async (id: string) => {
    try {
      await fetch(`/api/tickets/${id}/attend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'pending' as const } : t));
    } catch (err) {
      alert('Error al reactivar tiquete.');
    }
  };

  const handleReactivateLead = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}/attend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'pending' as const } : l));
    } catch (err) {
      alert('Error al reactivar prospecto.');
    }
  };

  useEffect(() => {
    // Load initial custom prices if available
    const stored = localStorage.getItem('doggiescouts_custom_prices');
    if (stored) {
      try {
        setPrices(JSON.parse(stored));
      } catch (e) {}
    } else {
      fetch('/api/prices')
        .then(r => r.json())
        .then(data => {
          if (data.prices) setPrices(data.prices);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'juanita123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Contraseña incorrecta.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resT, resL, resP] = await Promise.all([
        fetch('/api/tickets').then(r => r.json()).catch(() => ({ tickets: [] })),
        fetch('/api/leads').then(r => r.json()).catch(() => ({ leads: [] })),
        fetch('/api/prices').then(r => r.json()).catch(() => ({ prices: null }))
      ]);

      if (resT.tickets) setTickets(resT.tickets);
      if (resL.leads) setLeads(resL.leads);
      if (resP.prices) {
        setPrices(resP.prices);
        localStorage.setItem('doggiescouts_custom_prices', JSON.stringify(resP.prices));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (serviceId: string, size: 'pequeño' | 'mediano' | 'grande', val: number) => {
    setPrices(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [size]: val
      }
    }));
  };

  const handleSavePrices = async () => {
    setLoading(true);
    try {
      localStorage.setItem('doggiescouts_custom_prices', JSON.stringify(prices));
      await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices })
      });
      setSavedSuccess(true);
      if (onPricesUpdated) onPricesUpdated(prices);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Precios guardados localmente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendTicket = async (id: string) => {
    try {
      await fetch(`/api/tickets/${id}/attend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'atendido' })
      });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'atendido' as const } : t));
    } catch (err) {
      alert('Error al marcar como atendido.');
    }
  };

  const handleArchiveTicket = async (id: string) => {
    try {
      await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'cancelled' as const } : t));
    } catch (err) {
      alert('Error al archivar.');
    }
  };

  const handleAttendLead = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}/attend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'atendido' })
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'atendido' as const } : l));
    } catch (err) {
      alert('Error al marcar como atendido.');
    }
  };

  const handleArchiveLead = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'archived' as const } : l));
    } catch (err) {
      alert('Error al archivar.');
    }
  };

  const exportCSV = (type: 'tickets' | 'leads') => {
    const BOM = '\uFEFF';
    if (type === 'tickets') {
      if (tickets.length === 0) return alert('No hay tiquetes para exportar.');
      const headers = 'Código,Tutor,Email,Teléfono,Perrito,Raza,Tamaño,Servicio,Fecha,Hora,Vacunas_Al_Dia,Alergias_Salud,Veterinario,Alimentacion,Estado,Fecha_Registro\n';
      const rows = tickets.map(t => 
        `"${t.code || ''}","${t.ownerName || ''}","${t.email || ''}","${t.ownerPhone || ''}","${t.dogName || ''}","${t.dogBreed || ''}","${t.dogSize || ''}","${t.serviceName || ''}","${t.date || ''}","${t.timeSlot || ''}","${t.vaccinesUpToDate || 'Sí'}","${t.allergies || ''}","${t.vetContact || ''}","${t.feedingHabits || ''}","${t.status || 'pending'}","${t.createdAt || ''}"`
      ).join('\n');

      const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DoggieScouts_Tiquetes_GoogleSheets.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (leads.length === 0) return alert('No hay contactos para exportar.');
      const headers = 'Tutor,Email,Teléfono,Perrito,Raza,Tamaño,Origen,Vacunas_Al_Dia,Alergias_Salud,Veterinario,Alimentacion,Promociones,Estado,Fecha_Registro\n';
      const rows = leads.map(l => 
        `"${l.ownerName || ''}","${l.email || ''}","${l.ownerPhone || ''}","${l.dogName || ''}","${l.dogBreed || ''}","${l.dogSize || ''}","${l.source || ''}","${l.vaccinesUpToDate || 'Sí'}","${l.allergies || ''}","${l.vetContact || ''}","${l.feedingHabits || ''}","${l.optInPromos ? 'SÍ' : 'NO'}","${l.status || 'pending'}","${l.createdAt || ''}"`
      ).join('\n');

      const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DoggieScouts_Leads_GoogleSheets.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 card-shadow-lg relative border border-amber-900/10 max-h-[90vh] flex flex-col my-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#8FB328] text-white flex items-center justify-center shadow-xs font-bold">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Administración Campus DoggieScouts</h3>
              <p className="text-xs text-slate-500">Gestión de Tarifas, Cotizador y Registros de Clientes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="py-10 max-w-sm mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#8FB328]/20 text-[#6E8B1A] flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">Acceso Administrador</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresa la clave de administración para gestionar precios, responder tiquetes VIP y exportar registros a Google Sheets.
            </p>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <input 
                type="password" 
                placeholder="Ingresa la clave de administrador"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-center font-bold outline-none focus:ring-2 focus:ring-[#8FB328]"
              />
              <button
                type="submit"
                className="w-full bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Ingresar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden pt-4 space-y-4">
            
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('agenda')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'agenda' ? 'bg-[#8FB328] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <CalendarCheck size={14} />
                  <span>📅 Agenda Nativa Sello ID</span>
                </button>

                <button
                  onClick={() => setActiveTab('prices')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'prices' ? 'bg-[#8FB328] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <DollarSign size={14} />
                  <span>Modificar Precios</span>
                </button>

                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'tickets' ? 'bg-[#00A8E8] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Ticket size={14} />
                  <span>Tiquetes VIP ({tickets.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'leads' ? 'bg-[#8A58DC] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Users size={14} />
                  <span>Leads & Guía ({leads.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Actualizar Datos"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Refrescar</span>
                </button>

                {(activeTab === 'tickets' || activeTab === 'leads') && (
                  <button
                    onClick={() => exportCSV(activeTab === 'tickets' ? 'tickets' : 'leads')}
                    className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Exportar CSV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content Views */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-200">
              
              {/* AGENDA NATIVA TAB */}
              {activeTab === 'agenda' && (
                <AgendaNativeCalendar tickets={tickets} onRefreshTickets={fetchData} />
              )}
              
              {/* PRICES TAB */}
              {activeTab === 'prices' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    <p className="text-xs text-emerald-900 font-medium">
                      💡 Modifica los valores en pesos colombianos (COP) para cada tamaño de perro. Los cambios se actualizarán al instante en el cotizador express.
                    </p>

                    <button
                      onClick={handleSavePrices}
                      disabled={loading}
                      className="bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform hover:scale-102 flex-shrink-0"
                    >
                      {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                      <span>{savedSuccess ? '¡Precios Guardados!' : 'Guardar Todos los Precios'}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px]">
                          <th className="p-3">Servicio</th>
                          <th className="p-3">Pequeño (hasta 10kg)</th>
                          <th className="p-3">Mediano (11 - 25kg)</th>
                          <th className="p-3">Grande (más de 25kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {DEFAULT_SERVICES.map((s) => {
                          const p = prices[s.id] || { pequeño: 0, mediano: 0, grande: 0 };
                          return (
                            <tr key={s.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-800">
                                {s.name}
                                <span className="block text-[10px] text-slate-400 font-normal">{s.category}</span>
                              </td>

                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 font-bold">$</span>
                                  <input 
                                    type="number"
                                    step="1000"
                                    value={p.pequeño}
                                    onChange={(e) => handlePriceChange(s.id, 'pequeño', Number(e.target.value))}
                                    className="w-28 p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#8FB328] outline-none"
                                  />
                                </div>
                              </td>

                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 font-bold">$</span>
                                  <input 
                                    type="number"
                                    step="1000"
                                    value={p.mediano}
                                    onChange={(e) => handlePriceChange(s.id, 'mediano', Number(e.target.value))}
                                    className="w-28 p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#8FB328] outline-none"
                                  />
                                </div>
                              </td>

                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 font-bold">$</span>
                                  <input 
                                    type="number"
                                    step="1000"
                                    value={p.grande}
                                    onChange={(e) => handlePriceChange(s.id, 'grande', Number(e.target.value))}
                                    className="w-28 p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#8FB328] outline-none"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={handleSavePrices}
                      disabled={loading}
                      className="bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold px-6 py-3 rounded-2xl text-xs inline-flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                    >
                      {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                      <span>{savedSuccess ? '¡Cambios Guardados Exitosamente!' : 'Guardar Todos los Cambios de Precio'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TICKETS TAB */}
              {activeTab === 'tickets' && (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    {/* Status Filter Toggle */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          statusFilter === 'pending'
                            ? 'bg-[#8FB328] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Ticket size={14} />
                        <span>Pendientes ({tickets.filter(t => t.status !== 'atendido' && t.status !== 'cancelled' && t.status !== 'archived').length})</span>
                      </button>

                      <button
                        onClick={() => setStatusFilter('historico')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          statusFilter === 'historico'
                            ? 'bg-slate-800 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <History size={14} />
                        <span>Histórico / Atendidos ({tickets.filter(t => t.status === 'atendido' || t.status === 'cancelled' || t.status === 'archived').length})</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {statusFilter === 'pending' 
                        ? 'Tiquetes VIP activos. Haz clic en WhatsApp para responder en 1-Clic.' 
                        : 'Histórico de tiquetes atendidos y archivados en la base de datos.'}
                    </p>
                  </div>

                  {(() => {
                    const filteredTickets = tickets.filter(t => {
                      const isDone = t.status === 'atendido' || t.status === 'cancelled' || t.status === 'archived';
                      return statusFilter === 'pending' ? !isDone : isDone;
                    });

                    if (filteredTickets.length === 0) {
                      return (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                          <p className="text-xs text-slate-500 font-bold">
                            {statusFilter === 'pending' 
                              ? '¡Excelente! No hay tiquetes pendientes por atender.' 
                              : 'No hay tiquetes en el histórico.'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {statusFilter === 'pending' 
                              ? 'Todos los tiquetes han sido procesados y registrados correctamente.' 
                              : 'Los tiquetes marcados como atendidos aparecerán aquí.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px]">
                              <th className="p-2.5">Código / Estado</th>
                              <th className="p-2.5">Tutor / Contacto</th>
                              <th className="p-2.5">Mascota</th>
                              <th className="p-2.5">Servicio</th>
                              <th className="p-2.5">Fecha/Hora</th>
                              <th className="p-2.5 text-center">Acciones WhatsApp / Atención</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredTickets.map((t) => (
                              <tr key={t.id} className="hover:bg-amber-50/50 transition-colors">
                                <td className="p-2.5">
                                  <span className="font-mono font-bold text-[#8FB328] block">{t.code}</span>
                                  <div className="mt-1">
                                    {getTimeElapsedBadge(t.createdAt, t.status)}
                                  </div>
                                </td>

                                <td className="p-2.5">
                                  <span className="font-extrabold text-slate-800 block">{t.ownerName}</span>
                                  <span className="text-[10px] text-slate-500 block font-mono">{t.ownerPhone}</span>
                                  {t.email && <span className="text-[10px] text-slate-400 block">{t.email}</span>}
                                </td>

                                <td className="p-2.5">
                                  <span className="font-extrabold text-slate-800 block">{t.dogName} 🐾</span>
                                  <span className="text-[10px] text-slate-500 block mb-1">{t.dogBreed || '-'} ({t.dogSize || 'mediano'})</span>
                                  
                                  <button
                                    onClick={() => setSelectedCanineFile({
                                      ownerName: t.ownerName,
                                      dogName: t.dogName,
                                      dogBreed: t.dogBreed,
                                      vaccinesUpToDate: t.vaccinesUpToDate,
                                      allergies: t.allergies,
                                      vetContact: t.vetContact,
                                      feedingHabits: t.feedingHabits
                                    })}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <FileText size={11} />
                                    <span>Ver Ficha Salud</span>
                                  </button>
                                </td>

                                <td className="p-2.5 text-[#00A8E8] font-bold">{t.serviceName}</td>
                                <td className="p-2.5 text-slate-600">
                                  <span>{t.date}</span>
                                  <span className="block text-[10px] text-slate-400 font-bold">{t.timeSlot}</span>
                                </td>

                                <td className="p-2.5 text-center">
                                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                    {/* WhatsApp 1-Click Response */}
                                    <a
                                      href={getWhatsAppUrl('ticket', t.ownerName, t.ownerPhone, t.dogName, t.serviceName, t.date, t.timeSlot)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                      title="Abrir WhatsApp con respuesta prediligenciada"
                                    >
                                      <MessageCircle size={14} />
                                      <span>WhatsApp</span>
                                    </a>

                                    {statusFilter === 'pending' ? (
                                      <>
                                        <button
                                          onClick={() => handleAttendTicket(t.id)}
                                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                          title="Marcar como atendido y mover a histórico"
                                        >
                                          <Check size={14} />
                                          <span>Atender</span>
                                        </button>

                                        <button
                                          onClick={() => handleArchiveTicket(t.id)}
                                          className="bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold p-1.5 rounded-xl text-[11px] transition-all cursor-pointer"
                                          title="Archivar tiquete"
                                        >
                                          <X size={14} />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => handleReactivateTicket(t.id)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                        title="Reactivar tiquete y mover a lista de pendientes"
                                      >
                                        <RotateCcw size={13} />
                                        <span>Reactivar</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* LEADS TAB */}
              {activeTab === 'leads' && (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    {/* Status Filter Toggle */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          statusFilter === 'pending'
                            ? 'bg-[#8FB328] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Users size={14} />
                        <span>Pendientes ({leads.filter(l => l.status !== 'atendido' && l.status !== 'archived').length})</span>
                      </button>

                      <button
                        onClick={() => setStatusFilter('historico')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          statusFilter === 'historico'
                            ? 'bg-slate-800 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <History size={14} />
                        <span>Histórico / Atendidos ({leads.filter(l => l.status === 'atendido' || l.status === 'archived').length})</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {statusFilter === 'pending' 
                        ? 'Prospectos capturados. Usa WhatsApp en 1-Clic para invitarlos al Campus.' 
                        : 'Histórico de contactos atendidos y registrados.'}
                    </p>
                  </div>

                  {(() => {
                    const filteredLeads = leads.filter(l => {
                      const isDone = l.status === 'atendido' || l.status === 'archived';
                      return statusFilter === 'pending' ? !isDone : isDone;
                    });

                    if (filteredLeads.length === 0) {
                      return (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                          <p className="text-xs text-slate-500 font-bold">
                            {statusFilter === 'pending' 
                              ? 'No hay prospectos pendientes por atender.' 
                              : 'No hay prospectos en el histórico.'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {statusFilter === 'pending' 
                              ? 'Todos los datos capturados han sido atendidos.' 
                              : 'Los contactos procesados aparecerán en esta pestaña.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px]">
                              <th className="p-2.5">Estado / Alerta</th>
                              <th className="p-2.5">Tutor / Contacto</th>
                              <th className="p-2.5">Mascota & Ficha</th>
                              <th className="p-2.5">Raza / Tamaño</th>
                              <th className="p-2.5">Origen</th>
                              <th className="p-2.5 text-center">Acciones WhatsApp / Atención</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredLeads.map((l) => (
                              <tr key={l.id} className="hover:bg-purple-50/50 transition-colors">
                                <td className="p-2.5">
                                  {getTimeElapsedBadge(l.createdAt, l.status)}
                                </td>

                                <td className="p-2.5">
                                  <span className="font-extrabold text-slate-800 block">{l.ownerName}</span>
                                  <span className="text-[10px] text-slate-500 block font-mono">{l.ownerPhone}</span>
                                  {l.email && <span className="text-[10px] text-slate-400 block">{l.email}</span>}
                                </td>

                                <td className="p-2.5">
                                  <span className="font-extrabold text-slate-800 block mb-1">{l.dogName} 🐾</span>
                                  
                                  <button
                                    onClick={() => setSelectedCanineFile({
                                      ownerName: l.ownerName,
                                      dogName: l.dogName,
                                      dogBreed: l.dogBreed,
                                      vaccinesUpToDate: l.vaccinesUpToDate,
                                      allergies: l.allergies,
                                      vetContact: l.vetContact,
                                      feedingHabits: l.feedingHabits
                                    })}
                                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <FileText size={11} />
                                    <span>Ver Ficha Salud</span>
                                  </button>
                                </td>

                                <td className="p-2.5 text-slate-600">
                                  <span>{l.dogBreed || '-'}</span>
                                  <span className="block text-[10px] text-slate-400 font-bold uppercase">{l.dogSize || 'mediano'}</span>
                                </td>

                                <td className="p-2.5 text-[#8A58DC] font-bold">{l.source}</td>

                                <td className="p-2.5 text-center">
                                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                    {/* WhatsApp 1-Click Response */}
                                    <a
                                      href={getWhatsAppUrl('lead', l.ownerName, l.ownerPhone, l.dogName, l.source)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                      title="Abrir WhatsApp con mensaje personalizado de invitación"
                                    >
                                      <MessageCircle size={14} />
                                      <span>WhatsApp</span>
                                    </a>

                                    {statusFilter === 'pending' ? (
                                      <>
                                        <button
                                          onClick={() => handleAttendLead(l.id)}
                                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                          title="Marcar como atendido y mover a histórico"
                                        >
                                          <Check size={14} />
                                          <span>Atender</span>
                                        </button>

                                        <button
                                          onClick={() => handleArchiveLead(l.id)}
                                          className="bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold p-1.5 rounded-xl text-[11px] transition-all cursor-pointer"
                                          title="Archivar prospecto"
                                        >
                                          <X size={14} />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => handleReactivateLead(l.id)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                                        title="Reactivar prospecto y mover a lista de pendientes"
                                      >
                                        <RotateCcw size={13} />
                                        <span>Reactivar</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

          </div>
        )}

        {/* Canine Health File Details Modal */}
        {selectedCanineFile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedCanineFile(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#8FB328]/10 rounded-2xl text-[#8FB328]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Ficha Canina de {selectedCanineFile.dogName} 🐾
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Tutor: {selectedCanineFile.ownerName} ({selectedCanineFile.dogBreed || 'Raza no especificada'})
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <Syringe size={14} className="text-emerald-600" /> Carnet de Vacunación:
                  </span>
                  <p className="text-slate-800 font-bold bg-white p-2 rounded-xl border border-slate-200">
                    {selectedCanineFile.vaccinesUpToDate || 'Sí, vacunas al día'}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <AlertTriangle size={14} className="text-amber-600" /> Alergias / Condición Médica:
                  </span>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded-xl border border-slate-200">
                    {selectedCanineFile.allergies || 'Ninguna alergia ni observación médica reportada.'}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <Stethoscope size={14} className="text-[#00A8E8]" /> Veterinario de Confianza:
                  </span>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded-xl border border-slate-200">
                    {selectedCanineFile.vetContact || 'No especificado.'}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <Utensils size={14} className="text-purple-600" /> Alimentación & Porción:
                  </span>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded-xl border border-slate-200">
                    {selectedCanineFile.feedingHabits || 'Ración estándar de guardería.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setSelectedCanineFile(null)}
                  className="w-full bg-[#8FB328] hover:bg-[#7a9b1f] text-white font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Entendido / Cerrar Ficha
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
