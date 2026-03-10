import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        // Memanggil API cookies dari Next.js
        const cookieStore = await cookies();

        // Ambil SEMUA daftar cookie yang ada di browser saat ini
        const allCookies = cookieStore.getAll();

        // Looping untuk menghapus semua cookie satu per satu tanpa sisa
        // Ini memastikan token login terhapus, apa pun nama spesifiknya (misal: next-auth.session-token)
        allCookies.forEach((cookie) => {
            cookieStore.delete(cookie.name);
        });

        return NextResponse.json(
            { message: "Logout berhasil, semua sesi telah dibersihkan" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Gagal menghapus cookie:", error);
        return NextResponse.json(
            { error: "Gagal memproses logout" },
            { status: 500 }
        );
    }
}