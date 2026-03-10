import { create } from "zustand";
import { Produk } from "@/types";

interface CartItem {
  produk: Produk;
  jumlah: number;
}

interface CartState {
  items: CartItem[];
  addItem: (produk: Produk, jumlah: number) => void;
  removeItem: (produkId: string) => void;
  updateQuantity: (produkId: string, jumlah: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalHarga: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (produk, jumlah) =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.produk.id === produk.id
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].jumlah += jumlah;
        return { items: newItems };
      }
      return { items: [...state.items, { produk, jumlah }] };
    }),

  removeItem: (produkId) =>
    set((state) => ({
      items: state.items.filter((item) => item.produk.id !== produkId),
    })),

  updateQuantity: (produkId, jumlah) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.produk.id === produkId ? { ...item, jumlah } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.jumlah, 0);
  },

  getTotalHarga: () => {
    return get().items.reduce(
      (total, item) => total + item.produk.hargaPerSatuan * item.jumlah,
      0
    );
  },
}));
