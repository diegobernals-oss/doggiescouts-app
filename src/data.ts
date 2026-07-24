import { PricingTable, ServiceItem, ScheduleDay } from './types';

export const MI_DOMINIO = 'https://royalblue-baboon-295141.hostingersite.com';
export const ASLAN_URL = `${MI_DOMINIO}/2.jpg`;
export const HERO_LOGO_URL = `${MI_DOMINIO}/1.png`;

export const WHATSAPP_PHONE = '573228553138';
export const WHATSAPP_DISPLAY = '322 8553138';
export const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/g8HoLaDhMkZiWVA2A';
export const WAZE_LINK = 'https://waze.com/ul?ll=4.8080,-74.0410&navigate=yes';
export const CALENDLY_LINK = 'https://calendly.com/doggiescouts-bogota/reserva';
export const INSTAGRAM_LINK = 'https://www.instagram.com/doggiescouts?igsh=Zm5nNTk4Y3ZndWxh';
export const EMAIL_ADDRESS = 'contacto@doggiescouts.com';
export const LOCATION_ADDRESS = 'Bogotá, Vía Guaymaral, Karimagua - Campus Campestre';

export const DEFAULT_SERVICES: ServiceItem[] = [
  { 
    id: 'guarderia', 
    name: 'Guardería Campestre', 
    icon: 'Dog', 
    desc: 'Cuidado diario completo al aire libre en Guaymaral',
    category: 'Cuidado Diario',
    image: `${MI_DOMINIO}/foto5.jpg?v=1`,
    included: ['Socialización supervisada', 'Paseos campestres', 'Reporte diario en foto/video', 'Enriquecimiento ambiental']
  },
  { 
    id: 'semi_2', 
    name: 'Seminternado (2 días)', 
    icon: 'Calendar', 
    desc: '2 días a la semana de libertad y juego',
    category: 'Cuidado Diario',
    image: `${MI_DOMINIO}/foto6.jpg?v=1`,
    included: ['Ruta puerta a puerta disponible', 'Piscina y zona húmeda', 'Niñeras caninas 24/7']
  },
  { 
    id: 'semi_3', 
    name: 'Seminternado (3 días)', 
    icon: 'Calendar', 
    desc: '3 días a la semana de aventura',
    category: 'Cuidado Diario',
    image: `${MI_DOMINIO}/foto7.jpg?v=1`,
    included: ['Ruta puerta a puerta disponible', 'Snack natural de la tarde', 'Reportes VIP']
  },
  { 
    id: 'pasadia', 
    name: 'Pasadía de Diversión', 
    icon: 'PawPrint', 
    desc: 'Un día libre lleno de campo y nuevos amigos',
    category: 'Cuidado Diario',
    image: `${MI_DOMINIO}/foto8.jpg?v=1`,
    included: ['Acceso a todas las zonas recreativas', 'Evaluación de comportamiento inicial']
  },
  { 
    id: 'hotel', 
    name: 'Hotel Canino 5★', 
    icon: 'Hotel', 
    desc: 'Hospedaje campestre nocturno con supervisión 24/7',
    category: 'Hospedaje',
    image: `${MI_DOMINIO}/foto9.jpg?v=1`,
    included: ['Habitaciones climatizadas y acogedoras', 'Atención personalizada de niñeras', 'Cobijas y juguetes propios', 'Descuento especial por más de 8 días']
  },
  { 
    id: 'baño', 
    name: 'Spa & Peluquería Canina', 
    icon: 'ShowerHead', 
    desc: 'Bañito relajante, soplado y perfumado',
    category: 'Estética & Salud',
    image: `${MI_DOMINIO}/foto10.jpg?v=1`,
    included: ['Champú hipoalergénico', 'Limpieza de oídos y corte de uñas', 'Fragancia herbal de la casa']
  },
  {
    id: 'zona_humeda',
    name: 'Zona Húmeda & Piscina 💧',
    icon: 'Waves',
    desc: 'Hidroterapia recreativa y chapuzón supervisado',
    category: 'Recreación',
    image: `${MI_DOMINIO}/foto7.jpg?v=1`,
    included: ['Chalecos salvavidas para principiantes', 'Secado y soplado posterior']
  },
  {
    id: 'recreacion',
    name: 'Recreación & Agility 🥎',
    icon: 'Zap',
    desc: 'Pistas de obstáculos y juegos de olfato',
    category: 'Recreación',
    image: `${MI_DOMINIO}/foto8.jpg?v=1`,
    included: ['Juegos de inteligencia', 'Pistas de agilidad de bajo impacto']
  }
];

export const DEFAULT_PRICES: PricingTable = {
  guarderia: { pequeño: 150000, mediano: 250000, grande: 350000 },
  semi_2: { pequeño: 120000, mediano: 280000, grande: 340000 },
  semi_3: { pequeño: 80000, mediano: 150000, grande: 220000 },
  pasadia: { pequeño: 45000, mediano: 55000, grande: 65000 },
  hotel: { pequeño: 60000, mediano: 75000, grande: 90000 },
  baño: { pequeño: 35000, mediano: 45000, grande: 55000 },
  zona_humeda: { pequeño: 25000, mediano: 35000, grande: 45000 },
  recreacion: { pequeño: 20000, mediano: 30000, grande: 40000 },
};

export const DEFAULT_GALLERY = [
  { id: '1', url: `${MI_DOMINIO}/foto5.jpg?v=1`, title: 'Guardería Campestre en Guaymaral', serviceId: 'guarderia' },
  { id: '2', url: `${MI_DOMINIO}/foto6.jpg?v=1`, title: 'Socialización Segura en Manada', serviceId: 'semi_2' },
  { id: '3', url: `${MI_DOMINIO}/foto7.jpg?v=1`, title: 'Zona Húmeda & Chapuzón Canino', serviceId: 'zona_humeda' },
  { id: '4', url: `${MI_DOMINIO}/foto8.jpg?v=1`, title: 'Recreación & Agility al Aire Libre', serviceId: 'recreacion' },
  { id: '5', url: `${MI_DOMINIO}/foto9.jpg?v=1`, title: 'Hotel Canino & Descanso Nocturno 5★', serviceId: 'hotel' },
  { id: '6', url: `${MI_DOMINIO}/foto10.jpg?v=1`, title: 'Peluquería, Baño & Spa Consentido', serviceId: 'baño' },
];

export const WEEKLY_SCHEDULE: ScheduleDay[] = [
  { dayName: 'Lunes', hours: '06:00 - 20:00' },
  { dayName: 'Martes', hours: '06:00 - 20:00' },
  { dayName: 'Miércoles', hours: '06:00 - 20:00' },
  { dayName: 'Jueves', hours: '06:00 - 20:00' },
  { dayName: 'Viernes', hours: '06:00 - 20:00' },
  { dayName: 'Sábado', hours: '08:00 - 18:30' },
  { dayName: 'Domingo', hours: '08:00 - 18:30' },
];

export const AI_SUGGESTED_QUESTIONS = [
  "¿Cómo apoyan a perritos tímidos en su adaptación al campus?",
  "¿Cuáles son los requisitos sanitarios para ingresar al hotel?",
  "¿Cómo funciona el servicio de transporte en Bogotá y Guaymaral?",
  "¿Qué actividades realizan durante la jornada de guardería?",
  "¿Cómo cuidan a perritos viejitos o con medicamentos especiales?"
];
