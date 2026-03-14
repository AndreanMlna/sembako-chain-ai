"use client";
import { UserRole } from "@/types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function DashboardLayout({ children, role }: { children: React.ReactNode; role: UserRole }) {
    return (
        /* Pakai h-screen agar layout utama terkunci, tapi main-nya yang scroll */
        <div className="flex h-screen flex-col bg-background overflow-hidden">

            {/* Navbar Tetap di Atas */}
            <div className="z-[100] w-full border-b border-white/5 bg-nav shadow-md">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR: Pastikan md:block ada biar nggak hilang di desktop! */}
                <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-nav md:block overflow-y-auto">
                    <Sidebar role={role} />
                </aside>

                {/* MAIN CONTENT: Area yang bisa di-scroll dan punya efek bounce */}
                <main className="flex-1 overflow-y-auto p-4 pb-32 md:p-8 md:pb-8 overscroll-behavior-y-bounce">
                    <div className="mx-auto max-w-7xl animate-in">
                        {children}
                    </div>
                </main>
            </div>

            {/* Navigasi Bawah Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-[90] md:hidden">
                <MobileNav role={role} />
            </div>
        </div>
    );
}