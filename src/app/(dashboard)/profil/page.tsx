"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Camera as CameraIcon,
  UserCircle as UserIcon,
  ShieldCheck as ShieldIcon,
  Mail as MailIcon,
  Loader2 as LoaderIcon,
  Save as SaveIcon,
  Key as KeyIcon,
  Edit3 as EditIcon,
  X as XIcon,
  Phone as PhoneIcon,
  CheckCircle2 as CheckIcon
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "react-hot-toast";

interface UserSession {
  id?: string;
  nama?: string | null;
  email?: string | null;
  role?: string;
}

export default function ProfilPage() {
  const { data: session, update } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // === STATE UNTUK GANTI PASSWORD ===
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jalan: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    kodePos: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await fetch(`/api/auth/profil?timestamp=${new Date().getTime()}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.nama || data.name || session?.user?.nama || "",
            email: data.email || session?.user?.email || "",
            phone: data.telepon || data.phone || "",
            jalan: data.jalan || "",
            kelurahan: data.kelurahan || "",
            kecamatan: data.kecamatan || "",
            kabupaten: data.kabupaten || "",
            provinsi: data.provinsi || "",
            kodePos: data.kodePos || "",
          });
        } else {
          toast.error("Gagal memuat data profil dari database");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan koneksi");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (session?.user && mounted) {
      fetchUserData();
    }
  }, [session, mounted]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("❌ Nama tidak boleh kosong");
    if (!formData.email.trim()) return toast.error("❌ Email tidak boleh kosong");

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        nama: formData.name,
        name: formData.name,
        telepon: formData.phone,
        phone: formData.phone,
      };

      const response = await fetch("/api/auth/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("✓ Profil berhasil disimpan ke database!");

        await update({
          ...session,
          user: { ...session?.user, nama: formData.name, email: formData.email }
        });

        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast.error("❌ " + (errorData.error || "Gagal memperbarui profil"));
      }
    } catch (error) {
      toast.error("⚠ Terjadi kesalahan saat menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  // === FUNGSI SUBMIT GANTI PASSWORD ===
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.oldPassword) return toast.error("❌ Password lama wajib diisi");
    if (passwordData.newPassword.length < 8) return toast.error("❌ Password baru minimal 8 karakter");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("❌ Konfirmasi password tidak cocok");
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("✓ Password berhasil diperbarui!");
        setIsEditingPassword(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form
      } else {
        const errorData = await response.json();
        toast.error("❌ " + (errorData.error || "Gagal memperbarui password"));
      }
    } catch (error) {
      toast.error("⚠ Terjadi kesalahan sistem saat memperbarui password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!mounted) return null;

  if (isLoadingProfile) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <LoaderIcon className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
            <p className="text-zinc-400">Memuat data profil dari database...</p>
          </div>
        </div>
    );
  }

  const user = session?.user as UserSession | undefined;
  const displayName = formData.name || user?.nama || "User";

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <PageHeader
            title="Account Settings"
            description="Kelola informasi profil dan pengaturan keamanan akun Anda"
        />

        <div className="mx-auto max-w-4xl space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32" />
            <CardContent className="relative z-10 p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-background text-3xl font-bold text-primary border border-primary/20">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 rounded-lg bg-primary p-2 text-white hover:scale-110 transition-transform shadow-lg">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-wider mb-2">
                <CheckIcon className="h-3 w-3" /> VERIFIED {user?.role || "MEMBER"}
              </span>
                <h3 className="text-2xl font-bold text-foreground">{displayName}</h3>
                <p className="text-foreground/60 text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <MailIcon className="h-3.5 w-3.5" /> {formData.email}
                </p>
              </div>
            </CardContent>
          </div>

          <Card className="border-none bg-card/50 backdrop-blur-xl shadow-2xl ring-1 ring-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Informasi Pribadi</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Nama Lengkap" value={formData.name} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-background/40 border-border focus:border-primary/50 rounded-xl" />
                  <Input label="Email" type="email" value={formData.email} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-background/40 border-border focus:border-primary/50 rounded-xl" />
                  <Input label="Nomor Telepon" value={formData.phone} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-background/40 border-border focus:border-primary/50 rounded-xl" />
                  <Input label="Kode Pos" value={formData.kodePos} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })} className="bg-background/40 border-border focus:border-primary/50 rounded-xl" />
                  <div className="sm:col-span-2">
                    <Input label="Alamat Jalan" value={formData.jalan} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, jalan: e.target.value })} className="bg-background/40 border-border focus:border-primary/50 rounded-xl" />
                  </div>
                  <Input label="Kelurahan" value={formData.kelurahan} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })} className="bg-background/40 rounded-xl border-border" />
                  <Input label="Kecamatan" value={formData.kecamatan} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })} className="bg-background/40 rounded-xl border-border" />
                  <Input label="Kota/Kabupaten" value={formData.kabupaten} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })} className="bg-background/40 rounded-xl border-border" />
                  <Input label="Provinsi" value={formData.provinsi} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })} className="bg-background/40 rounded-xl border-border" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                  {!isEditing ? (
                      <Button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-xl transition-all">
                        <EditIcon className="h-4 w-4" /> Edit Profil
                      </Button>
                  ) : (
                      <>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-foreground/50 hover:text-foreground px-4">Batal</button>
                        <Button type="submit" disabled={isSaving} className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-2 rounded-xl">
                          {isSaving ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4 mr-2" />} Simpan
                        </Button>
                      </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="border-none bg-card/50 backdrop-blur-xl shadow-xl ring-1 ring-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                    <ShieldIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Keamanan Akun</h3>
                    <p className="text-xs text-foreground/50 mt-1">Ganti password secara berkala untuk menjaga keamanan</p>
                  </div>
                </div>
                {!isEditingPassword && (
                    <Button type="button" onClick={() => setIsEditingPassword(true)} variant="outline" className="w-full sm:w-auto border-border hover:bg-foreground/5 text-foreground/70 rounded-xl h-10 px-6 text-xs">
                      <KeyIcon className="mr-2 h-3.5 w-3.5" /> Ganti Password
                    </Button>
                )}
              </div>

              {/* FORM GANTI PASSWORD */}
              {isEditingPassword && (
                  <form onSubmit={handleUpdatePassword} className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input
                            label="Password Lama"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                            className="bg-background/40 border-border focus:border-blue-500/50 rounded-xl"
                            placeholder="••••••••"
                        />
                      </div>
                      <Input
                          label="Password Baru"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-background/40 border-border focus:border-blue-500/50 rounded-xl"
                          placeholder="Minimal 8 karakter"
                      />
                      <Input
                          label="Konfirmasi Password Baru"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-background/40 border-border focus:border-blue-500/50 rounded-xl"
                          placeholder="Ulangi password baru"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                      <button
                          type="button"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                          }}
                          className="text-sm font-bold text-foreground/50 hover:text-foreground px-4"
                      >
                        Batal
                      </button>
                      <Button
                          type="submit"
                          disabled={isSavingPassword}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                      >
                        {isSavingPassword ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4 mr-2" />}
                        Simpan Password
                      </Button>
                    </div>
                  </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}