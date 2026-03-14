import { APP_NAME } from "@/constants";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 transition-colors duration-300">
            {/* Background Decorator (Opsional buat estetika) */}
            <div className="fixed inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="relative z-10 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-4xl font-extrabold text-primary tracking-tighter">{APP_NAME}</h1>
                <p className="mt-2 text-sm font-medium text-foreground/50">
                    Ekosistem Distribusi Pangan Hybrid Berbasis AI
                </p>
            </div>

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500 delay-150">
                {children}
            </div>
        </div>
    );
}