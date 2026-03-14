import { create } from "zustand";
import { persist } from "zustand/middleware";

// Samakan interface ini dengan apa yang kita panggil di UI
export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    unit: string;
    image?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalHarga: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) =>
                set((state) => {
                    const existingIndex = state.items.findIndex((item) => item.id === newItem.id);
                    if (existingIndex >= 0) {
                        const newItems = [...state.items];
                        newItems[existingIndex].qty += newItem.qty;
                        return { items: newItems };
                    }
                    return { items: [...state.items, newItem] };
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateQuantity: (id, qty) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () => get().items.reduce((total, item) => total + item.qty, 0),

            getTotalHarga: () => get().items.reduce((total, item) => total + item.price * item.qty, 0),
        }),
        { name: "sembako-cart-storage" } // Simpan di LocalStorage otomatis
    )
);