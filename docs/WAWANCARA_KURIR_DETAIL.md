# Wawancara Detail — Kurir (Courier)
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| K-F1 | Job Marketplace (Lihat & Ambil Order) | High |
| K-F2 | Route Optimizer AI (Optimasi Rute RL) | High |
| K-F3 | Scan QR untuk Konfirmasi Pengiriman | High |
| K-F4 | Tracking Pengiriman Real-Time | Medium |
| K-F5 | Riwayat Penghasilan & Laporan | Medium |
| K-F6 | Profil Kurir (Kendaraan, Wilayah) | Low |
| K-F7 | Notifikasi Order & Status | Medium |
| K-F8 | Rating & Penilaian | Low |

---

## Bagian 1: Profil Kurir & Konteks Pekerjaan

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| P1 | Bagaimana status pekerjaan Anda? | a) Kurir full-time b) Kurir paruh waktu c) Pekerja lepas (freelance) d) Lainnya | Profil pekerjaan |
| P2 | Platform apa yang saat ini/sedang Anda gunakan untuk mencari order? | a) Gojek b) Grab c) Shopee Express d) Lalamove e) Mandiri cari sendiri f) Lainnya | Benchmark |
| P3 | Jenis kendaraan yang digunakan untuk mengantar? | a) Sepeda motor b) Mobil c) Sepeda d) Lainnya | Tipe kendaraan |
| P4 | Kapasitas maksimal muatan kendaraan? | a) <10 kg b) 10-25 kg c) 25-50 kg d) >50 kg | Kapasitas angkut |
| P5 | Wilayah operasi utama Anda? | a) Satu kecamatan b) Satu kota c) Antarkota d) Sesuai order | Cakupan wilayah |
| P6 | Berapa jam Anda bekerja per hari? | a) <4 jam b) 4-8 jam c) 8-12 jam d) >12 jam | Jam kerja |
| P7 | Berapa penghasilan bersih rata-rata per hari? | a) <Rp50rb b) Rp50-100rb c) Rp100-200rb d) Rp200-500rb e) >Rp500rb | Target penghasilan |
| P8 | Apakah penghasilan saat ini sudah cukup? | a) Lebih dari cukup b) Cukup c) Kurang d) Sangat kurang | Kepuasan pendapatan |

---

## Bagian 2: Fiksasi Fitur — Job Marketplace (K-F1)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| J1 | Bagaimana Anda mendapatkan order pengiriman saat ini? | a) Aplikasi (Gojek/Grab) b) Langganan tetap c) Pesan langsung WA d) Datang ke pasar/toko | Metode existing |
| J2 | Apakah Anda ingin melihat **daftar order** yang tersedia dan memilih sendiri? | a) Sangat ingin b) Ingin c) Tidak, lebih suka langsung ditugaskan | Mekanisme job board |
| J3 | Informasi apa yang paling penting saat memilih order? | a) Jarak tempuh b) Upah (fee) c) Berat barang d) Lokasi ambil & antar e) Jenis barang f) Semua | Detail order |
| J4 | Apakah Anda bersedia **bidding** (menawar upah) untuk order? | a) Ya b) Mungkin c) Tidak, harus tetap | Mekanisme pricing |
| J5 | Berapa upah minimum yang Anda harapkan per pengiriman (dalam radius 5km)? | a) Rp5-10rb b) Rp10-15rb c) Rp15-20rb d) Rp20-30rb e) >Rp30rb | Tarif dasar |
| J6 | Berapa upah tambahan per km yang wajar? | a) Rp1-2rb/km b) Rp2-3rb/km c) Rp3-5rb/km d) >Rp5rb/km | Tarif per km |
| J7 | Apakah Anda bersedia mengambil **beberapa order** dalam satu perjalanan (multi-drop)? | a) Ya, jika rute searah b) Ya, asal upah ditambah c) Tidak, satu-satu | Multi-order preference |
| J8 | Berapa maksimal jarak yang Anda tempuh untuk satu order? | a) <5 km b) 5-10 km c) 10-20 km d) >20 km | Jarak maksimal |
| J9 | Apakah Anda mau mengantar **sembako** (barang berat/banyak)? | a) Ya, tidak masalah b) Ya, asal upah sesuai c) Tidak, terlalu berat | Kesiapan barang berat |

### Skenario Job Marketplace

**Skenario:** Jam 08:00, Anda membuka aplikasi dan melihat daftar order tersedia:

| Order | Asal → Tujuan | Jarak | Upah | Berat |
|-------|--------------|-------|------|-------|
| #101 | Toko Segar → Jl. Merdeka No.5 | 3 km | Rp12.000 | 5 kg |
| #102 | Petani Budi → Toko Segar | 8 km | Rp20.000 | 25 kg |
| #103 | Pasar Induk → Jl. Diponegoro 10 | 5 km | Rp15.000 | 10 kg |
| #104 | Toko Segar → Perumahan Griya | 2 km | Rp8.000 | 3 kg |

**Tugas:** Order mana yang akan Anda ambil? Mengapa?

**Fitur yang diharapkan:**
- Tampilan: Peta + daftar (dual view)
- Filter: Jarak, upah minimal, berat
- Tombol "Ambil" untuk mengklaim order
- Waktu klaim terbatas (misal 60 detik)

> Pertanyaan: Apakah fitur-fitur di atas sesuai? Adakah yang kurang?

---

## Bagian 3: Fiksasi Fitur — Route Optimizer AI (K-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| O1 | Bagaimana Anda menentukan rute pengiriman saat ini? | a) Hafalan/pengalaman b) Google Maps c) Tanya orang d) Petunjuk pelanggan | Metode existing |
| O2 | Apakah Anda sering mengalami **jalan buntu / salah arah**? | a) Sering b) Kadang c) Jarang d) Tidak pernah | Pain point rute |
| O3 | Apakah Anda ingin aplikasi memberi **rekomendasi rute tercepat**? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi route optimizer |
| O4 | Faktor apa yang paling penting dalam penentuan rute? | a) Waktu tempuh tercepat b) Jarak terpendek c) Hindari macet d) Hindari jalan rusak e) Banyak order dalam 1 rute | Prioritas routing |
| O5 | Apakah Anda bersedia aplikasi mengatur **urutan pengiriman** untuk multi-order? | a) Ya, ikut sistem b) Saya ingin atur urutan sendiri c) Tidak mengambil multi-order | Mekanisme sequencing |
| O6 | Apakah Anda percaya rute yang direkomendasikan AI? | a) Sangat percaya b) Percaya jika terbukti c) Akan tetap pakai Google Maps | Trust factor |

### Matriks Fitur Navigasi

| Sub-Fitur | Sangat Dibutuhkan | Lumayan | Tidak Dibutuhkan |
|-----------|-------------------|---------|------------------|
| Rekomendasi rute tercepat | ☐ | ☐ | ☐ |
| Informasi macet real-time | ☐ | ☐ | ☐ |
| Informasi jalan rusak/tutup | ☐ | ☐ | ☐ |
| Navigasi langkah demi langkah | ☐ | ☐ | ☐ |
| Multi-drop routing | ☐ | ☐ | ☐ |
| Estimasi waktu tiba (ETA) | ☐ | ☐ | ☐ |
| Notifikasi jika keluar rute | ☐ | ☐ | ☐ |

---

## Bagian 4: Fiksasi Fitur — Scan QR Konfirmasi (K-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| Q1 | Apakah Anda pernah menggunakan scan QR untuk konfirmasi pengiriman? | a) Ya b) Tidak | Familiaritas |
| Q2 | Jika ya, di platform apa? | a) Gojek b) Grab c) Shopee d) Lainnya | Benchmark |
| Q3 | Apakah metode scan QR menurut Anda efektif? | a) Sangat efektif b) Efektif c) Kurang efektif | Validasi |
| Q4 | Apakah Anda khawatir jika **QR tidak bisa di-scan** (rusak, aplikasi error)? | a) Khawatir b) Biasa saja c) Tidak khawatir | Pain point teknis |
| Q5 | Cara alternatif apa yang diinginkan jika QR gagal di-scan? | a) Kode manual (input angka) b) Konfirmasi via chat c) PIN dari pembeli d) Lainnya | Fallback mechanism |
| Q6 | Pada titik mana konfirmasi pengiriman dilakukan? | a) Saat ambil barang (pick-up) b) Saat sampai tujuan (delivery) c) Keduanya | Titik konfirmasi |

### Skenario Scan QR

**Skenario 1 — Ambil Barang:**
Anda sampai di Toko Segar, tunjukkan QR pick-up → pemilik toko scan → status: "Barang diambil" → Anda bisa berangkat.

**Skenario 2 — Antar Barang:**
Anda sampai di rumah pembeli → pembeli scan QR delivery → status: "Terkirim" → upah masuk ke e-wallet.

> Pertanyaan: Apakah ada skenario lain yang perlu diakomodasi? (misal: barang ditaruh di tempat tertentu, penerima tidak ada di tempat)

---

## Bagian 5: Fiksasi Fitur — Tracking Real-Time (K-F4)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| T1 | Apakah Anda bersedia lokasi Anda dilacak real-time oleh pembeli & pemilik toko? | a) Ya b) Ya, hanya saat delivery c) Tidak | Privasi lokasi |
| T2 | Apakah Anda ingin fitur **share location** via WhatsApp? | a) Ya, lebih praktis b) Tidak, cukup di aplikasi | Sharing preferensi |
| T3 | Apakah Anda ingin pembeli bisa menghubungi Anda langsung? | a) Ya, via chat aplikasi b) Ya, via telepon (anonim) c) Tidak, lewat support d) Lainnya | Komunikasi pembeli |
| T4 | Berapa akurat estimasi waktu tiba yang realistis menurut Anda? | a) Akurat ±5 menit b) ±15 menit c) ±30 menit | Toleransi ETA |

---

## Bagian 6: Fiksasi Fitur — Riwayat & Laporan Penghasilan (K-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| R1 | Apakah Anda mencatat penghasilan harian? | a) Ya, detail b) Ya, perkiraan c) Tidak | Kebutuhan report |
| R2 | Laporan apa yang Anda inginkan? | a) Penghasilan harian b) Penghasilan mingguan c) Penghasilan per rute d) Total jarak tempuh e) Semua | Jenis laporan |
| R3 | Apakah Anda ingin rekap **pengeluaran** (bensin, dll)? | a) Sangat ingin b) Ingin c) Tidak perlu | Expense tracking |
| R4 | Dalam bentuk apa laporan diinginkan? | a) Di aplikasi b) PDF c) Dikirim mingguan via WA | Format |

---

## Bagian 7: Fiksasi Fitur — Notifikasi (K-F7)

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| N1 | Notifikasi apa yang paling penting? | a) Ada order baru b) Order diambil orang lain c) Pembayaran diterima d) Rating dari pelanggan e) Semua | Prioritas notif |
| N2 | Kapan Anda tidak ingin diganggu notifikasi? | a) Malam hari (22:00-05:00) b) Saat mengendarai c) Tidak ada waktu luang | Do not disturb |
| N3 | Apakah Anda ingin notifikasi **suara** untuk order baru? | a) Ya b) Tidak | Alert |

---

## Bagian 8: Fiksasi Fitur — Rating & Penilaian (K-F8)

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| R1 | Apakah Anda ingin pembeli bisa memberi rating pada Anda? | a) Ya, fair b) Ya, tapi khawatir rating jelek c) Tidak | Validasi rating |
| R2 | Apakah Anda ingin bisa memberi rating ke pembeli? | a) Ya b) Tidak | Two-way rating |
| R3 | Apakah Anda ingin melihat rating Anda? | a) Ya, real-time b) Ya, rekap c) Tidak perlu | Visibilitas rating |

---

## Bagian 9: Fiksasi — Skenario End-to-End

### Skenario Lengkap — Sehari Jadi Kurir Sembako

**Waktu:** 06:00 — Anda bangun dan siap bekerja.

1. **06:30** — Buka aplikasi → cek order tersedia di sekitar rumah
2. **07:00** — Ambil order: Ambil beras 20kg dari Petani Budi → antar ke Toko Segar (upah Rp18.000, jarak 7km)
3. **07:15** — Aplikasi tunjukkan rute tercepat ke Petani Budi (hindari macet)
4. **07:45** — Sampai di Petani Budi → scan QR pick-up → muat beras
5. **08:15** — Sampai di Toko Segar → scan QR delivery → upah masuk e-wallet
6. **08:20** — Notifikasi order baru: 3 order tersedia, ambil yang paling sesuai
7. **08:25** — Ambil 2 order yang searah: Toko Segar → Pembeli A & Pembeli B (multi-drop)
8. **08:30** — Aplikasi atur rute: Toko Segar → Pembeli A (3km) → Pembeli B (2km)
9. **09:15** — Selesai 2 order → total upah Rp32.000
10. **18:00** — Selesai kerja → cek laporan harian: 12 order, total upah Rp180.000, jarak tempuh 65km

> **Pertanyaan:** Apakah skenario di atas realistis dengan kebiasaan kerja Anda? Adakah bagian yang perlu disesuaikan?

---

## Bagian 10: Matriks Prioritas Final — Kurir

Urutkan fitur dari paling penting (1) ke kurang penting (8):

| Fitur | Ranking (1-8) |
|-------|---------------|
| Job Marketplace | _ |
| Route Optimizer AI | _ |
| Scan QR Konfirmasi | _ |
| Tracking Real-Time | _ |
| Riwayat Penghasilan | _ |
| Profil Kurir | _ |
| Notifikasi Order | _ |
| Rating & Penilaian | _ |

---

## Bagian 11: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Apakah koneksi internet di area operasi stabil? | a) Stabil b) Kadang tidak stabil c) Sering putus |
| NF2 | Apakah aplikasi perlu **mode offline** untuk navigasi? | a) Sangat perlu b) Lumayan c) Tidak perlu |
| NF3 | Berapa ukuran aplikasi maksimal yang nyaman di HP? | a) <50 MB b) 50-100 MB c) >100 MB juga ok |
| NF4 | Apakah Anda butuh aplikasi tetap berjalan di **latar belakang** (background)? | a) Ya, penting untuk tracking b) Tidak masalah |
| NF5 | Berapa lama baterai HP Anda bertahan saat aktif berkendara? | a) <4 jam b) 4-8 jam c) >8 jam | 

---

## Bagian 12: Pertanyaan Terbuka

| No | Pertanyaan |
|----|-----------|
| O1 | Apa keluhan terbesar Anda sebagai kurir selama ini? |
| O2 | Apa fitur yang paling Anda inginkan dari aplikasi kurir sembako? |
| O3 | Jika bisa memilih, seperti apa sistem upah yang ideal? |
| O4 | Apa yang membuat Anda setia menggunakan aplikasi ini (loyalty factor)? |
| O5 | Ceritakan pengalaman terburuk saat delivery (macet, hujan, alamat sulit, dll) |
| O6 | Berapa persen potongan/platform fee yang wajar menurut Anda? |

---

## Ringkasan Keputusan Fiksasi

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Mekanisme ambil order | |
| Tarif per km | |
| Metode navigasi | |
| Mekanisme konfirmasi | |
| Privasi lokasi | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Kurir*
