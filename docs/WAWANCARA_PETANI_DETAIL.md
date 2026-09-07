# Wawancara Detail — Petani (Farmer)
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| P-F1 | Manajemen Lahan (Tambah, Edit, Hapus Lahan) | High |
| P-F2 | Manajemen Tanaman (Jenis, Masa Tanam, Riwayat) | High |
| P-F3 | Crop Check AI (Deteksi Penyakit via Foto) | Medium |
| P-F4 | Prediksi Harga & Waktu Panen (AI LSTM) | Medium |
| P-F5 | Katalog Produk & Penjualan Online | High |
| P-F6 | Pre-Order Panen (Jual Sebelum Panen) | Medium |
| P-F7 | Metode Penjualan (Direct B2C, Distribution B2B, AI Flex) | High |
| P-F8 | E-Wallet & Pembayaran Digital | High |
| P-F9 | Riwayat Transaksi & Laporan Keuangan | Medium |
| P-F10 | Notifikasi & Informasi Pasar | Medium |
| P-F11 | Peta Lahan & Geotagging | Low |
| P-F12 | Chat/Tanya dengan Pembeli | Low |

---

## Bagian 1: Fiksasi Fitur — Manajemen Lahan (P-F1)

### Pertanyaan Pilihan Ganda

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| L1 | Apakah Anda memiliki lebih dari satu lahan yang dikelola? | a) 1 lahan b) 2-3 lahan c) 4-5 lahan d) >5 lahan | Menentukan desain multi-lahan |
| L2 | Apakah lahan Anda tersebar di lokasi berbeda? | a) Satu lokasi b) 2 lokasi c) >2 lokasi | Validasi fitur geotagging per lahan |
| L3 | Data apa yang paling penting untuk dicatat tentang lahan Anda? | a) Luas lahan b) Lokasi/alamat c) Jenis tanah d) Status kepemilikan e) Sumber air f) Semua | Menentukan field wajib form lahan |
| L4 | Seberapa detail Anda ingin mencatat data lahan? | a) Sangat detail (luas, koordinat, jenis tanah, irigasi) b) Cukup (luas & lokasi) c) Sederhana (nama lahan saja) | Level kompleksitas UI |
| L5 | Apakah Anda ingin melihat visualisasi peta lahan Anda? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi peta interaktif |
| L6 | Seberapa sering Anda memperbarui data lahan? | a) Sekali input saja b) Setiap musim tanam c) Setiap tahun d) Tidak pernah diperbarui | Frekuensi interaksi fitur |

### Pertanyaan Skenario (Untuk Validasi UX)

**Skenario 1:** Anda memiliki 3 lahan di desa yang berbeda. Anda ingin menambahkan lahan baru hasil sewa. Bagaimana langkah yang Anda harapkan di aplikasi?

**Jawaban harapan:** Tombol "+" jelas → input luas, lokasi (pilih di peta/ketik), jenis tanah, sumber air → simpan.

**Skenario 2:** Anda ingin melihat riwayat tanam lahan tertentu selama setahun terakhir. Seperti apa tampilan yang Anda bayangkan?

**Jawaban harapan:** Pilih lahan → tab "Riwayat" → lihat daftar tanaman per musim (kronologis).

### Pertanyaan Preferensi UI

| No | Pertanyaan | Opsi |
|----|-----------|------|
| L7 | Mana tampilan yang lebih Anda sukai untuk daftar lahan? | a) Kartu (card) dengan foto lahan b) Daftar (list) sederhana c) Peta (map) dengan marker |
| L8 | Apakah Anda ingin informasi cuaca ditampilkan bersamaan dengan data lahan? | a) Ya, sangat berguna b) Kadang c) Tidak perlu |

---

## Bagian 2: Fiksasi Fitur — Manajemen Tanaman (P-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| T1 | Tanaman apa saja yang biasanya Anda tanam per musim? (bisa multi-pilih) | a) Padi b) Cabai c) Bawang merah d) Bawang putih e) Tomat f) Sayuran daun g) Lainnya | Daftar komoditas untuk dropdown |
| T2 | Apakah Anda menanam lebih dari satu jenis dalam satu lahan (tumpang sari)? | a) Ya b) Tidak | Validasi multi-tanaman per lahan |
| T3 | Apakah Anda mencatat siklus tanam (tanggal tanam, perawatan, panen)? | a) Ya, detail b) Ya, sekadarnya c) Tidak | Kebutuhan fitur jadwal tanam |
| T4 | Jika ya, bagaimana cara mencatatnya? | a) Buku catatan b) Kalender c) HP/notes d) Ingatan saja | Metode existing |
| T5 | Fitur apa yang paling membantu dalam manajemen tanaman? | a) Pengingat jadwal perawatan b) Catatan pertumbuhan c) Foto perkembangan tanaman d) Estimasi waktu panen e) Riwayat hasil panen | Prioritas sub-fitur |
| T6 | Apakah Anda ingin aplikasi memberikan rekomendasi pemupukan berdasarkan fase tanam? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi fitur advisory |

### Matriks Keputusan Sub-Fitur Tanaman

| Sub-Fitur | Sangat Dibutuhkan | Lumayan | Tidak Dibutuhkan |
|-----------|-------------------|---------|------------------|
| Pengingat jadwal tanam | ☐ | ☐ | ☐ |
| Pengingat jadwal pupuk | ☐ | ☐ | ☐ |
| Pengingat jadwal panen | ☐ | ☐ | ☐ |
| Catatan harian pertumbuhan | ☐ | ☐ | ☐ |
| Galeri foto tanaman per fase | ☐ | ☐ | ☐ |
| Estimasi hasil panen (kg) | ☐ | ☐ | ☐ |

---

## Bagian 3: Fiksasi Fitur — Crop Check AI (P-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| C1 | Apakah Anda pernah mengalami tanaman terserang hama/penyakit? | a) Sering b) Kadang c) Jarang d) Tidak pernah | Validasi kebutuhan |
| C2 | Bagaimana cara Anda mengidentifikasi hama/penyakit saat ini? | a) Lihat sendiri b) Tanya PPL/penyuluh c) Tanya petani lain d) Internet/Google e) Lainnya | Metode existing |
| C3 | Berapa lama waktu yang dibutuhkan untuk mendapatkan diagnosis dari penyuluh? | a) 1-2 hari b) 3-7 hari c) >1 minggu d) Tidak ada penyuluh | Validasi nilai AI crop check |
| C4 | Apakah Anda bersedia memotret tanaman yang sakit untuk dianalisis aplikasi? | a) Sangat bersedia b) Bersedia c) Tidak bersedia | Adopsi fitur |
| C5 | Jika bersedia, kapan Anda akan menggunakan fitur ini? | a) Begitu melihat gejala b) Setelah beberapa hari c) Kalau parah baru foto | Use case timing |
| C6 | Tindakan apa yang Anda harapkan setelah mendapat hasil diagnosis? | a) Rekomendasi pengobatan b) Info pestisida yang tepat c) Kontak penyuluh d) Semua | Output yang diharapkan |
| C7 | Seberapa akurat Anda berharap diagnosis AI ini? | a) 100% (pasti benar) b) 80-90% c) 50-70% d) Yang penting ada rekomendasi | Ekspektasi akurasi |
| C8 | Apakah Anda bersedia mengirim sampel fisik jika AI tidak bisa mendiagnosis? | a) Ya b) Tidak | Fallback mechanism |

### Skenario Crop Check

**Skenario:** Daun cabai Anda menguning dan ada bercak hitam. Anda memotret dan upload ke aplikasi.

**Alur yang diharapkan:**
1. Buka kamera dari aplikasi → arahkan ke daun sakit
2. AI menganalisis (loading 3-5 detik)
3. Hasil: "Penyakit: Antraknosa. Tingkat keparahan: Sedang"
4. Rekomendasi: "Semprot fungisida berbahan aktif ... setiap 7 hari"
5. Tombol: "Hubungi Penyuluh" / "Lihat Produk Pengendali"

> Pertanyaan: Apakah alur di atas sesuai dengan harapan Anda? Adakah langkah yang perlu ditambah/dikurangi?

---

## Bagian 4: Fiksasi Fitur — Prediksi Harga & Waktu Tanam AI (P-F4)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| P1 | Apakah Anda mengetahui harga pasar komoditas saat ini? | a) Tahu pasti b) Perkiraan c) Tidak tahu | Validasi kebutuhan info harga |
| P2 | Bagaimana fluktuasi harga komoditas utama Anda dalam setahun? | a) Stabil b) Naik-turun musiman c) Sangat tidak stabil d) Tidak tahu | Validasi prediksi harga |
| P3 | Apakah Anda pernah menjual saat harga sedang rendah karena terpaksa? | a) Sering b) Kadang c) Tidak pernah | Validasi nilai pre-order |
| P4 | Informasi harga seperti apa yang paling berguna? | a) Harga hari ini b) Prediksi 1 minggu c) Prediksi 1 bulan d) Prediksi musim depan | Timeframe prediksi |
| P5 | Dalam bentuk apa Anda ingin melihat prediksi harga? | a) Grafik garis (line chart) b) Angka sederhana c) Notifikasi "Harga naik/turun" d) Rekomendasi "Waktu jual terbaik" | Visualisasi preferensi |
| P6 | Apakah Anda percaya dengan prediksi harga dari AI? | a) Sangat percaya b) Percaya kalau sudah terbukti c) Tidak percaya | Trust factor |
| P7 | Apakah Anda ingin rekomendasi **waktu tanam** berdasarkan prediksi harga? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi fitur tanam recommendation |
| P8 | Faktor apa yang paling memengaruhi keputusan waktu tanam Anda? | a) Musim/hujan b) Harga pasar c) Ketersediaan air d) Ketersediaan modal e) Lainnya | Variabel keputusan |

### Pairwise Comparison — Fitur AI

Mana yang lebih penting bagi Anda?

| Pasangan | Pilihan A | Pilihan B |
|----------|-----------|-----------|
| 1 | Crop Check (deteksi penyakit) | Prediksi Harga |
| 2 | Prediksi Harga | Rekomendasi Waktu Tanam |
| 3 | Crop Check | Rekomendasi Waktu Tanam |

---

## Bagian 5: Fiksasi Fitur — Katalog Produk & Penjualan (P-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| K1 | Apakah Anda pernah menjual hasil panen secara online? | a) Ya b) Tidak | Pengalaman existing |
| K2 | Jika pernah, platform apa? | a) Facebook/Instagram b) WhatsApp c) Marketplace (Shopee/Tokopedia) d) Lainnya | Benchmark |
| K3 | Kesulitan apa yang Anda alami saat menjual online? | a) Foto produk b) Menentukan harga c) Mengurus pengiriman d) Pembeli tidak percaya e) Lainnya | Pain point |
| K4 | Data apa yang ingin Anda tampilkan di katalog produk? | a) Foto produk b) Harga c) Berat/volume d) Asal lahan e) Tanggal panen f) Sertifikat/gred | Field katalog |
| K5 | Apakah Anda bersedia difoto bersama produk Anda? | a) Ya b) Tidak | Kepercayaan pembeli |
| K6 | Bagaimana Anda ingin menentukan harga jual? | a) Saya tentukan sendiri b) Rekomendasi dari sistem c) Ikut harga pasar d) Lelang / bidding | Mekanisme pricing |
| K7 | Apakah Anda ingin fitur **tawar-menawar** harga? | a) Ya b) Tidak | Negosiasi |
| K8 | Dalam satuan apa Anda biasa menjual hasil panen? | a) Kilogram b) Karung c) Ikat d) Lainnya | Unit penjualan |
| K9 | Berapa minimal pembelian yang Anda inginkan? | a) Berapa saja b) Minimal 1 kg c) Minimal 5 kg d) Minimal 1 karung e) Lainnya | Minimum order quantity |
| K10 | Apakah Anda bisa memenuhi pesanan dalam jumlah besar (≥50 kg) secara konsisten? | a) Ya b) Tergantung musim c) Tidak | Validasi B2B |

### Skenario Katalog

**Skenario:** Anda baru panen cabai 100 kg. Anda ingin menjualnya di aplikasi.

**Langkah yang diharapkan:**
1. Buka "Tambah Produk"
2. Upload foto cabai (bisa langsung foto dari HP)
3. Isi: Nama produk, Kategori (Cabai), Harga/kg, Stok (100 kg), Asal lahan, Tanggal panen
4. Pilih metode penjualan: Langsung / Distribusi / AI Flex
5. Publikasi

> Pertanyaan: Apakah ada langkah yang kurang? Berapa lama waktu yang Anda perkirakan untuk menyelesaikan proses ini?

---

## Bagian 6: Fiksasi Fitur — Pre-Order Panen (P-F6)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| PO1 | Apakah Anda pernah menjual hasil panen **sebelum** panen? (ijon/grojokan) | a) Sering b) Pernah c) Tidak pernah | Familiaritas konsep |
| PO2 | Jika pernah, apakah harga yang didapat lebih baik? | a) Lebih baik b) Sama saja c) Lebih rendah d) Tidak tahu | Evaluasi sistem ijon |
| PO3 | Apakah Anda tertarik menjual hasil panen dengan sistem pre-order (dibeli sebelum panen, harga lebih baik)? | a) Sangat tertarik b) Tertarik c) Kurang d) Tidak | Kebutuhan pre-order |
| PO4 | Berapa lama sebelum panen Anda bersedia menerima pre-order? | a) Saat tanam b) 1 bulan sebelum panen c) 2 minggu sebelum d) 1 minggu sebelum | Timeline pre-order |
| PO5 | Berapa persen dari hasil panen yang bersedia Anda pre-order-kan? | a) 100% b) 50-75% c) 25-50% d) <25% | Volume pre-order |
| PO6 | Jika pembeli pre-order tapi gagal bayar, bagaimana sikap Anda? | a) Jual ke pembeli lain b) Minta dp/denda c) Lainnya | Mekanisme mitigasi |
| PO7 | Apakah Anda bersedia memberikan diskon untuk pre-order? | a) Ya, 5-10% b) Ya, 10-25% c) Tidak d) Tergantung harga pasar | Insentif pre-order |

---

## Bagian 7: Fiksasi Fitur — Metode Penjualan (P-F7)

Sistem punya 3 metode penjualan. Mari kita validasi:

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| M1 | Metode penjualan mana yang paling sesuai untuk Anda? | a) **Langsung (B2C)** — jual langsung ke konsumen b) **Distribusi (B2B)** — jual dalam jumlah besar ke toko mitra c) **AI Fleksibel** — sistem yang atur distribusinya d) Kombinasi semua | Preferensi metode |
| M2 | Jika memilih Distribusi B2B, berapa minimal volume yang Anda inginkan per pengiriman? | a) 10-25 kg b) 25-50 kg c) 50-100 kg d) >100 kg | Parameter B2B |
| M3 | Apakah Anda bersedia sistem AI yang menentukan ke mana produk Anda didistribusikan? (AI Flex) | a) Ya, percaya sistem b) Mungkin, dengan pengawasan c) Tidak, saya ingin kontrol penuh | Trust in AI allocation |
| M4 | Jika AI Flex, faktor apa yang paling penting dalam alokasi? | a) Harga terbaik b) Jarak terdekat c) Pembeli tetap d) Pembeli baru | Prioritas alokasi |

---

## Bagian 8: Fiksasi Fitur — E-Wallet & Pembayaran (P-F8)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| W1 | Apakah Anda memiliki rekening bank? | a) Ya b) Tidak | Kesiapan perbankan |
| W2 | Apakah Anda menggunakan mobile banking / e-wallet (GoPay, OVO, Dana, dll)? | a) Ya, aktif b) Punya tapi jarang c) Tidak punya | Literasi keuangan digital |
| W3 | Bagaimana cara Anda menerima pembayaran hasil panen saat ini? | a) Tunai b) Transfer bank c) e-Wallet d) Lainnya | Payment existing |
| W4 | Apakah Anda bersedia menerima pembayaran melalui e-wallet aplikasi? | a) Sangat bersedia b) Bersedia c) Tidak bersedia | Adopsi e-wallet |
| W5 | Jika tidak bersedia, apa alasannya? | a) Tidak paham b) Tidak ada HP c) Tidak percaya d) Lebih suka tunai | Hambatan |
| W6 | Fitur e-wallet apa yang Anda butuhkan? | a) Tarik tunai ke bank b) Beli pulsa/paket data c) Bayar di toko mitra d) Transfer ke sesama petani e) Semua | Scope fitur e-wallet |
| W7 | Apakah Anda ingin menerima **notifikasi** setiap ada transaksi masuk/keluar? | a) Ya, real-time b) Ya, rekap harian c) Tidak perlu | Frekuensi notifikasi |
| W8 | Berapa saldo maksimal yang nyaman Anda simpan di e-wallet? | a) <Rp100rb b) Rp100-500rb c) Rp500rb-1jt d) >Rp1jt e) Tidak ada batasan | Batas saldo |

### Skenario E-Wallet

**Skenario:** Anda menjual cabai 50kg @Rp20.000 = Rp1.000.000. Pembeli transfer ke e-wallet Anda.

**Alur yang diharapkan:**
1. Notifikasi: "Pembayaran Rp1.000.000 diterima dari Pembeli A"
2. Saldo e-wallet bertambah
3. Opsi: Tarik saldo ke bank (1-2 hari) / Beli pulsa / Bayar di toko mitra
4. Riwayat transaksi tercatat otomatis

> Pertanyaan: Apakah alur ini cukup? Berapa lama tarik saldo ke bank yang ideal?

---

## Bagian 9: Fiksasi Fitur — Riwayat & Laporan (P-F9)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| R1 | Apakah Anda mencatat pemasukan dan pengeluaran usaha tani? | a) Ya, detail b) Ya, sekadarnya c) Tidak | Kebutuhan pembukuan |
| R2 | Jika ya, bagaimana cara mencatatnya? | a) Buku kas b) Excel c) Aplikasi d) Lainnya | Metode existing |
| R3 | Laporan apa yang paling Anda butuhkan? | a) Pemasukan per bulan b) Pengeluaran per musim c) Laba/rugi per komoditas d) Semua | Jenis laporan |
| R4 | Apakah Anda ingin laporan keuangan otomatis dari aktivitas jual-beli di aplikasi? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi auto-report |
| R5 | Apakah Anda bersedia membagikan data transaksi untuk analisis pasar (anonim)? | a) Ya b) Tidak | Data sharing consent |
| R6 | Format laporan seperti apa yang diinginkan? | a) Tampilan di aplikasi b) PDF c) Excel d) Semua | Format output |

---

## Bagian 10: Fiksasi Fitur — Notifikasi & Informasi Pasar (P-F10)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| N1 | Informasi apa yang ingin Anda terima melalui notifikasi? | a) Harga pasar harian b) Ada pesanan masuk c) Pembayaran diterima d) Tips bertani e) Peringatan cuaca f) Semua | Jenis notifikasi |
| N2 | Kapan Anda ingin menerima notifikasi? | a) Pagi hari (06:00-08:00) b) Siang c) Sore d) Real-time setiap ada kejadian | Waktu notifikasi |
| N3 | Apakah Anda ingin menerima **info cuaca** terkait wilayah Anda? | a) Ya, sangat penting b) Lumayan c) Tidak perlu | Validasi weather info |
| N4 | Apakah Anda ingin menerima **artikel/budidaya** dari penyuluh? | a) Ya b) Tidak | Validasi content |
| N5 | Media apa yang paling nyaman untuk menerima informasi? | a) Notifikasi aplikasi b) WhatsApp c) SMS d) Email | Channel preferensi |

---

## Bagian 11: Matriks Prioritas Final — Petani

Urutkan fitur berikut dari yang paling penting (1) ke yang paling tidak penting (11):

| Fitur | Ranking (1-11) |
|-------|----------------|
| Manajemen Lahan | _ |
| Manajemen Tanaman | _ |
| Crop Check AI (deteksi penyakit) | _ |
| Prediksi Harga AI | _ |
| Katalog Produk Online | _ |
| Pre-Order Panen | _ |
| Metode Penjualan (B2C/B2B/AI) | _ |
| E-Wallet | _ |
| Riwayat & Laporan | _ |
| Notifikasi Informasi Pasar | _ |
| Informasi Cuaca | _ |

---

## Bagian 12: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Bahasa apa yang paling nyaman untuk aplikasi? | a) Indonesia b) Bahasa daerah (Sunda/Jawa/dll) c) Campuran |
| NF2 | Ukuran huruf (font) seperti apa yang nyaman? | a) Besar b) Sedang c) Kecil (biasa) |
| NF3 | Apakah Anda lebih suka input **suara** (voice) daripada ngetik? | a) Ya b) Kadang c) Tidak |
| NF4 | Apakah Anda butuh panduan video/bantuan di dalam aplikasi? | a) Sangat perlu b) Lumayan c) Tidak perlu |
| NF5 | Berapa lama Anda sabar menunggu aplikasi merespons? | a) <5 detik b) 5-10 detik c) >10 detik juga tidak apa-apa |
| NF6 | Apakah aplikasi perlu bisa diakses dari HP **tanpa kuota** (mode offline)? | a) Sangat perlu b) Lumayan c) Tidak perlu |

---

## Bagian 13: Pertanyaan Terbuka — Eksplorasi

| No | Pertanyaan |
|----|-----------|
| O1 | Jika aplikasi ini bisa menjadi "asisten pribadi" untuk usaha tani Anda, apa saja yang harus bisa dilakukan? |
| O2 | Apa yang membuat Anda tetap mau menggunakan aplikasi ini dalam jangka panjang? |
| O3 | Ceritakan pengalaman terbaik dan terburuk Anda menggunakan aplikasi pertanian sebelumnya (jika ada) |
| O4 | Jika ada satu hal yang bisa Anda ubah dari rantai distribusi sembako saat ini, apa itu? |
| O5 | Berapa harga langganan bulanan yang bersedia Anda bayar untuk aplikasi ini? (dalam Rp) |

---

## Ringkasan Keputusan Fiksasi

Setelah wawancara, isi ringkasan berikut:

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Fitur prioritas kedua | |
| Fitur tidak diperlukan | |
| UI/UX preferensi | |
| Bahasa preferensi | |
| Model pricing | |
| Hambatan adopsi | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Petani*
