import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  get cartTotal(): number;
  get cartCount(): number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === product.id);

        if (existingItem) {
          // Check stock before adding
          const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
          
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...currentItems, { product, quantity: Math.min(quantity, product.stock) }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.product.id === productId);
        
        if (item) {
          const newQuantity = Math.max(1, Math.min(quantity, item.product.stock));
          set({
            items: currentItems.map((i) =>
              i.product.id === productId ? { ...i, quantity: newQuantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),

      get cartTotal() {
        return get().items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        );
      },

      get cartCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "bienestar-cart-storage",
      skipHydration: true, // We will manually hydrate to avoid hydration mismatch
    }
  )
);
