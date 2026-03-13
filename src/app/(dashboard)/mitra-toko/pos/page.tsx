"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Search, Tag } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: 1, name: "Beras Rojolele 5kg", price: 75000, stock: 12, category: "Sembako" },
  { id: 2, name: "Minyak Goreng 2L", price: 34000, stock: 5, category: "Minyak" },
  { id: 3, name: "Gula Pasir 1kg", price: 16000, stock: 10, category: "Sembako" },
  { id: 4, name: "Telur Ayam 1kg", price: 28000, stock: 50, category: "Protein" },
];

export default function POSPage() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="Point of Sale (POS)"
            description="Kasir sederhana untuk transaksi di toko"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: PRODUCT SELECTION */}
          <div className="lg:col-span-2 space-y-4">
            <SearchBar
                placeholder="Scan barcode atau cari nama produk..."
                onSearch={(q) => console.log("Search:", q)}
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PRODUCTS.map((product) => (
                  /* FIX: Bungkus Card dengan div dan pindahkan onClick ke sini */
                  <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="cursor-pointer active:scale-95 transition-all group"
                  >
                    <Card className="h-full border-border hover:border-primary/50 bg-card overflow-hidden">
                      <div className="aspect-video bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Tag className="h-8 w-8 text-primary/30" />
                      </div>
                      <CardContent className="p-3">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{product.category}</p>
                        <h4 className="text-sm font-bold text-foreground leading-tight mt-1">{product.name}</h4>
                        <p className="mt-2 text-base font-extrabold text-foreground">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-[10px] text-foreground/40 mt-1 font-medium">Stok: {product.stock}</p>
                      </CardContent>
                    </Card>
                  </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CART / CHECKOUT */}
          <div className="relative">
            <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 h-fit overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Keranjang</h3>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                      <p className="py-8 text-center text-sm text-foreground/40 italic">
                        Belum ada item terpilih.
                      </p>
                  ) : (
                      cart.map((item) => (
                          <div key={item.id} className="flex flex-col gap-2 border-b border-border/50 pb-3">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-foreground leading-tight w-2/3">{item.name}</p>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.id, -1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors font-bold">-</button>
                                <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors font-bold">+</button>
                              </div>
                              <p className="text-sm font-bold text-foreground">
                                Rp {(item.price * item.qty).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                      ))
                  )}
                </div>

                {/* TOTAL & PAY */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                    <span className="text-sm font-medium text-foreground/60">Subtotal</span>
                    <span className="text-sm font-bold text-foreground">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xl font-black text-foreground">
                    <span>Total</span>
                    <span className="text-primary tracking-tighter">Rp {total.toLocaleString("id-ID")}</span>
                  </div>

                  <Button
                      className="w-full py-7 text-lg font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                      disabled={cart.length === 0}
                  >
                    <CreditCard className="mr-2 h-6 w-6" />
                    BAYAR SEKARANG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}