# 📊 PERBANDINGAN KODE SEBELUM & SESUDAH - PROFIL SINKRONISASI

## 1️⃣ PERUBAHAN: LOAD DATA PROFIL

### SEBELUM ❌
```typescript
useEffect(() => {
  setMounted(true);
  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/profil");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.nama || "",
          email: data.email || "",
          phone: data.telepon || "",
          // ...
        });
      }
    } catch (error) {
      console.error("Gagal memuat data profil:", error);
    }
  };

  if (session?.user) fetchUserData();
}, [session]);
```

**Masalah:**
- ❌ Tidak ada loading state
- ❌ Tidak ada error toast ke user
- ❌ Race condition antara setMounted dan fetch
- ❌ Jika session berubah, fetch jalan lagi

---

### SESUDAH ✅
```typescript
// Terpisah: setMounted dan fetch data
useEffect(() => {
  setMounted(true);
}, []);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      setIsLoadingProfile(true);  // ← Loading dimulai
      const res = await fetch("/api/auth/profil");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.nama || "",
          email: data.email || "",
          phone: data.telepon || "",
          // ...
        });
      } else {
        toast.error("Gagal memuat data profil");  // ← Error toast
      }
    } catch (error) {
      console.error("Gagal memuat data profil:", error);
      toast.error("Terjadi kesalahan saat memuat profil");  // ← Error toast
    } finally {
      setIsLoadingProfile(false);  // ← Loading selesai
    }
  };

  // Hanya fetch jika session & mounted keduanya ready
  if (session?.user && mounted) {
    fetchUserData();
  }
}, [session, mounted]);

// Tampilkan loading state di render
if (isLoadingProfile) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
        <p className="text-zinc-400">Memuat data profil dari database...</p>
      </div>
    </div>
  );
}
```

**Perbaikan:**
- ✅ Ada loading state yang jelas
- ✅ Error ditampilkan ke user via toast
- ✅ Tidak ada race condition
- ✅ User tahu data sedang dimuat

---

## 2️⃣ PERUBAHAN: VALIDASI FORM

### SEBELUM ❌
```typescript
const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validasi terlalu simple
  if (!formData.name || !formData.email) {
    toast.error("Nama dan email tidak boleh kosong");
    return;  // Tidak ada early return
  }

  setIsSaving(true);
  // ... kirim ke API
};
```

**Masalah:**
- ❌ Tidak bisa membedakan field mana yang kosong
- ❌ Spasi tidak dihapus (misal: "  " dihitung sebagai ada isi)
- ❌ Pesan error tidak jelas

---

### SESUDAH ✅
```typescript
const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ===== VALIDASI DATA PENTING =====
  if (!formData.name.trim()) {
    toast.error("❌ Nama tidak boleh kosong");
    return;  // ← Early return untuk stop proses
  }

  if (!formData.email.trim()) {
    toast.error("❌ Email tidak boleh kosong");
    return;  // ← Early return untuk stop proses
  }

  setIsSaving(true);
  // ... kirim ke API
};
```

**Perbaikan:**
- ✅ Validasi dengan .trim() untuk hapus spasi
- ✅ Validasi setiap field terpisah
- ✅ Pesan error lebih spesifik dengan emoji
- ✅ Early return jelas

---

## 3️⃣ PERUBAHAN: SAVE & SINKRONISASI DATA

### SEBELUM ❌
```typescript
if (response.ok) {
  toast.success("Profil diperbarui!");
  
  // Tidak ada refresh data
  // Tidak ada detail comments
  
  await update({ 
    ...session, 
    user: { 
      ...session?.user, 
      nama: formData.name 
    } 
  });
  
  setIsEditing(false);
} else {
  throw new Error("Gagal memperbarui");
}
```

**Masalah:**
- ❌ Tidak refresh data dari database
- ❌ Tidak jelas alur prosesnya
- ❌ Jika ada perubahan di tempat lain, tidak kedeteksi
- ❌ Error handling kurang baik

---

### SESUDAH ✅
```typescript
if (response.ok) {
  const result = await response.json();
  toast.success("✓ Profil berhasil disimpan ke database!");
  
  // ===== UPDATE SESSION =====
  // Update session agar nama terbaru langsung terlihat di navbar/sidebar
  await update({ 
    ...session, 
    user: { 
      ...session?.user, 
      nama: formData.name,
      email: formData.email 
    } 
  });
  
  setIsEditing(false);
  
  // ===== SINKRONISASI DATA =====
  // Ambil data terbaru dari database untuk memastikan semua field sinkron
  const freshRes = await fetch("/api/auth/profil");
  if (freshRes.ok) {
    const freshData = await freshRes.json();
    setFormData({
      name: freshData.nama || "",
      email: freshData.email || "",
      phone: freshData.telepon || "",
      jalan: freshData.jalan || "",
      kelurahan: freshData.kelurahan || "",
      kecamatan: freshData.kecamatan || "",
      kabupaten: freshData.kabupaten || "",
      provinsi: freshData.provinsi || "",
      kodePos: freshData.kodePos || "",
    });
  }
} else {
  const errorData = await response.json();
  toast.error("❌ " + (errorData.error || "Gagal memperbarui profil"));
}
```

**Perbaikan:**
- ✅ Refresh data dari database
- ✅ Comments jelas alur prosesnya
- ✅ Data pasti sinkron dengan DB
- ✅ Error handling lebih detail
- ✅ Update navbar/sidebar realtime

---

## 4️⃣ PERUBAHAN: API GET ENDPOINT

### SEBELUM ❌
```typescript
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) 
          return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 }
          );

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) 
          return NextResponse.json(
            { error: "User not found" }, 
            { status: 404 }
          );

        console.log("DB Result for", user.email, ":", user.nama);

        return NextResponse.json({
            nama: user.nama ?? "",
            email: user.email ?? "",
            telepon: user.telepon ?? "",
            jalan: user.jalan ?? "",
            // ... field lainnya
        });
    } catch (error) {
        return NextResponse.json(
          { error: "Internal Server Error" }, 
          { status: 500 }
        );
    }
}
```

**Masalah:**
- ❌ Error message dalam English
- ❌ Log tidak detail
- ❌ Tidak kirim field tambahan (id, role, dll)
- ❌ Pesan error tidak user-friendly

---

### SESUDAH ✅
```typescript
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Tidak ada autentikasi - silakan login terlebih dahulu" }, 
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Data pengguna tidak ditemukan di database" }, 
                { status: 404 }
            );
        }

        // Debug: Cek di terminal VS Code kamu apakah data ini muncul
        console.log("✓ Data profil berhasil diambil untuk:", 
                   user.email, "| Nama:", user.nama);

        // Kirim semua data user dari database ke frontend dengan mapping yang benar
        return NextResponse.json({
            id: user.id,
            nama: user.nama ?? "",
            email: user.email ?? "",
            telepon: user.telepon ?? "",
            role: user.role ?? "",
            avatar: user.avatar ?? "",
            jalan: user.jalan ?? "",
            kelurahan: user.kelurahan ?? "",
            kecamatan: user.kecamatan ?? "",
            kabupaten: user.kabupaten ?? "",
            provinsi: user.provinsi ?? "",
            kodePos: user.kodePos ?? "",
            latitude: user.latitude,
            longitude: user.longitude,
        });
    } catch (error) {
        console.error("❌ Error saat fetch profil:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat mengambil data profil" }, 
            { status: 500 }
        );
    }
}
```

**Perbaikan:**
- ✅ Error message dalam Bahasa Indonesia
- ✅ Log lebih detail dengan emoji
- ✅ Kirim lebih banyak field
- ✅ Pesan error jelas dan user-friendly

---

## 5️⃣ PERUBAHAN: API PUT ENDPOINT

### SEBELUM ❌
```typescript
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) 
          return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 }
          );

        const body = await req.json();

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                nama: body.name,
                telepon: body.phone,
                jalan: body.jalan,
                kelurahan: body.kelurahan,
                kecamatan: body.kecamatan,
                kabupaten: body.kabupaten,
                provinsi: body.provinsi,
                kodePos: body.kodePos,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json(
          { error: "Gagal memperbarui profil" }, 
          { status: 500 }
        );
    }
}
```

**Masalah:**
- ❌ Tidak validasi data sebelum update
- ❌ Tidak trim input (spasi tetap disimpan)
- ❌ Response tidak detail
- ❌ Tidak ada debug log

---

### SESUDAH ✅
```typescript
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Tidak ada autentikasi - silakan login terlebih dahulu" }, 
                { status: 401 }
            );
        }

        // Ambil data dari request body
        const body = await req.json();

        // Validasi data penting
        if (!body.name?.trim() || !body.email?.trim()) {
            return NextResponse.json(
                { error: "Nama dan email tidak boleh kosong" }, 
                { status: 400 }
            );
        }

        // Update data user di database dengan mapping yang benar
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                nama: body.name.trim(),
                email: body.email.trim(),
                telepon: body.phone?.trim() || "",
                jalan: body.jalan?.trim() || "",
                kelurahan: body.kelurahan?.trim() || "",
                kecamatan: body.kecamatan?.trim() || "",
                kabupaten: body.kabupaten?.trim() || "",
                provinsi: body.provinsi?.trim() || "",
                kodePos: body.kodePos?.trim() || "",
            },
        });

        console.log("✓ Profil berhasil diupdate untuk:", 
                   updatedUser.email, "| Nama baru:", updatedUser.nama);

        // Kirim data yang sudah diupdate kembali ke frontend
        return NextResponse.json({ 
            success: true, 
            message: "Profil berhasil diperbarui",
            user: {
                id: updatedUser.id,
                nama: updatedUser.nama,
                email: updatedUser.email,
                telepon: updatedUser.telepon,
                jalan: updatedUser.jalan,
                kelurahan: updatedUser.kelurahan,
                kecamatan: updatedUser.kecamatan,
                kabupaten: updatedUser.kabupaten,
                provinsi: updatedUser.provinsi,
                kodePos: updatedUser.kodePos,
            }
        });
    } catch (error) {
        console.error("❌ Error saat update profil:", error);
        return NextResponse.json(
            { error: "Gagal memperbarui profil - terjadi kesalahan pada server" }, 
            { status: 500 }
        );
    }
}
```

**Perbaikan:**
- ✅ Validasi data sebelum update
- ✅ Trim semua input untuk hapus spasi
- ✅ Response lebih detail
- ✅ Debug log dengan emoji
- ✅ Pesan error jelas
- ✅ Return data yang berhasil diupdate

---

## 6️⃣ PERUBAHAN: INPUT FORM

### SEBELUM ❌
```typescript
<Input
  label="Nama Lengkap"
  value={formData.name}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
{/* Email tidak ada */}
<Input
  label="Nomor Telepon"
  value={formData.phone}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
{/* Kode Pos tidak ada */}
```

**Masalah:**
- ❌ Email tidak bisa diedit
- ❌ Kode Pos tidak ada di form
- ❌ Form tidak lengkap

---

### SESUDAH ✅
```typescript
<Input
  label="Nama Lengkap"
  value={formData.name}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
<Input
  label="Email"
  type="email"
  value={formData.email}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
<Input
  label="Nomor Telepon"
  value={formData.phone}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
<Input
  label="Kode Pos"
  value={formData.kodePos}
  disabled={!isEditing}
  onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
  className="bg-zinc-800/40 border-white/5 focus:border-emerald-500/50 rounded-xl"
/>
```

**Perbaikan:**
- ✅ Email sekarang bisa diedit
- ✅ Kode Pos sekarang ada di form
- ✅ Form lengkap dan sinkron dengan database

---

## 📊 RINGKASAN PERUBAHAN

| Aspek | Sebelum | Sesudah | Benefit |
|-------|---------|---------|---------|
| Loading State | ❌ Tidak ada | ✅ Ada | User tahu data sedang dimuat |
| Error Handling | ⚠️ Minimal | ✅ Lengkap | User tahu apa yang salah |
| Validasi Form | ⚠️ Simple | ✅ Detail | Data quality lebih baik |
| Refresh Data | ❌ Tidak ada | ✅ Ada | Sinkronisasi sempurna |
| Input Email | ❌ Read-only | ✅ Editable | User bisa update email |
| Input Kode Pos | ❌ Tidak ada | ✅ Ada | Form lengkap |
| Error Message | ❌ English | ✅ Indonesia | User-friendly |
| Debug Log | ⚠️ Minimal | ✅ Detail | Mudah troubleshoot |
| API Response | ⚠️ Field sedikit | ✅ Field lengkap | Frontend dapat data lengkap |
| Comments Kode | ⚠️ Sedikit | ✅ Detail | Mudah dipahami |

---

## ✨ HASIL AKHIR

**Halaman profil sekarang:**
- ✅ Muat data dari database dengan loading indicator
- ✅ Form lengkap dan bisa diedit semua field
- ✅ Validasi data sebelum disimpan
- ✅ Sinkronisasi sempurna dengan database
- ✅ Update navbar/sidebar realtime
- ✅ Error handling yang baik
- ✅ UX yang smooth dan profesional

**Tidak ada perubahan pada logika yang sudah benar, hanya perbaikan dan penambahan yang diperlukan!** ✨

