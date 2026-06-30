export const STORE_NAME = 'Samay Munay';
export const STORE_DESCRIPTION = 'Tu tienda de productos de relajación y bienestar en Lima, Perú';
export const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bienestarstore.pe';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';
export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || 'hola@bienestarstore.pe';
export const STORE_ORIGIN = 'San Juan de Miraflores, Lima, Perú';

export const ORDER_STATUSES = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800', icon: 'Clock' },
  PAGADO: { label: 'Pagado', color: 'bg-emerald-100 text-emerald-800', icon: 'CreditCard' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-blue-100 text-blue-800', icon: 'Package' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-violet-100 text-violet-800', icon: 'Truck' },
  ENTREGADO: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
} as const;

export const PAYMENT_METHODS = {
  WEB: { label: 'Pago Online', icon: 'CreditCard' },
  WHATSAPP: { label: 'WhatsApp', icon: 'MessageCircle' },
} as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Nosotros', href: '/nosotros' },
] as const;

export const FOOTER_LINKS = {
  tienda: [
    { label: 'Todos los productos', href: '/productos' },
    { label: 'Nosotros', href: '/nosotros' },
  ],
  legal: [
    { label: 'Política de Privacidad', href: '/politica-privacidad' },
    { label: 'Términos y Condiciones', href: '/terminos' },
    { label: 'Garantías y Devoluciones', href: '/garantias' },
    { label: 'Libro de Reclamaciones', href: '/libro-reclamaciones' },
  ],
} as const;

export const ITEMS_PER_PAGE = 12;
