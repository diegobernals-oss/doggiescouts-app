export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: string;
  image?: string;
  included?: string[];
}

export interface PricingTable {
  [serviceId: string]: {
    pequeño: number;
    mediano: number;
    grande: number;
  };
}

export interface VIPTicket {
  id: string;
  code: string;
  ownerName: string;
  email: string;
  ownerPhone: string;
  dogName: string;
  dogBreed: string;
  dogSize: 'pequeño' | 'mediano' | 'grande';
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  createdAt: string;
  status: 'pending' | 'atendido' | 'confirmed' | 'completed' | 'cancelled' | 'archived';
  vaccinesUpToDate?: string;
  allergies?: string;
  vetContact?: string;
  feedingHabits?: string;
}

export interface LeadContact {
  id: string;
  ownerName: string;
  email: string;
  ownerPhone: string;
  dogName: string;
  dogBreed: string;
  dogSize: 'pequeño' | 'mediano' | 'grande';
  source: 'lead_magnet_guia' | 'cotizador_promo' | 'consulta_web' | 'cotizador_express';
  optInPromos: boolean;
  createdAt: string;
  status?: 'pending' | 'atendido' | 'archived';
  vaccinesUpToDate?: string;
  allergies?: string;
  vetContact?: string;
  feedingHabits?: string;
}

export interface QuoteItem {
  dogName: string;
  dogSize: 'pequeño' | 'mediano' | 'grande';
  serviceId: string;
  serviceName: string;
  days: number;
  total: number;
  discount: number;
  createdAt: string;
}

export interface ScheduleDay {
  dayName: string;
  hours: string;
  isToday?: boolean;
}

export interface AIConsultationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AgendaBlockedSlot {
  id: string;
  date: string;
  timeSlot: string; // 'ALL_DAY' or specific time slot e.g. '09:00 AM'
  reason?: string;
  createdAt?: string;
}

export interface AgendaSettings {
  id: string;
  maxDogsPerSlot: number;
  maxDogsPerDay: number;
  openingTime: string;
  closingTime: string;
}

