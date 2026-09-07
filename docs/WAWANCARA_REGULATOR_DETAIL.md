# Wawancara Detail — Regulator (Pemerintah / Bank Indonesia)
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| R-F1 | Dashboard Inflasi Real-Time | High |
| R-F2 | Heatmap Stok Berbasis Peta | High |
| R-F3 | Prediksi Harga (AI LSTM) | Medium |
| R-F4 | Tools Intervensi Pasar | Medium |
| R-F5 | Data Lapangan Kerja (Employment) | Low |
| R-F6 | Laporan Otomatis (Generate PDF/Excel) | High |
| R-F7 | Manajemen Intervensi (Subsidi, OP) | Medium |
| R-F8 | Monitoring Distribusi Logistik | Medium |

---

## Bagian 1: Profil Instansi & Tupoksi

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| P1 | Instansi Anda saat ini? | a) Bank Indonesia b) Dinas Ketahanan Pangan c) BPS d) Bappeda e) Kementerian Pertanian f) Lainnya | Profil instansi |
| P2 | Level instansi? | a) Pusat/ Nasional b) Provinsi c) Kabupaten/Kota d) Kecamatan | Tingkat wilayah |
| P3 | Apa tugas pokok Anda terkait pangan? | a) Monitoring harga b) Pengendalian inflasi c) Distribusi pangan d) Stabilitas pasokan e) Lainnya | Tupoksi |
| P4 | Berapa jumlah staf di unit Anda yang menangani data pangan? | a) <3 orang b) 3-5 orang c) 5-10 orang d) >10 orang | Kapasitas SDM |
| P5 | Apakah saat ini sudah menggunakan sistem informasi pangan? | a) Ya, sebutkan: ___ b)Ya, tapi kurang optimal c) Belum, masih manual | Existing system |

---

## Bagian 2: Fiksasi Fitur — Dashboard Inflasi Real-Time (R-F1)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| D1 | Komoditas apa yang perlu dipantau harganya secara real-time? | a) Beras b) Cabai c) Bawang merah d) Bawang putih e) Minyak goreng f) Gula g) Telur h) Daging ayam i) Semua | Daftar komoditas |
| D2 | Level agregasi data harga yang dibutuhkan? | a) Nasional b) Provinsi c) Kabupaten/Kota d) Kecamatan e) Pasar spesifik | Level granularitas |
| D3 | Apakah Anda perlu perbandingan harga **antarkota**? | a) Sangat perlu b) Perlu c) Tidak perlu | Cross-region |
| D4 | Metode visualisasi apa yang paling efektif? | a) Grafik garis (time series) b) Tabel angka c) Peta warna (choropleth) d) Indikator naik/turun (traffic light) | Preferensi visual |
| D5 | Apakah Anda ingin **notifikasi lonjakan harga**? | a) Sangat ingin, real-time b) Ingin, rekap harian c) Tidak perlu | Alert system |
| D6 | Ambang batas kenaikan harga yang perlu di-notifikasi? | a) >5% dalam sehari b) >10% dalam sehari c) >20% dalam seminggu d) Lainnya | Threshold alert |
| D7 | Apakah Anda perlu data **harga di level petani** (harga pokok)? | a) Sangat perlu b) Perlu c) Tidak perlu | Harga produsen |
| D8 | Apakah Anda perlu data **harga di level konsumen**? | a) Sangat perlu b) Perlu c) Tidak perlu | Harga konsumen |

### Skenario Dashboard

**Skenario:** Anda sebagai regulator ingin memantau situasi harga pangan hari ini.

**Tampilan yang diharapkan:**
1. Halaman utama: Ringkasan 9 bahan pokok — tampilkan harga hari ini, perubahan dari kemarin (%),
   dan status (🟢 Stabil / 🟡 Waspada / 🔴 Kritis)
2. Klik komoditas "Cabai" → lihat grafik harga 30 hari terakhir
3. Pilih filter: Provinsi Jawa Barat → lihat harga per kota
4. Notifikasi: "Bawang putih naik 12% di Bandung dalam 3 hari terakhir"
5. Export data: Download CSV/PDF

> Pertanyaan: Apakah tampilan di atas sesuai? Adakah metrik lain yang perlu ditampilkan?

---

## Bagian 3: Fiksasi Fitur — Heatmap Stok (R-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| H1 | Apakah Anda memiliki data stok pangan real-time saat ini? | a) Ya b) Tidak c) Periodik (bulanan) | Data existing |
| H2 | Jika tidak, bagaimana cara mendapatkannya? | a) Laporan dari dinas b) Survey langsung c) Data platform swasta d) Lainnya | Alternatif sumber |
| H3 | Data stok pada level apa yang dibutuhkan? | a) Gudang distributor b) Toko/retail c) Lahan petani d) Semua | Level stok |
| H4 | Visualisasi heatmap seperti apa yang diinginkan? | a) Peta titik (marker per lokasi) b) Peta area (warna per kecamatan) c) Tabel daftar stok per wilayah | Tipe heatmap |
| H5 | Apakah Anda perlu filter komoditas di heatmap? | a) Ya, pilih komoditas b) Ya, multi-pilih c) Tidak perlu | Filter komoditas |
| H6 | Apakah Anda perlu data **pasokan** (produksi + stok masuk) selain stok? | a) Sangat perlu b) Perlu c) Tidak perlu | Supply data |

---

## Bagian 4: Fiksasi Fitur — Prediksi Harga AI LSTM (R-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| V1 | Apakah Anda menggunakan **prediksi harga** saat ini untuk kebijakan? | a) Ya b) Tidak, hanya data historis | Kebutuhan prediksi |
| V2 | Jika ya, bagaimana cara memperolehnya? | a) Model sendiri b) Tim riset c) Konsultan d) Lainnya | Metode existing |
| V3 | Timeframe prediksi apa yang paling berguna? | a) 7 hari ke depan b) 30 hari (1 bulan) c) 90 hari (1 musim) d) 1 tahun | Horizon prediksi |
| V4 | Seberapa akurat prediksi yang diharapkan? | a) ±5% b) ±10% c) ±20% d) Yang penting trennya benar | Ekspektasi akurasi |
| V5 | Apakah Anda ingin prediksi dalam bentuk **skenario** (optimis, moderat, pesimis)? | a) Sangat ingin b) Ingin c) Cukup angka tunggal | Skenario |
| V6 | Apakah Anda ingin prediksi **dampak kebijakan** (simulasi)? | a) Sangat ingin b) Ingin c) Tidak perlu | Policy simulation |

---

## Bagian 5: Fiksasi Fitur — Tools Intervensi Pasar (R-F4, R-F7)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| I1 | Jenis intervensi apa yang biasa dilakukan instansi Anda? | a) Operasi pasar (jual murah) b) Subsidi distribusi c) Bantuan langsung d) Impor/ekspor e) Lainnya | Tipe intervensi |
| I2 | Bagaimana proses pengambilan keputusan intervensi saat ini? | a) Rapat koordinasi b) Data masuk → analisis → keputusan c) Instruksi dari atasan d) Lainnya | Decision process |
| I3 | Data apa yang menjadi trigger intervensi? | a) Harga > HET b) Kenaikan harga > threshold c) Stok menipis d) Laporan bencana/ gagal panen e) Lainnya | Trigger intervensi |
| I4 | Apakah Anda ingin sistem memberikan **rekomendasi intervensi**? | a) Sangat ingin b) Ingin c) Tidak perlu | AI recommendation |
| I5 | Jika ya, rekomendasi seperti apa? | a) "Operasi pasar cabai di Bandung" b) "Subsidi distribusi beras ke 5 kecamatan" c) "Lokasi intervensi prioritas" d) Semua | Bentuk rekomendasi |
| I6 | Apakah Anda ingin **tracking realisasi intervensi**? | a) Sangat ingin b) Ingin c) Tidak perlu | Monitoring intervensi |
| I7 | Apakah Anda ingin **laporan dampak intervensi**? | a) Sangat ingin, otomatis b) Ingin c) Tidak perlu | Impact analysis |
| I8 | Fitur intervensi apa yang paling prioritas? | a) Rekomendasi lokasi intervensi b) Monitoring realisasi c) Laporan dampak d) Semua | Prioritas sub-fitur |

---

## Bagian 6: Fiksasi Fitur — Data Lapangan Kerja (R-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| J1 | Apakah instansi Anda melacak data lapangan kerja sektor pangan? | a) Ya b) Tidak | Kebutuhan existing |
| J2 | Data apa yang ingin dilihat? | a) Jumlah petani terdaftar b) Jumlah kurir aktif c) Jumlah toko mitra d) Jumlah enumerator e) Pertumbuhan (trend) | Jenis data |
| J3 | Level agregasi data lapangan kerja? | a) Total platform b) Per wilayah c) Per komoditas d) Semua | Level data |
| J4 | Apakah Anda perlu data **demografi** (usia, pendidikan) tenaga kerja? | a) Sangat perlu b) Perlu c) Tidak perlu | Demografi tenaga kerja |

---

## Bagian 7: Fiksasi Fitur — Laporan Otomatis (R-F6)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| L1 | Laporan apa yang rutin Anda buat? | a) Laporan harga harian b) Laporan inflasi bulanan c) Laporan stok mingguan d) Laporan intervensi e) Laporan tahunan | Jenis laporan |
| L2 | Format laporan yang dibutuhkan? | a) PDF (narasi + tabel) b) Excel/CSV (data mentah) c) Dashboard link d) Semua | Format output |
| L3 | Apakah Anda ingin **scheduling** laporan otomatis (dikirim setiap hari jam 08:00)? | a) Sangat ingin b) Ingin c) Tidak perlu | Otomatisasi |
| L4 | Via apa laporan dikirim? | a) Email b) WhatsApp c) Aplikasi d) Semua | Channel |
| L5 | Apakah Anda ingin **custom template** laporan? | a) Ya, template bisa diatur b) Cukup template default | Kustomisasi |
| L6 | Periode laporan standar yang digunakan? | a) Harian b) Mingguan c) Bulanan (Month-to-Date) d) Triwulan e) Tahunan (Year-to-Date) | Siklus pelaporan |

---

## Bagian 8: Fiksasi Fitur — Monitoring Distribusi Logistik (R-F8)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| G1 | Apakah Anda perlu data **arus distribusi** (dari petani → ke mana)? | a) Sangat perlu b) Perlu c) Tidak perlu | Tracking distribusi |
| G2 | Data logistik apa yang dibutuhkan? | a) Volume barang dikirim b) Asal & tujuan c) Waktu tempuh d) Biaya logistik e) Semua | Jenis data logistik |
| G3 | Apakah Anda perlu data **hambatan logistik** (macet, banjir, rusak)? | a) Sangat perlu b) Perlu c) Tidak perlu | Hambatan distribusi |

---

## Bagian 9: Matriks Prioritas Sub-Fitur Regulator

| Sub-Fitur | Sangat Dibutuhkan | Dibutuhkan | Tidak Dibutuhkan |
|-----------|-------------------|-----------|------------------|
| Harga harian 9 bahan pokok | ☐ | ☐ | ☐ |
| Perbandingan harga antar kota | ☐ | ☐ | ☐ |
| Grafik tren harga (7/30/90 hari) | ☐ | ☐ | ☐ |
| Heatmap stok per wilayah | ☐ | ☐ | ☐ |
| Prediksi harga (AI LSTM) | ☐ | ☐ | ☐ |
| Notifikasi lonjakan harga | ☐ | ☐ | ☐ |
| Rekomendasi intervensi otomatis | ☐ | ☐ | ☐ |
| Tracking realisasi intervensi | ☐ | ☐ | ☐ |
| Laporan dampak intervensi | ☐ | ☐ | ☐ |
| Data lapangan kerja sektor pangan | ☐ | ☐ | ☐ |
| Laporan PDF/Excel otomatis | ☐ | ☐ | ☐ |
| Peta distribusi logistik | ☐ | ☐ | ☐ |
| Simulasi dampak kebijakan | ☐ | ☐ | ☐ |

---

## Bagian 10: Pairwise Comparison — Dashboard vs Intervensi

Mana yang lebih prioritas untuk instansi Anda?

| Pasangan | Pilihan A | Pilihan B |
|----------|-----------|-----------|
| 1 | Dashboard Monitoring Harga | Tools Intervensi Pasar |
| 2 | Dashboard Inflasi | Heatmap Stok |
| 3 | Prediksi Harga AI | Laporan Otomatis |
| 4 | Rekomendasi Intervensi | Tracking Realisasi Intervensi |
| 5 | Data Employment | Data Distribusi Logistik |

---

## Bagian 11: Matriks Prioritas Final — Regulator

Urutkan fitur dari paling penting (1) ke kurang penting (8):

| Fitur | Ranking (1-8) |
|-------|---------------|
| Dashboard Inflasi Real-Time | _ |
| Heatmap Stok Peta | _ |
| Prediksi Harga AI | _ |
| Tools Intervensi Pasar | _ |
| Data Lapangan Kerja | _ |
| Laporan Otomatis | _ |
| Manajemen Intervensi | _ |
| Monitoring Distribusi | _ |

---

## Bagian 12: Kebutuhan Data Sharing & Kolaborasi

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| K1 | Apakah instansi Anda bersedia memberikan **data harga acuan** (HET, harga pasar) ke platform? | a) Ya, terbuka b) Mungkin (dengan MoU) c) Tidak | Data sharing |
| K2 | Apakah instansi Anda bersedia menerima data dari platform untuk keperluan monitoring? | a) Ya b) Mungkin c) Tidak | Data receiving |
| K3 | Jika bersedia sharing data, bagaimana mekanisme yang diinginkan? | a) API otomatis b) Laporan periodik (CSV/Excel) c) Dashboard akses d) Lainnya | Mekanisme |
| K4 | Apakah ada standar data yang harus diikuti? (Sembako: BPS, SNI, dll) | (Isian) | Standarisasi |
| K5 | Apakah ada regulasi yang membatasi pertukaran data ini? | (Isian) | Regulasi |
| K6 | Apakah Anda bersedia menjadi **mitra pilot project** platform ini? | a) Ya b) Mungkin (perlu persetujuan atasan) c) Tidak | Komitmen |

---

## Bagian 13: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Frekuensi update data yang diinginkan? | a) Real-time (setiap transaksi) b) Harian c) Mingguan d) Bulanan |
| NF2 | Apakah perlu **history data** >1 tahun? | a) Ya, minimal 5 tahun b) Ya, 2 tahun c) Cukup 1 tahun |
| NF3 | Jumlah pengguna dari instansi yang perlu akses? | a) 1-2 orang b) 3-5 orang c) 5-10 orang d) >10 orang |
| NF4 | Level akses pengguna yang dibutuhkan? | a) Admin (full akses) + viewer (lihat saja) b) Semua viewer c) Satu level saja |
| NF5 | Apakah perlu **whitelabel** (platform atas nama instansi)? | a) Ya b) Tidak |
| NF6 | Apakah perlu integrasi dengan **sistem existing** (Siskaperbapo, dll)? | a) Ya, wajib b) Nice to have c) Tidak perlu |

---

## Bagian 14: Pertanyaan Terbuka

| No | Pertanyaan |
|----|-----------|
| O1 | Apa tantangan terbesar dalam monitoring pangan di wilayah/instansi Anda? |
| O2 | Menurut Anda, apa penyebab utama fluktuasi harga sembako di Indonesia? |
| O3 | Seperti apa platform monitoring pangan ideal versi Anda? |
| O4 | Apa kekhawatiran terbesar menggunakan data dari platform swasta? |
| O5 | Apa yang membuat instansi Anda tertarik berkolaborasi dengan platform ini? |
| O6 | Apakah ada fitur khusus yang belum disebutkan tapi penting untuk tugas Anda? |

---

## Ringkasan Keputusan Fiksasi

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Komoditas prioritas | |
| Level wilayah | |
| Frekuensi data | |
| Mekanisme data sharing | |
| Standar data | |
| Minat kolaborasi | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Regulator*
