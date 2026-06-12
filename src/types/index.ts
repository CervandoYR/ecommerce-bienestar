import type { Product, Category, Order, OrderItem, User, Review, Coupon, ShippingZone, District, OrderStatus, PaymentMethod, DiscountType } from '@prisma/client';

// Re-export Prisma types
export type { Product, Category, Order, OrderItem, User, Review, Coupon, ShippingZone, District, OrderStatus, PaymentMethod, DiscountType };

// Extended types with relations
export type ProductWithCategory = Product & {
  category: Category;
};

export type ProductWithDetails = Product & {
  category: Category;
  reviews: Review[];
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string | null;
    ogImage: string | null;
    keywords: string[];
    jsonLd: unknown;
  } | null;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
  district: District;
  coupon: Coupon | null;
};

export type OrderWithTracking = OrderWithItems & {
  statusHistory: {
    id: string;
    status: OrderStatus;
    notes: string | null;
    createdAt: Date;
  }[];
};

export type CartItemWithProduct = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string[];
    stock: number;
    isActive: boolean;
  };
};

export type CartWithItems = {
  id: string;
  items: CartItemWithProduct[];
};

// API Response types
export type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Checkout types
export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  reference: string;
  districtId: string;
  customerNotes?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
};

export type ShippingCalculation = {
  zone: {
    id: string;
    name: string;
    isSameDay: boolean;
  };
  cost: number;
  minDays: number;
  maxDays: number;
};

// Search/Filter types
export type ProductFilters = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
  search?: string;
  page?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};
