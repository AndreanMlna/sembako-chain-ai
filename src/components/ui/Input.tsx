"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="mb-1.5 block text-sm font-bold text-foreground"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "w-full rounded-lg border px-3 py-2 text-sm transition-all bg-background text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
                        error ? "border-red-500" : "border-border",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-xs text-foreground/50">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;