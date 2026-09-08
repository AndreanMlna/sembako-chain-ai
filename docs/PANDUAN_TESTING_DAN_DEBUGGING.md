# 🛡️ Panduan Pengujian (Testing) & Debugging: Sembako Chain AI

Dokumen ini menjelaskan penerapan 5 pilar pengujian dan debugging pada proyek **Sembako Chain AI** tanpa mengubah kode bisnis yang sudah berjalan:
1. **/api-security-testing** (Audit & Pengujian Keamanan API)
2. **/awt-e2e-testing** (AI Watch Tester - E2E Testing Deklaratif)
3. **/debugging-code** (Interactive Runtime Debugger dengan Breakpoints)
4. **/error-diagnostics-smart-debug** (Diagnostik Cerdas & Triage Error)
5. **/debugging-strategies** (Metodologi Investigasi & Problem Solving)

---

## 📊 Matriks: Kapan Otomatis vs Kapan Manual?

| Pilar | Kategori | Cara Kerja: Otomatis | Cara Kerja: Manual |
|---|---|---|---|
| **1. API Security Testing** | Testing Keamanan | Otomatis di **CI/CD GitHub Actions** (tipe data, linting, secret validation) & WAF Cloud Vercel. | Menjalankan script security audit lokal: `node scripts/test-api-security.mjs`. |
| **2. AWT E2E Testing** | Testing Fungsional | Terjadwal di pipeline CI / Nightly test pada branch utama. | Menjalankan skenario browser YAML via AWT CLI / Playwright. |
| **3. Debugging Code** | Debugging Interaktif | *Tidak Otomatis* (diaktifkan saat investigasi). | Pasang **Breakpoint** di baris kode, tekan **F5** di VS Code (`Next.js: Fullstack`). |
| **4. Error Diagnostics** | Diagnostik Cerdas | **Otomatis Real-Time (Runtime)**: Error Boundary (`error.tsx`, `global-error.tsx`) menangkap crash dan mencatat `error.digest`. | Mencocokkan ID digest di log server dan menganalisis stack trace. |
| **5. Debugging Strategies** | Metodologi | *Tidak Otomatis* (framework berpikir tim). | Menggunakan teknik **Bisection**, **Two Strikes Rule**, dan **Invariant Testing**. |

---

## 1. 🔒 API Security Testing (`/api-security-testing`)
### Apa yang Diuji?
- **Broken Authentication**: Memastikan endpoint kurir/pembeli/petani menolak request tanpa token sesi yang valid (Status 401).
- **IDOR / BOLA (Broken Object Level Authorization)**: Memastikan kurir tidak bisa membajak job kurir lain (`src/app/api/kurir/jobs/[id]/accept`).
- **Input Validation & SQLi Resistance**: Memastikan payload malformed ditolak (400 Bad Request) dan query Prisma ORM meng-escape karakter berbahaya secara parameterized.
- **Sensitive Data Exposure**: Memastikan error message tersanitasi dan tidak membocorkan credential database atau JWT secret.

### Cara Menjalankannya:
- **Otomatis**: Setiap kali melakukan `git push` atau `pull request`, GitHub Actions memvalidasi integritas kode di workflow `.github/workflows/ci.yml`.
- **Manual**: Jalankan script pengujian keamanan lokal di terminal:
  ```bash
  node scripts/test-api-security.mjs
  ```

---

## 2. 🤖 AWT E2E Testing (`/awt-e2e-testing`)
### Apa yang Diuji?
AWT menggunakan skenario browser nyata berbasis YAML yang dieksekusi via Playwright:
- `tests/e2e/scenarios/01-pembeli-journey.yaml`: Alur landing page -> katalog sembako -> tambah ke keranjang -> ringkasan belanja.
- `tests/e2e/scenarios/02-kurir-journey.yaml`: Alur dashboard kurir -> ambil job pengantaran -> pemindai QR Code serah terima.

### Cara Menjalankannya:
- **Otomatis**: Dapat diintegrasikan ke tahap end-to-end regression di CI runner.
- **Manual**:
  1. Pastikan server lokal aktif: `npm run dev`.
  2. Eksekusi skenario deklaratif dengan CLI AWT:
     ```bash
     npx skills add ksgisang/awt-skill --skill awt -g
     npx awt run tests/e2e/scenarios/01-pembeli-journey.yaml
     ```

---

## 3. 🐞 Interactive Debugging (`/debugging-code`)
### Fitur:
Konfigurasi telah ditambahkan di `.vscode/launch.json` untuk menghubungkan Node.js debugger dan browser Chrome langsung ke IDE.

### Cara Menggunakannya (Manual):
1. Buka file API atau komponen React (misal `src/app/api/kurir/jobs/available/route.ts`).
2. Klik di sebelah kiri nomor baris (gutter) untuk memasang titik merah (**Breakpoint**).
3. Tekan **F5** atau buka panel **Run & Debug** di sidebar VS Code, lalu pilih `Next.js: Fullstack Debug`.
4. Trigger aksi dari browser atau kirim request: eksekusi aplikasi akan berhenti tepat di breakpoint Anda!
5. Anda dapat:
   - Melihat nilai variabel langsung di panel **Variables** (tanpa perlu `console.log`).
   - Melangkah baris demi baris menggunakan tombol **Step Over (F10)** atau **Step Into (F11)**.
   - Mengevaluasi ekspresi objek di **Debug Console**.

---

## 4. 🧠 Smart Error Diagnostics (`/error-diagnostics-smart-debug`)
### Fitur:
- **Otomatis Real-Time**: Ketika terjadi error pada komponen React atau rendering halaman, `src/app/error.tsx` dan `src/app/global-error.tsx` secara otomatis mencegah aplikasi crash menjadi layar putih, menampilkan UI ramah pengguna dengan tombol "Coba Lagi", dan membangkitkan kode `error.digest`.
- **Manual (Analisis Akar Masalah)**:
  Saat tim menemukan digest ID di layar (contoh: `ERR_849204`):
  1. Cari ID tersebut di terminal log / Vercel Monitoring.
  2. Klasifikasikan ke 1 dari 5 kategori:
     - *Logic Error*: Kondisi ternary atau null handling yang luput.
     - *State Drift*: Data keranjang atau session user tidak sinkron.
     - *Integration*: Koneksi database Prisma atau third-party API timeout.
     - *Resource*: Kehabisan memory atau connection pool exhausted.
     - *Data Corruption*: Format ID tidak sesuai UUID / CUID.

---

## 5. 🎯 Systematic Debugging Strategies (`/debugging-strategies`)
### Metodologi Pemecahan Masalah:
1. **Divide and Conquer (Bisection)**:
   - Jika tombol checkout error, periksa di 3 titik batas: (1) State form di browser -> (2) Payload request di Network Tab -> (3) Handler API di `src/app/api/pembeli/orders`.
2. **Two Strikes Rule**:
   - Jika hipotesis Anda sudah dicoba 2 kali dan terbukti salah, hentikan asumsi tersebut dan baca ulang alur data dari sumber aslinya.
3. **Invariant Assertion**:
   - Selalu pastikan nilai-nilai mutlak valid (contoh: `totalHarga >= 0`, `job.status in ['PENDING', 'CONFIRMED', 'PICKED_UP', 'DELIVERED']`).
