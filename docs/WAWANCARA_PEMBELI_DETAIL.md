# Wawancara Detail — Pembeli / Konsumen (Buyer)
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| B-F1 | Katalog Produk & Pencarian | High |
| B-F2 | Keranjang Belanja (Shopping Cart) | High |
| B-F3 | Pre-Order Panen (Pesan Sebelum Panen) | Medium |
| B-F4 | Pesanan Saya (Order Management) | High |
| B-F5 | Tracking Pengiriman Real-Time | Medium |
| B-F6 | Metode Pembayaran (COD, Transfer, E-Wallet) | High |
| B-F7 | Notifikasi Status Pesanan | Medium |
| B-F8 | Rating & Review Produk | Low |

---

## Bagian 1: Profil & Kebiasaan Belanja

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| P1 | Status rumah tangga Anda? | a) Lajang tinggal sendiri b) Pasangan tanpa anak c) Keluarga dengan anak d) Lainnya | Segmen konsumen |
| P2 | Siapa yang biasanya berbelanja sembako di rumah? | a) Saya sendiri b) Pasangan c) Orang tua d) Pembantu/ART e) Lainnya | Decision maker |
| P3 | Berapa pengeluaran sembako per bulan? | a) <Rp500rb b) Rp500rb-1jt c) Rp1-2jt d) Rp2-5jt e) >Rp5jt | Segmen ekonomi |
| P4 | Kapan biasanya Anda berbelanja sembako? | a) Hari biasa (weekday) b) Akhir pekan c) Tergantung stok rumah d) Saat ada promo | Timing belanja |
| P5 | Bagaimana transportasi ke tempat belanja? | a) Jalan kaki b) Motor/mobil pribadi c) Angkutan umum d) Online/diantar | Mobilitas |

---

## Bagian 2: Fiksasi Fitur — Katalog Produk (B-F1)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| K1 | Bagaimana Anda mencari produk sembako yang diinginkan? | a) Lihat semua lalu pilih b) Cari nama barang c) Filter kategori d) Lihat rekomendasi | Navigasi katalog |
| K2 | Informasi apa yang paling penting di halaman produk? | a) Foto produk b) Harga c) Berat/ukuran d) Asal produk (dari petani mana) e) Tanggal panen f) Stok tersedia | Field prioritas |
| K3 | Apakah Anda ingin tahu **siapa petaninya**? (Nama, lokasi lahan) | a) Ya, penting b) Lumayan c) Tidak peduli | Transparansi asal |
| K4 | Apakah Anda ingin melihat **sertifikat/izin** produk (kalau ada)? | a) Sangat ingin b) Ingin c) Tidak perlu | Trust factor |
| K5 | Bagaimana tampilan katalog yang Anda sukai? | a) Grid (banyak produk sekaligus) b) List (satu per satu vertikal) c) Lebih suka lihat di peta | Preferensi UI |
| K6 | Fitur **filter** apa yang paling berguna? | a) Filter harga b) Filter kategori c) Filter lokasi (terdekat) d) Filter petani e) Urutkan termurah/termahal | Filter prioritas |
| K7 | Apakah Anda tertarik fitur **produk rekomendasi** berdasarkan belanja sebelumnya? | a) Sangat tertarik b) Tertarik c) Tidak suka, privasi | Personalisasi |

### Skenario Katalog

**Skenario:** Anda ingin membeli cabai segar. Buka aplikasi.

**Alur yang diharapkan:**
1. Halaman utama → kolom pencarian "Cabai"
2. Muncul daftar cabai dari berbagai petani:
   - Cabai Keriting — Petani Budi (5km) — Rp25.000/kg — Stok 50kg
   - Cabai Rawit — Petani Ani (8km) — Rp30.000/kg — Stok 20kg
3. Tap salah satu → lihat detail: foto, deskripsi, asal lahan, tanggal panen
4. Atur jumlah → "Tambah ke Keranjang"

> Pertanyaan: Apakah ada informasi lain yang perlu ditampilkan di halaman detail produk?

---

## Bagian 3: Fiksasi Fitur — Keranjang Belanja (B-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| R1 | Apakah Anda ingin bisa belanja dari **beberapa petani/toko** dalam satu pesanan? | a) Ya, gabung semua b) Ya, tapi pisah pengiriman c) Tidak, cukup satu toko | Multi-vendor cart |
| R2 | Jika belanja dari banyak toko, apakah Anda bersedia bayar ongkos kirim terpisah? | a) Ya, wajar b) Minta digabung c) Tergantung | Shipping cost logic |
| R3 | Fitur apa yang diinginkan di keranjang? | a) Edit jumlah b) Hapus item c) Lihat total sementara d) Simpan untuk nanti (wishlist) e) Ketersediaan stok real-time | Sub-fitur cart |

---

## Bagian 4: Fiksasi Fitur — Pre-Order Panen (B-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| PO1 | Apakah Anda tertarik memesan hasil panen **sebelum** dipanen? | a) Sangat tertarik b) Tertarik c) Kurang d) Tidak | Konsep pre-order |
| PO2 | Alasan Anda tertarik pre-order? | a) Harga lebih murah b) Produk lebih segar c) Dapat produk langka d) Mendukung petani e) Lainnya | Motivasi |
| PO3 | Alasan TIDAK tertarik pre-order? | a) Takut kualitas jelek b) Takut tidak jadi panen c) Tidak mau nunggu d) Tidak percaya e) Lainnya | Hambatan |
| PO4 | Berapa lama Anda bersedia menunggu dari pre-order sampai panen? | a) <1 minggu b) 1-2 minggu c) 1 bulan d) >1 bulan | Toleransi waktu |
| PO5 | Apakah Anda bersedia membayar **DP** untuk pre-order? | a) Ya, 50% b) Ya, 25% c) Ya, bayar lunas d) Tidak, bayar setelah terima | Mekanisme pembayaran |
| PO6 | Berapa diskon yang membuat Anda tertarik pre-order? | a) 5-10% lebih murah b) 10-25% c) >25% d) Tidak perlu diskon, cukup jamin dapat produk | Insentif |

### Matriks Pre-Order

| Produk | Tertarik Pre-Order? | Harga Ideal/kg | Lama Tunggu Ideal |
|--------|--------------------|----------------|-------------------|
| Beras organik | Ya / Tidak | Rp___ | ___ minggu |
| Cabai | Ya / Tidak | Rp___ | ___ minggu |
| Sayuran daun | Ya / Tidak | Rp___ | ___ minggu |
| Buah musiman | Ya / Tidak | Rp___ | ___ minggu |

---

## Bagian 5: Fiksasi Fitur — Pesanan Saya & Tracking (B-F4, B-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| S1 | Informasi apa yang ingin Anda lihat di halaman **Pesanan Saya**? | a) Status pesanan b) Nomor resi c) Nama kurir d) Estimasi tiba e) Total pembayaran f) Semua | Field order status |
| S2 | Status apa yang ingin Anda ketahui? | a) Diproses b) Sedang diantar c) Sudah sampai d) Selesai | Status updates |
| S3 | Apakah Anda ingin **tracking real-time** di peta? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi tracking |
| S4 | Apakah Anda ingin bisa **hubungi kurir** langsung? | a) Ya, via chat b) Ya, via telepon c) Tidak, lewat CS d) Lainnya | Komunikasi kurir |
| S5 | Apakah Anda ingin **ubah alamat** setelah pesan? | a) Ya, sebelum dikirim b) Ya, asal belum jauh c) Tidak bisa | Fleksibilitas alamat |
| S6 | Apakah Anda ingin **batalkan pesanan**? | a) Ya, kapan saja b) Ya, sebelum diproses c) Tidak bisa | Pembatalan |

### Skenario Tracking

**Skenario:** Anda memesan beras 5kg dan cabai 1kg jam 08:00.

**Alur yang diharapkan:**
1. 08:00 — Pesan → Status: "Menunggu Konfirmasi"
2. 08:15 — Petani konfirmasi → Status: "Diproses"
3. 09:00 — Kurir ambil barang → Status: "Sedang Diantar" + Notif
4. 09:00 — Peta: Lihat kurir bergerak real-time + ETA: 30 menit
5. 09:30 — Sampai → Notif: "Pesanan Tiba" + QR code untuk konfirmasi
6. 09:35 — Terima barang → Status: "Selesai"

> Pertanyaan: Di step berapa Anda ingin notifikasi? Apakah tracking real-time penting?

---

## Bagian 6: Fiksasi Fitur — Metode Pembayaran (B-F6)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| M1 | Metode pembayaran apa yang paling sering Anda gunakan? | a) Tunai (COD) b) Transfer Bank c) E-Wallet (GoPay/OVO/Dana) d) QRIS e) Kartu kredit | Preferensi existing |
| M2 | Apakah Anda bersedia **COD (bayar di tempat)**? | a) Ya, lebih aman b) Ya, tapi harus ada uang kembalian c) Tidak, lebih suka non-tunai | Validasi COD |
| M3 | Apakah Anda bersedia **bayar di muka (transfer/e-wallet)**? | a) Ya, percaya b) Ya, untuk jumlah kecil c) Tidak, takut penipuan | Trust online payment |
| M4 | Jika COD, berapa maksimal nominal COD yang nyaman? | a) <Rp50rb b) Rp50-100rb c) Rp100-500rb d) >Rp500rb | Batas COD |
| M5 | Apakah Anda ingin menyimpan metode bayar (card/e-wallet) untuk下次 lebih cepat? | a) Ya, asal aman b) Tidak, input manual setiap kali | Saved payment |

---

## Bagian 7: Fiksasi Fitur — Notifikasi (B-F7)

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| N1 | Notifikasi apa yang ingin Anda terima? | a) Pesanan dikonfirmasi b) Pesanan dikirim c) Pesanan sampai d) Promo/diskon e) Produk baru dari petani favorit | Jenis notifikasi |
| N2 | Channel notifikasi yang diinginkan? | a) Notifikasi aplikasi b) WhatsApp c) Email d) SMS | Channel |

---

## Bagian 8: Fiksasi Fitur — Rating & Review (B-F8)

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| R1 | Apakah Anda biasanya memberi rating setelah belanja? | a) Ya, selalu b) Kadang c) Tidak pernah | Kebiasaan rating |
| R2 | Faktor apa yang membuat Anda memberi rating? | a) Kualitas produk b) Kecepatan pengiriman c) Kemasan d) Harga e) Keramahan kurir | Dimensi rating |
| R3 | Apakah Anda membaca review sebelum membeli? | a) Ya, selalu b) Kadang c) Tidak pernah | Pengaruh review |
| R4 | Apakah Anda ingin upload **foto produk** di review? | a) Ya b) Tidak, cukup bintang c) Tidak perlu | Fitur review |

---

## Bagian 9: Fiksasi — Skenario Lengkap Belanja

**Skenario:** Anda ingin belanja mingguan untuk keluarga (beras, minyak, telur, cabai).

1. Buka aplikasi → halaman utama menampilkan kategori & produk populer
2. Ketuk "Beras" → lihat produk beras dari petani terdekat
3. Pilih Beras 5kg @Rp15.000 → tap "Tambah ke Keranjang"
4. Cari "Minyak Goreng" → pilih Minyak 2L @Rp20.000 → tambah
5. Cari "Telur" → pilih Telur 1kg @Rp28.000 → tambah
6. Cari "Cabai" → pilih Cabai 0.5kg @Rp15.000 → tambah
7. Buka keranjang → lihat total: Rp78.000 → tap "Checkout"
8. Pilih metode bayar: COD / Transfer / E-Wallet
9. Konfirmasi alamat → "Pesan"
10. Status: "Menunggu Konfirmasi Petani" → ETA: 2-3 jam
11. Notifikasi: "Pesanan Sedang Diantar" + tracking link
12. Terima barang → rating & review

> **Pertanyaan:** Berapa lama total waktu yang Anda harapkan dari pesan sampai terima? Apakah ada langkah yang ingin Anda lewati atau ditambahkan?

---

## Bagian 10: Analisis Kebutuhan — Preferensi Produk

| No | Pertanyaan | Opsi |
|----|-----------|------|
| H1 | Apakah Anda bersedia membayar **lebih mahal** untuk produk yang lebih segar & langsung dari petani? | a) Ya, 10-20% lebih mahal b) Ya, 5-10% c) Harga harus sama d) Harus lebih murah (tanpa tengkulak) |
| H2 | Apakah Anda peduli dengan **kemasan** produk? | a) Peduli, harus bersih & rapi b) Peduli, tapi tidak harus mewah c) Tidak peduli, yang penting produknya |
| H3 | Apakah Anda tertarik dengan **paket sembako hemat** (bundling)? | a) Sangat tertarik b) Tertarik c) Tidak |
| H4 | Jika tertarik, paket apa yang diinginkan? | a) Paket sembako lengkap (5-10 item) b) Paket masak (bumbu + lauk) c) Paket murah (produk diskon) d) Lainnya |
| H5 | Apakah Anda ingin **berlangganan** (subscription) untuk barang tertentu? | a) Ya, beras setiap minggu b) Ya, susu setiap minggu c) Tidak d) Mungkin |

---

## Bagian 11: Matriks Prioritas Final — Pembeli

Urutkan fitur dari paling penting (1) ke kurang penting (8):

| Fitur | Ranking (1-8) |
|-------|---------------|
| Katalog Produk & Pencarian | _ |
| Keranjang Belanja | _ |
| Pre-Order Panen | _ |
| Pesanan Saya | _ |
| Tracking Pengiriman | _ |
| Metode Pembayaran | _ |
| Notifikasi | _ |
| Rating & Review | _ |

---

## Bagian 12: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Perangkat apa yang digunakan untuk belanja online? | a) HP Android b) iPhone c) Laptop/komputer |
| NF2 | Apakah koneksi internet di rumah stabil? | a) Stabil b) Kadang putus c) Tidak stabil |
| NF3 | Apakah Anda lebih suka aplikasi mobile atau website? | a) Aplikasi mobile b) Website c) Dua-duanya |
| NF4 | Berapa ukuran aplikasi maksimal yang Anda terima? | a) <50MB b) 50-100MB c) Tidak masalah |

---

## Bagian 13: Pertanyaan Terbuka

| No | Pertanyaan |
|----|-----------|
| O1 | Apa keluhan terbesar Anda saat berbelanja sembako (offline maupun online)? |
| O2 | Apa yang membuat Anda percaya untuk membeli bahan makanan secara online? |
| O3 | Jika aplikasi ini bisa menjadi "asisten belanja" Anda, apa fitur impiannya? |
| O4 | Apakah Anda bersedia merekomendasikan aplikasi ini ke tetangga/teman? Apa syaratnya? |
| O5 | Ceritakan pengalaman terbaik & terburuk belanja sembako online (jika pernah) |

---

## Ringkasan Keputusan Fiksasi

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Metode pembayaran utama | |
| Toleransi waktu kirim | |
| Kebutuhan tracking | |
| Minat pre-order | |
| Minat subscription | |
| Bundle/paket diinginkan | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Pembeli*
