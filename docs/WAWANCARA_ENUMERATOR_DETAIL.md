# Wawancara Detail — Enumerator / Petugas Lapangan
## Fiksasi Fitur & Analisis Kebutuhan

---

## Daftar Fitur yang Akan Divalidasi

| Kode Fitur | Nama Fitur | Prioritas Sistem |
|-----------|-----------|-----------------|
| E-F1 | Aplikasi Pencatatan Data Lapangan | High |
| E-F2 | Mode Offline (Input Tanpa Internet) | High |
| E-F3 | Geotagging & GPS Otomatis | Medium |
| E-F4 | Foto & Dokumentasi Responden | Medium |
| E-F5 | Validasi Data Otomatis (QC) | Medium |
| E-F6 | Sinkronisasi Data Otomatis | High |
| E-F7 | Manajemen Tugas & Target | Medium |
| E-F8 | Laporan & Rekapitulasi Data | Low |

---

## Bagian 1: Profil Enumerator

| No | Pertanyaan | Opsi | Tujuan |
|----|-----------|------|--------|
| P1 | Status pekerjaan Anda? | a) PNS/staf pemerintah b) Tenaga kontrak/honorer c) Surveyor lepas d) Mahasiswa magang e) Lainnya | Profil pekerjaan |
| P2 | Instansi tempat bertugas? | a) BPS b) Dinas Pertanian c) Dinas Ketahanan Pangan d) Lembaga riset e) Lainnya | Afiliasi |
| P3 | Sudah berapa lama menjadi enumerator? | a) <1 tahun b) 1-3 tahun c) 3-5 tahun d) >5 tahun | Pengalaman |
| P4 | Wilayah tugas utama? | a) Satu desa b) Satu kecamatan c) Satu kota d) Beberapa kota | Cakupan wilayah |
| P5 | Berapa responden yang didatangi per bulan? | a) <20 b) 20-50 c) 50-100 d) >100 | Volume kerja |
| P6 | Berapa rata-rata waktu per wawancara? | a) <15 menit b) 15-30 menit c) 30-60 menit d) >60 menit | Durasi wawancara |
| P7 | Berapa penghasilan per bulan sebagai enumerator? | a) <Rp500rb b) Rp500rb-1jt c) Rp1-2jt d) Rp2-5jt e) >Rp5jt | Insentif |

---

## Bagian 2: Fiksasi Fitur — Aplikasi Pencatatan Data (E-F1)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| A1 | Bagaimana cara Anda mencatat data saat ini? | a) Kertas kuesioner b) Google Form c) Aplikasi khusus (CAPI) d) Lainnya | Metode existing |
| A2 | Jika pakai aplikasi, apa nama aplikasinya? | a) CSPro b) SurveyCTO c) ODK d) KoboCollect e) Lainnya | Benchmark |
| A3 | Kelebihan aplikasi yang pernah digunakan? | (Isian) | Best practice |
| A4 | Kekurangan aplikasi yang pernah digunakan? | (Isian) | Pain point existing |
| A5 | Berapa banyak pertanyaan dalam satu kuesioner yang ideal? | a) <20 b) 20-30 c) 30-50 d) >50 | Batas jumlah pertanyaan |
| A6 | Tipe pertanyaan apa yang paling efisien? | a) Pilihan ganda (rapid) b) Isian singkat c) Skala Likert d) Esai | Tipe pertanyaan |
| A7 | Apakah aplikasi perlu mendukung **multi-bahasa** (Indonesia + daerah)? | a) Sangat perlu b) Perlu c) Tidak perlu | Bahasa |

---

## Bagian 3: Fiksasi Fitur — Mode Offline (E-F2)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| O1 | Apakah koneksi internet di wilayah tugas Anda stabil? | a) Stabil (4G) b) 3G kadang-kadang c) Sering tidak ada sinyal d) Tidak ada sama sekali | Kondisi jaringan |
| O2 | Berapa persen wilayah tugas yang memiliki jaringan internet? | a) >75% b) 50-75% c) 25-50% d) <25% | Coverage |
| O3 | Apakah Anda pernah kehilangan data karena masalah koneksi? | a) Sering b) Kadang c) Jarang d) Tidak pernah | Validasi offline mode |
| O4 | Seberapa penting fitur **mode offline** (input data tanpa internet)? | a) Sangat penting (wajib) b) Penting c) Tidak penting | Prioritas offline |
| O5 | Jika offline, berapa lama maksimal Anda bersedia menyimpan data sebelum sync? | a) Selesai 1 responden langsung sync b) Akhir hari c) 2-3 hari d) Seminggu sekali | Toleransi sync |
| O6 | Bagaimana mekanisme sync yang ideal? | a) Otomatis saat ada koneksi b) Manual (tekan tombol sync) c) Campuran | Mekanisme sync |

### Skenario Offline

**Skenario:** Anda mendatangi petani di desa terpencil tanpa sinyal. 

**Alur yang diharapkan:**
1. Sebelum berangkat: Download kuesioner (butuh internet)
2. Di lapangan: Buka aplikasi → pilih kuesioner → isi data (tanpa internet)
3. Foto responden tersimpan di HP
4. GPS capture otomatis (menggunakan GPS satelit, tanpa data)
5. Kembali ke kota → aplikasi sync otomatis saat terhubung WiFi
6. Notifikasi: "Data tersinkronisasi. 5 responden berhasil diupload."

> Pertanyaan: Apakah alur di atas sesuai kondisi lapangan?

---

## Bagian 4: Fiksasi Fitur — Geotagging & GPS (E-F3)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| G1 | Apakah Anda mencatat **lokasi** responden saat ini? | a) Ya, koordinat GPS b) Ya, alamat saja c) Tidak | Metode existing |
| G2 | Jika ya, bagaimana caranya? | a) GPS HP manual b) Maps c) Aplikasi khusus d) Lainnya | Metode GPS |
| G3 | Apakah Anda ingin GPS otomatis terekam saat wawancara? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi auto-geotag |
| G4 | Apakah Anda khawatir GPS tidak akurat di dalam ruangan? | a) Khawatir b) Biasa saja c) Tidak khawatir | Keandalan GPS |
| G5 | Apakah Anda ingin peta lokasi responden untuk navigasi? | a) Sangat ingin b) Ingin c) Tidak perlu | Navigasi lapangan |

---

## Bagian 5: Fiksasi Fitur — Foto & Dokumentasi (E-F4)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| F1 | Apakah Anda mengambil **foto responden** saat wawancara? | a) Ya, selalu b) Kadang c) Tidak pernah | Validasi bukti |
| F2 | Apakah Anda mengambil **foto lokasi/lahan**? | a) Ya, selalu b) Kadang c) Tidak pernah | Validasi bukti |
| F3 | Apakah Anda mengambil **foto dokumen** (KTP, izin, dll)? | a) Ya b) Kadang c) Tidak | Validasi dokumen |
| F4 | Apakah Anda bersedia menambahkan **tanda tangan digital** responden? | a) Ya, lebih praktis b) Mungkin c) Tidak, lebih suka tanda tangan basah | Tanda tangan |
| F5 | Apakah Anda khawatir **ukuran foto** besar dan menghabiskan memori? | a) Khawatir b) Biasa saja c) Tidak khawatir | Storage concern |

---

## Bagian 6: Fiksasi Fitur — Validasi Data Otomatis (E-F5)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| V1 | Apakah ada validasi kualitas data yang dilakukan saat ini? | a) Ya, manual (diperiksa supervisor) b) Ya, otomatis di aplikasi c) Tidak ada | QC existing |
| V2 | Jika manual, berapa lama proses validasi? | a) 1-2 hari b) 3-7 hari c) >1 minggu | Latency QC |
| V3 | Validasi otomatis apa yang diinginkan? | a) Range check (harga tidak wajar) b) Konsistensi (umur vs status) c) Kelengkapan (semua terisi) d) Semua | Tipe validasi |
| V4 | Apakah Anda ingin sistem menolak input yang tidak valid? | a) Ya, tolak langsung b) Ya, peringatan saja c) Tidak, biarkan | Mekanisme validasi |

---

## Bagian 7: Fiksasi Fitur — Sinkronisasi & Manajemen Tugas (E-F6, E-F7)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| S1 | Bagaimana Anda menerima **tugas** (daftar responden) saat ini? | a) Dari koordinator via WA b) Cetak daftar c) Aplikasi d) Lainnya | Distribusi tugas |
| S2 | Apakah Anda ingin daftar tugas muncul di aplikasi? | a) Sangat ingin b) Ingin c) Tidak perlu | Validasi task management |
| S3 | Apakah Anda ingin **target harian** (jumlah responden) di aplikasi? | a) Sangat ingin b) Ingin c) Tidak perlu | Target system |
| S4 | Apakah Anda ingin **progress** (berapa % responden selesai) terlihat? | a) Sangat ingin b) Ingin c) Tidak perlu | Progress tracking |
| S5 | Apakah Anda ingin **status responden** (sudah diwawancara / belum / tolak) dicatat? | a) Sangat ingin b) Ingin c) Tidak perlu | Status tracking |

---

## Bagian 8: Fiksasi Fitur — Laporan & Rekapitulasi (E-F8)

| No | Pertanyaan | Opsi | Tujuan Fiksasi |
|----|-----------|------|----------------|
| R1 | Laporan apa yang Anda buat setelah pengumpulan data? | a) Rekap jumlah responden b) Ringkasan data c) Laporan hambatan lapangan d) Semua | Jenis laporan |
| R2 | Bagaimana cara menyampaikan laporan? | a) Email b) WA c) Upload aplikasi d) Cetak | Channel |
| R3 | Apakah Anda ingin laporan otomatis tergenerate? | a) Sangat ingin b) Ingin c) Tidak perlu | Auto-report |

---

## Bagian 9: Matriks Prioritas Sub-Fitur Enumerator

| Sub-Fitur | Sangat Dibutuhkan | Dibutuhkan | Tidak Dibutuhkan |
|-----------|-------------------|-----------|------------------|
| Input data offline | ☐ | ☐ | ☐ |
| Sinkronisasi otomatis | ☐ | ☐ | ☐ |
| GPS otomatis | ☐ | ☐ | ☐ |
| Foto responden | ☐ | ☐ | ☐ |
| Foto lahan/lokasi | ☐ | ☐ | ☐ |
| Tanda tangan digital | ☐ | ☐ | ☐ |
| Validasi otomatis | ☐ | ☐ | ☐ |
| Daftar tugas responden | ☐ | ☐ | ☐ |
| Target & progress | ☐ | ☐ | ☐ |
| Peta navigasi | ☐ | ☐ | ☐ |
| Multi-bahasa | ☐ | ☐ | ☐ |

---

## Bagian 10: Matriks Prioritas Final — Enumerator

Urutkan fitur dari paling penting (1) ke kurang penting (8):

| Fitur | Ranking (1-8) |
|-------|---------------|
| Aplikasi Pencatatan Data | _ |
| Mode Offline | _ |
| Geotagging & GPS | _ |
| Foto & Dokumentasi | _ |
| Validasi Data Otomatis | _ |
| Sinkronisasi Otomatis | _ |
| Manajemen Tugas | _ |
| Laporan & Rekapitulasi | _ |

---

## Bagian 11: Kebutuhan Non-Fungsional

| No | Pertanyaan | Opsi |
|----|-----------|------|
| NF1 | Spesifikasi HP yang digunakan? | a) RAM <2GB b) RAM 2-4GB c) RAM >4GB |
| NF2 | Sisa penyimpanan HP yang tersedia? | a) <2GB b) 2-8GB c) >8GB |
| NF3 | OS HP yang digunakan? | a) Android (sebutkan versi:___) b) iPhone |
| NF4 | Berapa daya tahan baterai HP? | a) Tidak sampai 1 hari b) 1 hari penuh c) >1 hari |
| NF5 | Apakah Anda punya **power bank**? | a) Ya b) Tidak |
| NF6 | Berapa ukuran aplikasi maksimal yang diinginkan? | a) <30MB b) 30-50MB c) 50-100MB d) Tidak masalah |
| NF7 | Apakah aplikasi perlu ringan (tidak boros baterai)? | a) Sangat penting b) Penting c) Tidak masalah |

---

## Bagian 12: Skenario Lengkap — Sehari Jadi Enumerator

**Waktu:** 07:00 — Anda memulai tugas di desa terpencil.

1. **06:30** — Sebelum berangkat, buka aplikasi → **sync data tugas** (download daftar 10 responden + kuesioner)
2. **07:00** — Sampai di desa (tidak ada sinyal) → buka aplikasi (mode offline) → lihat daftar responden
3. **07:15** — Responden 1: Petani Budi → tap "Mulai Wawancara"
   - Isi kuesioner (15 pertanyaan)
   - GPS otomatis capture lokasi lahan
   - Foto petani + foto lahan
   - Tanda tangan digital
   - Simpan → data tersimpan lokal
4. **07:45** — Responden 1 selesai → status berubah "Selesai" di daftar
5. **10:30** — Selesai 5 responden → istirahat
6. **15:00** — Selesai 10 responden → pulang ke kota
7. **16:00** — Sampai di rumah, terhubung WiFi → aplikasi **auto-sync** 
8. **16:05** — Notifikasi: "10 responden berhasil diupload. 0 error."
9. **16:10** — Lihat progress: "Hari ini: 10/10 selesai. Target bulanan: 45/50"
10. **16:15** — Selesai.

> **Pertanyaan:** Apakah skenario di atas realistis? Berapa banyak responden yang bisa Anda selesaikan dalam sehari?

---

## Bagian 13: Pertanyaan Terbuka

| No | Pertanyaan |
|----|-----------|
| O1 | Apa tantangan terbesar saat melakukan wawancara lapangan? |
| O2 | Apa yang membuat Anda efektif sebagai enumerator? |
| O3 | Jika aplikasi ideal, apa fitur yang paling membantu pekerjaan Anda? |
| O4 | Ceritakan pengalaman terburuk saat mengumpulkan data (hujan, responden marah, HP error, dll) |
| O5 | Berapa insentif per responden yang ideal menurut Anda? |
| O6 | Apa saran Anda untuk meningkatkan kualitas data lapangan? |

---

## Ringkasan Keputusan Fiksasi

| Aspek | Keputusan |
|-------|-----------|
| Fitur wajib (MVP) | |
| Prioritas offline mode | |
| Metode dokumentasi | |
| Mekanisme QC | |
| Mekanisme sync | |
| Insentif ideal | |
| Insight unik | |

---

*Dokumen ini adalah pecahan detail dari RANCANGAN_WAWANCARA_STAKEHOLDER.md — fokus pada role Enumerator*
