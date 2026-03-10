import { APP_NAME } from "@/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Ekosistem Distribusi Pangan Hybrid Berbasis AI
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
