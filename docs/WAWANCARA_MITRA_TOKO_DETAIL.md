# Wawancara Detail — Mitra Toko / Pasar (Partner Store)
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| M-F1 | Manajemen Inventaris (Stok Barang) | High |
| M-F2 | Notifikasi Restock Otomatis (Auto-Restock Alert) | High |
| M-F3 | POS Digital (Point of Sale) | High |
| M-F4 | Katalog Produk Online (Toko Digital) | Medium |
| M-F5 | Pemesanan ke Petani (Order Farmer) | High |
| M-F6 | Riwayat Transaksi & Laporan Penjualan | Medium |
| M-F7 | Manajemen Harga Jual | Medium |
| M-F8 | E-Wallet / Pembayaran Digital | Medium |
| M-F9 | Notifikasi & Informasi Pasar | Low |

---

## Bagian 1: Profil Toko & Konteks Bisnis

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| P1 | Bagaimana status kepemilikan toko Anda? | a) Milik sendiri b) Sewa c) Keluarga d) Koperasi | Profil bisnis |
| P2 | Berapa lama toko Anda beroperasi setiap hari? | a) <8 jam b) 8-12 jam c) >12 jam d) 24 jam | Jam operasional |
| P3 | Kapan jam tersibuk toko Anda? | a) Pagi (05:00-09:00) b) Siang (11:00-14:00) c) Sore (15:00-18:00) d) Merata | Peak hours |
| P4 | Berapa rata-rata transaksi per hari? | a) <20 transaksi b) 20-50 c) 50-100 d) >100 | Volume bisnis |
| P5 | Apakah Anda memiliki karyawan? | a) Tidak (sendiri) b) 1-2 orang c) 3-5 orang d) >5 orang | Skala usaha |
| P6 | Apakah toko Anda sudah memiliki izin usaha (NIB/SIUP)? | a) Ya b) Dalam proses c) Tidak | Kesiapan legalitas |
| P7 | Metode pembayaran apa yang diterima di toko? | a) Tunai saja b) Tunai + transfer c) Tunai + QRIS d) Tunai + QRIS + kartu | Payment method existing |
| P8 | Apakah Anda menyediakan layanan antar / delivery? | a) Ya, sendiri b) Ya, via ojek c) Tidak | Delivery readiness |

---

## Bagian 2: Fiksasi Fitur — Manajemen Inventaris (M-F1)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| I1 | Bagaimana Anda mencatat stok barang saat ini? | a) Ingatan saja b) Buku catatan c) Excel/Google Sheets d) Aplikasi khusus | Metode existing |
| I2 | Seberapa sering Anda menghitung stok (stock opname)? | a) Setiap hari b) Seminggu sekali c) Sebulan sekali d) Tidak menentu | Frekuensi opname |
| I3 | Berapa lama waktu yang dihabiskan untuk menghitung stok? | a) <30 menit b) 30-60 menit c) 1-2 jam d) >2 jam | Efisiensi waktu |
| I4 | Berapa jumlah item/SKU yang Anda kelola? | a) <20 item b) 20-50 item c) 50-100 item d) >100 item | Skala inventory |
| I5 | Data apa yang paling penting dalam pencatatan stok? | a) Nama barang b) Jumlah stok c) Harga beli d) Harga jual e) Tanggal kadaluarsa f) Nama pemasok | Field inventaris |
| I6 | Apakah Anda mencatat tanggal kadaluarsa barang? | a) Ya, selalu b) Kadang c) Tidak | Validasi expiry tracking |
| I7 | Apakah Anda ingin sistem memberi peringatan barang mendekati kadaluarsa? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi expiry alert |

### Skenario Manajemen Stok

**Skenario:** Anda menerima kiriman beras 10 karung dari petani.

**Langkah yang diharapkan:**
1. Buka "Tambah Stok"
2. Cari barang "Beras" (atau tambah baru jika belum ada)
3. Isi: Jumlah (+10 karung), Harga beli (@Rp500.000/karung), Pemasok (Nama Petani)
4. Sistem otomatis update stok: "Stok beras: 15 karung (sebelumnya 5)"
5. Selesai

> Pertanyaan: Apakah langkah di atas sudah sesuai? Adakah data tambahan yang perlu dicatat?

---

## Bagian 3: Fiksasi Fitur — Notifikasi Restock Otomatis (M-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| R1 | Apakah Anda sering kehabisan stok barang tertentu? | a) Sering b) Kadang c) Jarang d) Tidak pernah | Validasi kebutuhan |
| R2 | Barang apa yang paling sering habis? | a) Beras b) Minyak goreng c) Gula d) Telur e) Lainnya | Top restock |
| R3 | Bagaimana Anda tahu kapan harus restok? | a) Lihat stok langsung b) Pelanggan bilang habis c) Catatan stok d) Jadwal tetap | Metode existing |
| R4 | Berapa level stok minimum yang ideal untuk barang-barang Anda? (contoh: beras minimal 5 karung) | (Isian per kategori) | Parameter minimum stok |
| R5 | Apakah Anda ingin notifikasi otomatis saat stok mencapai batas minimum? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi fitur |
| R6 | Dalam bentuk apa notifikasi yang diinginkan? | a) Notifikasi aplikasi b) WhatsApp c) SMS d) Email | Channel notifikasi |
| R7 | Apakah Anda ingin notifikasi juga dikirim ke pemasok (petani/distributor) agar otomatis mengirim barang? | a) Ya, otomatis pesan b) Ya, tapi saya konfirmasi dulu c) Tidak | Auto-order |
| R8 | Seberapa cepat Anda ingin stok diisi ulang setelah notifikasi? | a) Hari ini juga b) 1-2 hari c) 3-7 hari d) Tergantung | Lead time harapan |

### Matriks Batas Minimum Stok (Rp)

| Komoditas | Satuan | Stok Minimum | Stok Maksimum |
|-----------|--------|-------------|---------------|
| Beras | Karung (kg) | _ | _ |
| Minyak Goreng | Liter | _ | _ |
| Gula Pasir | Kg | _ | _ |
| Telur | Kg | _ | _ |
| Tepung Terigu | Kg | _ | _ |
| (isi sendiri) | | _ | _ |

---

## Bagian 4: Fiksasi Fitur — POS Digital (M-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| P1 | Apakah Anda menggunakan kasir/mesin POS saat ini? | a) POS komputer b) Tablet POS c) Buku/dicatat manual d) HP dicatat e) Tidak dicatat | Metode kasir |
| P2 | Jika menggunakan aplikasi POS, apa aplikasinya? | a) Moka b) Pawoon c) iPos d) Lainnya | Benchmark kompetitor |
| P3 | Fitur POS apa yang paling penting? | a) Scan barcode barang b) Cetak struk c) Hitung kembalian otomatis d) Catat riwayat penjualan e) Multi-metode bayar | Prioritas sub-fitur |
| P4 | Apakah Anda membutuhkan fitur **hutang/piutang** pelanggan? | a) Ya, sering b) Kadang c) Tidak | Validasi credit system |
| P5 | Apakah Anda membutuhkan fitur **diskon/promosi** di POS? | a) Ya b) Tidak | Validasi promo |
| P6 | Apakah Anda membutuhkan koneksi ke **printer struk**? | a) Ya, bluetooth b) Ya, thermal c) Tidak perlu | Hardware POS |
| P7 | Apakah Anda membutuhkan **barcode scanner**? | a) Ya b) Tidak | Hardware |
| P8 | Berapa lama waktu yang Anda targetkan untuk satu transaksi di kasir? | a) <30 detik b) 30-60 detik c) 1-2 menit d) >2 menit | Target kecepatan |

### Skenario POS

**Skenario:** Pelanggan membeli beras 5kg @Rp15.000, minyak 2L @Rp20.000, gula 1kg @Rp18.000. Total: Rp133.000. Bayar: Rp150.000.

**Alur yang diharapkan:**
1. Buka POS → pilih pelanggan (opsional)
2. Cari "Beras" → tap → input 5 kg
3. Cari "Minyak" → tap → input 2L
4. Cari "Gula" → tap → input 1kg
5. Sistem hitung total otomatis: Rp133.000
6. Input bayar: Rp150.000
7. Sistem hitung kembalian: Rp17.000
8. Cetak struk (opsional)
9. Stok otomatis berkurang

> Pertanyaan: Apakah alur ini lebih cepat dari cara Anda saat ini? Adakah langkah yang bisa di-skip untuk transaksi cepat?

### Matriks Keputusan — POS

| Sub-Fitur | Sangat Dibutuhkan | Lumayan | Tidak Dibutuhkan |
|-----------|-------------------|---------|------------------|
| Scan barcode | ☐ | ☐ | ☐ |
| Cetak struk thermal | ☐ | ☐ | ☐ |
| Cetak struk bluetooth | ☐ | ☐ | ☐ |
| Hitung kembalian otomatis | ☐ | ☐ | ☐ |
| Catat hutang pelanggan | ☐ | ☐ | ☐ |
| Diskon per item | ☐ | ☐ | ☐ |
| Pilih metode bayar | ☐ | ☐ | ☐ |
| Multi-akun (kasir berbeda) | ☐ | ☐ | ☐ |

---

## Bagian 5: Fiksasi Fitur — Katalog Produk Online (M-F4)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| O1 | Apakah Anda ingin produk toko Anda muncul di **katalog online** yang bisa dilihat pembeli? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi toko online |
| O2 | Apakah Anda khawatir harga yang tampil online akan dibanding-bandingkan? | a) Khawatir b) Biasa saja c) Tidak khawatir | Pain point transparansi |
| O3 | Apakah Anda bersedia update stok online secara real-time? | a) Ya, otomatis dari POS b) Ya, manual c) Tidak | Kesiapan sinkronisasi |
| O4 | Apakah Anda ingin menerima **pesanan online** untuk diambil di toko (click & collect)? | a) Ya b) Mungkin c) Tidak | Click & collect |
| O5 | Apakah Anda ingin melayani **pengiriman** untuk pesanan online? | a) Ya, diantar kurir b) Ya, diantar sendiri c) Tidak | Delivery model |
| O6 | Jika menerima pesanan online, berapa lama waktu persiapan yang dibutuhkan? | a) <30 menit b) 30-60 menit c) 1-2 jam d) >2 jam | Lead time pesanan |

---

## Bagian 6: Fiksasi Fitur — Pemesanan ke Petani (M-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| S1 | Apakah Anda tertarik memesan stok langsung dari **petani** melalui aplikasi? | a) Sangat tertarik b) Tertarik c) Kurang d) Tidak | Validasi farm-to-store |
| S2 | Komoditas apa yang paling ingin Anda pesan langsung dari petani? | a) Beras b) Cabai c) Bawang d) Sayuran e) Buah f) Lainnya | Komoditas prioritas |
| S3 | Berapa volume minimal pembelian dari petani yang ideal? | a) Berapa saja b) Minimal 5 kg c) Minimal 10 kg d) Minimal 50 kg | MOQ dari petani |
| S4 | Apakah Anda bersedia membayar **di muka (DP)** untuk pesanan petani? | a) Ya, 100% b) Ya, 50% DP c) Ya, 25% DP d) Tidak, bayar setelah terima | Mekanisme pembayaran |
| S5 | Berapa lama Anda bersedia menunggu pengiriman dari petani? | a) 1 hari b) 2-3 hari c) Seminggu d) Tergantung komoditas | Toleransi waktu |
| S6 | Apakah Anda bersedia menjemput barang ke lokasi petani? | a) Ya b) Tergantung jarak c) Tidak, harus diantar | Logistik |
| S7 | Faktor terpenting dalam memilih petani pemasok? | a) Harga b) Kualitas c) Jarak d) Konsistensi stok e) Kepercayaan | Prioritas seleksi |

### Matriks Preferensi Pemasok

| Kriteria | Sangat Penting | Penting | Tidak Penting |
|----------|---------------|---------|---------------|
| Harga termurah | ☐ | ☐ | ☐ |
| Kualitas terbaik | ☐ | ☐ | ☐ |
| Lokasi terdekat | ☐ | ☐ | ☐ |
| Konsistensi pasokan | ☐ | ☐ | ☐ |
| Kemampuan antar sendiri | ☐ | ☐ | ☐ |
| Riwayat transaksi baik | ☐ | ☐ | ☐ |
| Punya sertifikat/izin | ☐ | ☐ | ☐ |

---

## Bagian 7: Fiksasi Fitur — Riwayat & Laporan (M-F6)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| L1 | Apakah Anda mereka p penjualan harian/bulanan? | a) Ya, rutin b) Kadang c) Tidak | Kebutuhan report |
| L2 | Laporan apa yang paling Anda butuhkan? | a) Penjualan per hari b) Penjualan per produk c) Laba kotor d) Stok tersisa e) Semua | Jenis laporan |
| L3 | Apakah Anda ingin laporan otomatis dikirim setiap hari? | a) Ya, via WA/notif b) Ya, via email c) Saya lihat di aplikasi d) Tidak perlu | Format penyampaian |
| L4 | Apakah Anda perlu data **produk terlaris** (best seller)? | a) Sangat perlu b) Lumayan c) Tidak perlu | Analisis bisnis |
| L5 | Apakah Anda perlu data **waktu transaksi tersibuk**? | a) Sangat perlu b) Lumayan c) Tidak perlu | Analisis jam sibuk |

---

## Bagian 8: Fiksasi Fitur — Manajemen Harga (M-F7)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| H1 | Bagaimana Anda menentukan harga jual saat ini? | a) Harga pasar + markup tetap b) Ikut harga toko sebelah c) Negosiasi pelanggan d) Lainnya | Strategi pricing |
| H2 | Berapa persen markup (margin) yang biasa Anda ambil? | a) <10% b) 10-20% c) 20-30% d) >30% e) Tergantung barang | Margin |
| H3 | Apakah Anda ingin sistem memberi **rekomendasi harga jual**? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi smart pricing |
| H4 | Apakah Anda ingin bisa **mengubah harga** secara massal (misal semua naik 10%)? | a) Sangat ingin b) Ingin c) Tidak perlu | Bulk price update |
| H5 | Berapa sering Anda mengubah harga jual? | a) Setiap hari b) Setiap minggu c) Setiap bulan d) Tidak tetap | Frekuensi update harga |
| H6 | Faktor apa yang memicu Anda menaikkan harga? | a) Harga beli naik b) Stok menipis c) Permintaan tinggi d) Musim hujan/evek lain | Trigger pricing |

---

## Bagian 9: Fiksasi Fitur — E-Wallet (M-F8)

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| E1 | Apakah Anda bersedia menerima **pembayaran digital** di toko? | a) Ya b) Mungkin c) Tidak | Adopsi payment digital |
| E2 | Metode pembayaran digital apa yang ingin diterima? | a) QRIS b) Transfer Bank c) E-Wallet aplikasi d) Kartu debit/kredit | Jenis payment |
| E3 | Apakah Anda bersedia menggunakan **e-wallet** aplikasi untuk transaksi stok? | a) Ya b) Mungkin c) Tidak | Adopsi e-wallet B2B |
| E4 | Apakah Anda ingin bisa **tarik tunai** dari e-wallet ke rekening bank? | a) Ya b) Tidak perlu | Withdrawal |

---

## Bagian 10: Matriks Prioritas Final — Mitra Toko

Urutkan fitur dari paling penting (1) ke kurang penting (9):

| Fitur | Ranking (1-9) |
|-------|---------------|
| Manajemen Inventaris | _ |
| Notifikasi Restock Otomatis | _ |
| POS Digital | _ |
| Katalog Online | _ |
| Pemesanan ke Petani | _ |
| Laporan Penjualan | _ |
| Manajemen Harga | _ |
| E-Wallet | _ |
| Notifikasi Pasar | _ |

---

## Bagian 11: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Perangkat apa yang tersedia di toko untuk aplikasi? | a) Smartphone saja b) Smartphone + tablet c) Komputer/laptop d) Semua |
| NF2 | OS smartphone yang digunakan? | a) Android b) iPhone |
| NF3 | Apakah koneksi internet di toko stabil? | a) Stabil (WiFi) b) Stabil (data seluler) c) Kadang putus d) Tidak stabil |
| NF4 | Apakah Anda butuh aplikasi bisa dipakai di **banyak perangkat** (HP+tablet)? | a) Ya b) Tidak |
| NF5 | Apakah Anda butuh aplikasi bisa dipakai **offline** (tanpa internet)? | a) Sangat perlu b) Lumayan c) Tidak perlu |
| NF6 | Apakah Anda butuh akses untuk **pemilik** dan **karyawan** dengan hak berbeda? | a) Sangat perlu b) Lumayan c) Tidak perlu |

---

## Bagian 12: Pertanyaan Terbuka

| No | Pertanyaan |
|----|-----------|
| O1 | Apa fitur yang paling Anda impikan untuk membantu mengelola toko sembako? |
| O2 | Apa tantangan terbesar dalam bisnis toko sembako saat ini? |
| O3 | Ceritakan pengalaman terbaik/terburuk menggunakan aplikasi toko/kasir (jika ada) |
| O4 | Jika ada satu hal yang bisa menghemat waktu Anda setiap hari, apa itu? |
| O5 | Berapa biaya berlangganan bulanan yang bersedia Anda bayar untuk aplikasi ini? |

---

## Ringkasan Keputusan Fiksasi

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Fitur prioritas kedua | |
| Fitur tidak diperlukan | |
| Metode kasir preferensi | |
| Channel notifikasi | |
| Model pembelian stok | |
| Toleransi waktu kirim | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Mitra Toko*
