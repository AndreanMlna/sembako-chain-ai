import { z } from "zod";
import { UserRole, MetodeJual } from "@/types";

// ---- Auth Validators ----
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    telepon: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Format nomor telepon tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    konfirmasiPassword: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["konfirmasiPassword"],
  });

// ---- Lahan Validators ----
export const lahanSchema = z.object({
  nama: z.string().min(1, "Nama lahan wajib diisi"),
  luasHektar: z.number().positive("Luas lahan harus lebih dari 0"),
  lokasi: z.object({
    jalan: z.string().min(1, "Alamat wajib diisi"),
    kelurahan: z.string().min(1, "Kelurahan wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    kodePos: z.string().min(5, "Kode pos wajib diisi"),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

// ---- Tanaman Validators ----
export const tanamanSchema = z.object({
  nama: z.string().min(1, "Nama tanaman wajib diisi"),
  varietasNama: z.string().min(1, "Varietas wajib diisi"),
  tanggalTanam: z.string().min(1, "Tanggal tanam wajib diisi"),
  estimasiPanen: z.string().min(1, "Estimasi panen wajib diisi"),
});

// ---- Produk Validators ----
export const produkSchema = z.object({
  nama: z.string().min(1, "Nama produk wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  deskripsi: z.string().optional(),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  hargaPerSatuan: z.number().positive("Harga harus lebih dari 0"),
  stokTersedia: z.number().min(0, "Stok tidak boleh negatif"),
  metodeJual: z.nativeEnum(MetodeJual),
});

// ---- Order Validators ----
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        produkId: z.string(),
        jumlah: z.number().positive("Jumlah harus lebih dari 0"),
      })
    )
    .min(1, "Minimal 1 item"),
  alamatPengiriman: z.object({
    jalan: z.string().min(1, "Alamat wajib diisi"),
    kelurahan: z.string().min(1, "Kelurahan wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    kodePos: z.string().min(5, "Kode pos wajib diisi"),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

// ---- Inventory Validators ----
export const inventorySchema = z.object({
  produkId: z.string().min(1, "Produk wajib dipilih"),
  stok: z.number().min(0, "Stok tidak boleh negatif"),
  minStok: z.number().min(0, "Minimum stok tidak boleh negatif"),
  hargaJual: z.number().positive("Harga jual harus lebih dari 0"),
});

// ---- Intervensi Pasar Validators ----
export const intervensiSchema = z.object({
  wilayah: z.string().min(1, "Wilayah wajib diisi"),
  komoditas: z.string().min(1, "Komoditas wajib dipilih"),
  jenisIntervensi: z.enum(["SUBSIDI_ONGKIR", "SUBSIDI_HARGA", "DISTRIBUSI_LANGSUNG"]),
  nilaiSubsidi: z.number().positive("Nilai subsidi harus lebih dari 0"),
  tanggalMulai: z.string().min(1, "Tanggal mulai wajib diisi"),
  tanggalSelesai: z.string().min(1, "Tanggal selesai wajib diisi"),
});

// ---- Type exports ----
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LahanInput = z.infer<typeof lahanSchema>;
export type TanamanInput = z.infer<typeof tanamanSchema>;
export type ProdukInput = z.infer<typeof produkSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type InventoryInput = z.infer<typeof inventorySchema>;
export type IntervensiInput = z.infer<typeof intervensiSchema>;
