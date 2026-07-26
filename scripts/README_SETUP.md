# Setup Google Forms API — Auto-Generate Forms

## Prasyarat
- Python 3.8+
- Google account (Gmail/Google Workspace)
- Akses ke [Google Cloud Console](https://console.cloud.google.com)

---

## 1. Buat Project & Aktifkan API

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat **New Project** (atau pilih project yang ada)
3. Masuk ke **APIs & Services** → **Library**
4. Cari **"Google Forms API"** → klik → **ENABLE**
5. Cari **"Google Drive API"** → klik → **ENABLE** (dibutuhkan untuk membuat form)

---

## 2. Buat OAuth 2.0 Client ID

1. **APIs & Services** → **Credentials**
2. Klik **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Desktop app**
4. Name: `HARVEST Forms Generator`
5. Klik **CREATE**
6. Klik **DOWNLOAD JSON** → simpan sebagai `credentials.json`
7. Letakkan file `credentials.json` di folder `scripts/`

> ⚠️ **PENTING:** File `credentials.json` berisi rahasia client. Jangan commit ke git!  
> File ini sudah ada di `.gitignore` (pastikan `scripts/credentials.json` tidak ter-track).

---

## 3. Tambahkan Diri sebagai Test User

Karena aplikasi masih dalam mode testing:

1. **APIs & Services** → **OAuth consent screen**
2. Pilih **External** → **CREATE**
3. Isi App name: `HARVEST Forms`
4. User support email: email kamu
5. Developer contact: email kamu
6. **SAVE AND CONTINUE**
7 Di **Scopes** → **ADD OR REMOVE SCOPES**
8. Cari dan tambahkan:
   - `.../auth/forms.body`
   - `.../auth/drive.file`
9. **SAVE AND CONTINUE**
10. Di **Test users** → **ADD USERS**
11. Tambahkan email Gmail kamu sendiri
12. **SAVE AND CONTINUE**

---

## 4. Install Dependencies

```bash
cd scripts/
pip install -r requirements.txt
```

---

## 5. Jalankan Script

```bash
cd scripts/
python generate_forms.py
```

Pertama kali jalan:
- Browser akan terbuka → login dengan Google account kamu
- Klik **Continue** (ada peringatan "unverified app" — ini normal untuk testing)
- Klik **Allow** untuk memberi akses ke Google Forms & Drive
- Token akan tersimpan di `~/.google_forms_token.json` (untuk session berikutnya)

---

## 6. Hasil

Script akan membuat Google Form untuk setiap file `.json` di folder `forms/`, lalu mencetak URL form-nya.

Contoh output:
```
[*] Processing: petani.json
  Created form: Survei Kebutuhan Petani — HARVEST
  Form ID: abc123xyz
  Added 6 section(s) and questions to form
  URL: https://docs.google.com/forms/d/abc123xyz
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `credentials.json not found` | Download dari Google Cloud Console dan taruh di `scripts/` |
| `Access blocked` error | Pastikan email kamu sudah ditambahkan sebagai **Test user** (langkah 3) |
| Form tidak muncul di Google Drive | Cek apakah Drive API sudah di-enable |
| Token expired | Hapus file `~/.google_forms_token.json` dan jalankan ulang |
| `quota exceeded` | Google Forms API punya batas 10 request/detik per user — tunggu sebentar |

---

## Struktur JSON Form Definition

```json
{
  "info": {
    "title": "Judul Form",
    "documentTitle": "Nama File"
  },
  "sections": [
    {
      "title": "Nama Bagian",
      "description": "Deskripsi bagian (opsional)",
      "questions": [
        {
          "title": "Teks pertanyaan",
          "type": "TEXT",
          "required": true
        }
      ]
    }
  ]
}
```

### Type Question yang Didukung

| type | Deskripsi | Parameter Tambahan |
|------|-----------|-------------------|
| `TEXT` | Isian singkat | — |
| `PARAGRAPH` | Isian panjang | — |
| `MULTIPLE_CHOICE` | Pilihan satu | `options: [...]` |
| `CHECKBOXES` | Pilihan banyak | `options: [...]` |
| `DROPDOWN` | Dropdown | `options: [...]` |
| `LINEAR_SCALE` | Skala 1-N | `min`, `max`, `minLabel`, `maxLabel` |
| `DATE` | Tanggal | — |
| `TIME` | Waktu | — |
