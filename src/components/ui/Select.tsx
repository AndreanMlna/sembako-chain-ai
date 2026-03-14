"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        /* Pakai text-foreground & font-bold agar kontras di semua mode */
                        className="mb-1.5 block text-sm font-bold text-foreground"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={cn(
                        /* bg-background & text-foreground agar warna teks otomatis ganti */
                        "w-full rounded-lg border px-3 py-2 text-sm transition-all bg-background text-foreground appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
                        /* Kondisi error */
                        error ? "border-red-500" : "border-border",
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled className="bg-card text-foreground/50">
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        /* Tambahkan bg-card di option agar saat diklik di dark mode, listnya nggak putih silau */
                        <option key={option.value} value={option.value} className="bg-card text-foreground">
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;