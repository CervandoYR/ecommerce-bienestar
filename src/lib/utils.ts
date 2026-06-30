import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateFinalPrice(basePrice: number | any): number {
  const p = Number(basePrice);
  if (isNaN(p) || p <= 0) return 0;
  
  let comision = 0;
  if (p < 87.72) {
    comision = 3.50;
  } else {
    comision = (p * 0.0344) + 0.80;
  }
  
  const comisionConIgv = comision * 1.18;
  const finalPrice = p + comisionConIgv;
  
  return Number(finalPrice.toFixed(2));
}

export function calculateBasePrice(finalPrice: number | any): number {
  const f = Number(finalPrice);
  if (isNaN(f) || f <= 0) return 0;
  
  if (f < 91.85) {
    return Number((f - 4.13).toFixed(2));
  } else {
    return Number(((f - 0.944) / 1.040592).toFixed(2));
  }
}

export function formatPrice(price: number | any): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(Number(price));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getDiscountPercentage(price: number | any, compareAtPrice: number | any): number {
  const p = Number(price);
  const c = Number(compareAtPrice);
  if (!c || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
