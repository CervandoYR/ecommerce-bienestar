import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  isOpen: boolean;
  toggleItem: (product: Product) => boolean; // returns true if added, false if removed
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setIsOpen: (isOpen: boolean) => void;
  get count(): number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggleItem: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          set({
            items: currentItems.filter((item) => item.id !== product.id),
          });
          return false;
        } else {
          set({
            items: [...currentItems, product],
          });
          return true;
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),

      get count() {
        return get().items.length;
      },
    }),
    {
      name: "bienestar-wishlist-storage",
      skipHydration: true,
    }
  )
);
