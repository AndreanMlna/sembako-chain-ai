# 🧪 PANDUAN TESTING HALAMAN PROFIL - STEP BY STEP

Panduan ini menjelaskan cara test halaman profil untuk memastikan sinkronisasi database berfungsi dengan baik.

---

## 📋 PERSIAPAN AWAL

### Step 0: Buka Browser DevTools
1. Buka halaman profil
2. Tekan **F12** untuk buka Developer Tools
3. Buka tab **Console** untuk lihat logs
4. Buka tab **Network** untuk lihat API calls

### Step 1: Login ke Website
1. Login dengan username dan password Anda
2. Pastikan session aktif dan token ada di cookies
3. Jika belum login, arahkan ke login page terlebih dahulu

---

## ✅ TEST CASE 1: LOAD DATA AWAL

**Tujuan:** Verifikasi data profil berhasil dimuat dari database

### Tahap 1: Buka Halaman Profil
```
1. Click menu atau navigation ke halaman profil
2. Catat waktu halaman dibuka
```

### Tahap 2: Amati Loading State
```
Harusnya terlihat:
✓ Spinner loading berputar
✓ Text: "Memuat data profil dari database..."
✓ Warna spinner: emerald-500 (hijau)

Jika ada error:
❌ Spinner tidak muncul = buka console, cek error
❌ Text tidak muncul = cek file page.tsx
```

### Tahap 3: Tunggu Data Dimuat
```
Tunggu ±2-3 detik sampai:
✓ Loading state hilang
✓ Form tampil dengan data terisi
✓ Input fields: nama, email, telepon, dll
```

### Tahap 4: Verifikasi Data Form
```
Check di Console (F12 → Console):
- Harus ada log: "✓ Data profil berhasil diambil untuk: user@email.com"
- Lihat nama pengguna terisi di form
- Lihat email terisi
- Lihat nomor telepon (jika ada di database)

Check di Network Tab (F12 → Network):
- Cari request: GET /api/auth/profil
- Status: 200 OK
- Response: harus berisi {nama, email, telepon, dll}
```

### Tahap 5: Jika Data Kosong
```
Jika form kosong/error:
1. Check database → apakah ada data user?
2. Check API → buka /api/auth/profil di browser
3. Check console → ada error message?

Troubleshoot:
- Verifikasi user sudah login ✓
- Verifikasi email di session = email di database ✓
- Verifikasi database connection ✓
```

**✅ Test Passed Jika:**
- ✓ Loading spinner muncul
- ✓ Data form terisi dari database
- ✓ Tidak ada error di console
- ✓ Log sukses muncul

---

## ✅ TEST CASE 2: EDIT DATA PROFIL

**Tujuan:** Verifikasi user bisa edit data dan tersimpan

### Tahap 1: Klik Tombol Edit Profil
```
1. Lihat form sudah terisi data
2. Scroll ke bawah cari tombol "Edit Profil" (warna emerald)
3. Klik tombol "Edit Profil"

Harusnya:
✓ Tombol "Edit Profil" berubah menjadi tombol "Simpan" dan "Batal"
✓ Input fields berubah dari disabled menjadi editable
✓ Background input berubah (bisa diedit sekarang)
```

### Tahap 2: Edit Nama
```
1. Klik di input "Nama Lengkap"
2. Hapus nama lama
3. Ketik nama baru, misal: "Nama Saya Baru"
4. Verifikasi text sudah berubah di input
```

### Tahap 3: Edit Email
```
1. Klik di input "Email"
2. Ubah email menjadi: "email_baru@test.com"
3. Verifikasi text sudah berubah
```

### Tahap 4: Edit Telepon
```
1. Klik di input "Nomor Telepon"
2. Ubah menjadi: "081234567890"
3. Verifikasi text sudah berubah
```

### Tahap 5: Klik Tombol Simpan
```
1. Scroll ke bawah cari tombol "Simpan"
2. Klik tombol "Simpan"
3. Verifikasi:
   ✓ Toast sukses: "✓ Profil berhasil disimpan ke database!"
   ✓ Tombol menjadi "Edit Profil" lagi
   ✓ Input fields kembali disabled (read-only)
```

### Tahap 6: Verifikasi API Calls
```
Buka tab Network (F12 → Network):
1. Cari request: PUT /api/auth/profil
   - Status: 200 OK
   - Request body: {name: "Nama Saya Baru", email: "email_baru@test.com", phone: "081234567890", ...}
   
2. Cari request: GET /api/auth/profil (jika ada 2x = refresh data)
   - Status: 200 OK
   - Response: nama sudah berubah

Buka Console (F12 → Console):
- Lihat log: "✓ Profil berhasil diupdate untuk: email_baru@test.com | Nama baru: Nama Saya Baru"
```

### Tahap 7: Verifikasi Data di Database
```
1. Buka Prisma Studio (jika ada)
   - prisma studio
   - Cari user dengan email terbaru
   - Verifikasi nama, email, telepon sudah berubah

Atau manual check:
1. Refresh browser (F5)
2. Lihat loading spinner
3. Verifikasi data masih tetap nama baru (= tersimpan di DB)
```

**✅ Test Passed Jika:**
- ✓ Form bisa diedit
- ✓ Toast sukses muncul saat simpan
- ✓ PUT request berhasil
- ✓ GET request refresh data
- ✓ Data tetap ada setelah refresh

---

## ✅ TEST CASE 3: VALIDASI FORM - NAMA KOSONG

**Tujuan:** Verifikasi validasi mencegah simpan nama kosong

### Tahap 1: Edit Mode
```
1. Klik "Edit Profil"
2. Verifikasi form editable
```

### Tahap 2: Kosongkan Nama
```
1. Klik di input "Nama Lengkap"
2. Ctrl+A (select all)
3. Hapus (delete/backspace)
4. Verifikasi input kosong
```

### Tahap 3: Coba Simpan
```
1. Klik tombol "Simpan"
2. Tunggu validasi berjalan
```

### Tahap 4: Verifikasi Error Message
```
Harusnya terlihat:
✓ Toast error: "❌ Nama tidak boleh kosong"
✓ Form TIDAK disimpan (tetap di edit mode)
✓ Tombol "Simpan" masih ada

Jika error tidak muncul:
❌ Buka console, cek apakah validasi jalan
❌ Check file profil/page.tsx baris validasi
```

### Tahap 5: Isi Nama Lagi
```
1. Klik input "Nama Lengkap"
2. Ketik nama: "Nama Test"
3. Klik "Simpan"
4. Verifikasi toast sukses
```

**✅ Test Passed Jika:**
- ✓ Error message muncul saat nama kosong
- ✓ Form tidak disimpan
- ✓ Toast error dengan emoji ❌
- ✓ Bisa simpan lagi setelah isi nama

---

## ✅ TEST CASE 4: VALIDASI FORM - EMAIL KOSONG

**Tujuan:** Verifikasi validasi mencegah simpan email kosong

### Tahap 1: Edit Mode
```
1. Klik "Edit Profil"
```

### Tahap 2: Kosongkan Email
```
1. Klik input "Email"
2. Ctrl+A (select all)
3. Hapus (delete)
4. Verifikasi input kosong
```

### Tahap 3: Coba Simpan
```
1. Klik tombol "Simpan"
```

### Tahap 4: Verifikasi Error Message
```
Harusnya terlihat:
✓ Toast error: "❌ Email tidak boleh kosong"
✓ Form TIDAK disimpan
✓ Masih di edit mode

Debugging:
- Buka console
- Verifikasi error message di logs
```

### Tahap 5: Isi Email Lagi
```
1. Klik input "Email"
2. Ketik: "test@example.com"
3. Klik "Simpan"
4. Verifikasi sukses
```

**✅ Test Passed Jika:**
- ✓ Error message "Email tidak boleh kosong" muncul
- ✓ Form tidak disimpan
- ✓ Masih dalam edit mode

---

## ✅ TEST CASE 5: EDIT EMAIL DAN KODE POS

**Tujuan:** Verifikasi field baru (email & kode pos) berfungsi

### Tahap 1: Edit Mode
```
1. Klik "Edit Profil"
2. Cari input "Email" - harusnya ada
3. Cari input "Kode Pos" - harusnya ada

Jika tidak ada:
❌ Check page.tsx - input perlu ditambahkan
```

### Tahap 2: Edit Email
```
1. Klik input "Email"
2. Ubah ke: "newemail@example.com"
3. Verifikasi berubah
```

### Tahap 3: Edit Kode Pos
```
1. Klik input "Kode Pos"
2. Ubah ke: "12345"
3. Verifikasi berubah
```

### Tahap 4: Simpan
```
1. Klik "Simpan"
2. Verifikasi toast sukses
```

### Tahap 5: Refresh dan Verifikasi
```
1. Refresh browser (F5)
2. Tunggu loading
3. Verifikasi email dan kode pos masih ada di form
4. Masuk database, verifikasi email & kodePos sudah berubah
```

**✅ Test Passed Jika:**
- ✓ Input Email dan Kode Pos ada di form
- ✓ Bisa diedit dan disimpan
- ✓ Data tetap ada setelah refresh
- ✓ Database update dengan data terbaru

---

## ✅ TEST CASE 6: REFRESH BROWSER

**Tujuan:** Verifikasi data tetap ada setelah refresh browser

### Tahap 1: Edit dan Simpan Data
```
1. Klik "Edit Profil"
2. Ubah nama, email, atau field lain
3. Klik "Simpan"
4. Verifikasi toast sukses
5. Catat data baru yang Anda simpan
```

### Tahap 2: Refresh Browser
```
1. Tekan F5 untuk refresh browser
2. Verifikasi:
   ✓ Loading spinner muncul
   ✓ Console log: "✓ Data profil berhasil diambil..."
```

### Tahap 3: Tunggu Data Dimuat
```
1. Tunggu ±2-3 detik
2. Loading hilang
3. Form tampil dengan data
```

### Tahap 4: Verifikasi Data Masih Ada
```
Periksa di form:
- ✓ Nama: harus nama yang Anda ubah tadi
- ✓ Email: harus email yang Anda ubah tadi
- ✓ Field lain: harus sesuai update terbaru

Jika data hilang:
❌ Database tidak update
❌ Cek API PUT apakah error
❌ Cek console apakah ada error saat save
```

**✅ Test Passed Jika:**
- ✓ Loading spinner muncul saat refresh
- ✓ Data tetap ada sesuai yang disimpan
- ✓ Tidak ada error di console
- ✓ Log sukses di console

---

## ✅ TEST CASE 7: KLIK BATAL EDIT

**Tujuan:** Verifikasi batal edit tidak menyimpan perubahan

### Tahap 1: Catat Data Awal
```
1. Lihat form (read-only)
2. Catat nama, email, dll (awal)
3. Misalnya nama awal: "John Doe"
```

### Tahap 2: Edit Mode dan Ubah Data
```
1. Klik "Edit Profil"
2. Ubah nama jadi: "Jane Doe"
3. Ubah email jadi: "jane@example.com"
4. Verifikasi input berubah
```

### Tahap 3: Klik Tombol Batal
```
1. Klik tombol "Batal" (warna gelap, sebelah tombol Simpan)
2. Verifikasi:
   ✓ Edit mode hilang
   ✓ Tombol "Edit Profil" muncul lagi
   ✓ Form kembali read-only (disabled)
```

### Tahap 4: Verifikasi Data Kembali ke Awal
```
Cek di form:
- ✓ Nama: kembali ke "John Doe" (bukan "Jane Doe")
- ✓ Email: kembali ke email awal
- ✓ Semua field kembali ke nilai awal

Jika data tetap berubah:
❌ Batal tidak bekerja dengan baik
❌ Check state management di page.tsx
```

### Tahap 5: Verifikasi API Tidak Ada PUT Request
```
Buka tab Network:
- ✓ Harus TIDAK ada request PUT /api/auth/profil
- ✓ Hanya ada GET untuk awal load saja

Jika ada PUT request:
❌ Tombol Batal harusnya tidak trigger save
```

**✅ Test Passed Jika:**
- ✓ Data kembali ke nilai awal setelah batal
- ✓ Form kembali read-only
- ✓ Tidak ada PUT request di network
- ✓ Toast error/sukses tidak muncul

---

## ✅ TEST CASE 8: NAVBAR UPDATE REALTIME

**Tujuan:** Verifikasi navbar/sidebar update saat nama berubah

### Tahap 1: Catat Nama di Navbar
```
1. Lihat navbar / header
2. Catat nama user yang ditampilkan
3. Misalnya: "John Doe"
```

### Tahap 2: Edit Nama di Profil
```
1. Klik "Edit Profil"
2. Ubah nama: "Jane Doe Baru"
3. Klik "Simpan"
4. Verifikasi toast sukses
```

### Tahap 3: Lihat Navbar
```
Catat nama di navbar:
- ✓ Harusnya langsung berubah jadi "Jane Doe Baru"
- ✓ Tidak perlu refresh halaman

Jika navbar tidak berubah:
❌ Session update tidak bekerja
❌ Check kode: await update({ ... })
```

### Tahap 4: Refresh untuk Double Check
```
1. Tekan F5
2. Tunggu loading
3. Lihat navbar
4. Verifikasi nama masih "Jane Doe Baru"
```

**✅ Test Passed Jika:**
- ✓ Navbar update saat simpan (tidak perlu refresh)
- ✓ Nama di navbar = nama di form
- ✓ Setelah refresh, nama masih sama

---

## ✅ TEST CASE 9: ERROR HANDLING - NETWORK ERROR

**Tujuan:** Verifikasi handling error jika koneksi putus

### Tahap 1: Buka DevTools Network Tab
```
1. F12 → Network tab
2. Cari icon "throttling" atau filter
3. Pilih "Offline" untuk simulasi no internet
```

### Tahap 2: Coba Edit & Simpan (Offline)
```
1. Klik "Edit Profil"
2. Ubah nama
3. Klik "Simpan"
4. Verifikasi:
   ✓ Toast error: "⚠ Terjadi kesalahan saat menyimpan profil"
   ✓ Form tidak disimpan
```

### Tahap 3: Hubungkan Internet Lagi
```
1. Di Network tab, pilih "Online" lagi
2. Coba simpan ulang
3. Verifikasi:
   ✓ Toast sukses
   ✓ Data disimpan
```

**✅ Test Passed Jika:**
- ✓ Error message jelas saat offline
- ✓ Bisa retry saat online
- ✓ Data aman (tidak setengah jadi)

---

## 📊 TEST SUMMARY CHECKLIST

```
BASIC FUNCTIONALITY
□ Data load dari database saat buka halaman
□ Form terisi dengan data dari database
□ Loading spinner terlihat

EDIT FUNCTIONALITY
□ Bisa klik "Edit Profil"
□ Input fields bisa diedit
□ Bisa ubah nama
□ Bisa ubah email
□ Bisa ubah telepon
□ Bisa ubah kode pos

SAVE FUNCTIONALITY
□ Klik "Simpan" berhasil
□ Toast sukses muncul
□ Data tersimpan di database
□ API PUT request berhasil

VALIDATION
□ Tidak bisa simpan jika nama kosong
□ Tidak bisa simpan jika email kosong
□ Error message jelas

SYNCHRONIZATION
□ Data refresh dari database setelah update
□ Navbar update saat save
□ Data tetap ada setelah refresh browser

ERROR HANDLING
□ Error message jelas dan dalam Bahasa Indonesia
□ Network error ditangani dengan baik
□ Console tidak ada error

PERFORMANCE
□ Load time < 3 detik
□ No network waterfall
□ Responsive UI
```

---

## 🐛 DEBUGGING TIPS

### Jika Loading Tidak Hilang
```
1. Buka F12 → Console
2. Lihat ada error message?
3. Check Network tab - ada request stuck?
4. Verifikasi API /api/auth/profil bisa diakses

Solusi:
- Restart server
- Cek database connection
- Cek API route logic
```

### Jika Data Tidak Tersimpan
```
1. Lihat console saat klik Simpan
2. Ada error message?
3. Check Network tab - PUT request status?

Debugging:
- Status 401 = session tidak valid, login ulang
- Status 400 = validasi error, lihat error message
- Status 500 = server error, cek terminal server
```

### Jika Navbar Tidak Update
```
1. Check console saat simpan
2. Ada error saat update session?
3. Refresh browser - apakah nama sudah benar di DB?

Jika di DB benar tapi navbar salah:
- Session update mungkin gagal
- Cek kode: await update({ ... })
```

### Jika Data Tidak Sinkron
```
1. Edit & simpan
2. Check Network tab - ada 2x GET request?
   - GET 1: awal load
   - GET 2: refresh setelah PUT
3. Jika hanya 1x GET, refresh data belum dijalankan

Cek file page.tsx:
- Setelah response.ok, harus ada fetch lagi
```

---

## 📝 DOKUMENTASI TAMBAHAN

Lihat file-file dokumentasi lainnya:
- `DOKUMENTASI_PROFIL_SINKRONISASI.md` - Detail teknis
- `RINGKASAN_PERBAIKAN_PROFIL.md` - Ringkasan perubahan
- `PERBANDINGAN_KODE_PROFIL.md` - Sebelum & sesudah kode

---

**Happy Testing! ✨**

Jika ada pertanyaan atau masalah, cek console logs dan network tab terlebih dahulu sebelum debugging lebih jauh.

