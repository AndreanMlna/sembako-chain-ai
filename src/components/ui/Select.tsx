"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Definisikan interface untuk komponen internal agar TS tidak bingung saat cloneElement
interface SelectInternalProps {
    onItemClick?: (value: string) => void;
}

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
    // Tambahan agar tidak error saat dipanggil dengan prop oleh Controller
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    error?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
    ({ value, onValueChange, children, className }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
            <div ref={selectRef} className={cn("relative", className)}>
                <div
                    className="w-full cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* PERBAIKAN: Hanya render SelectTrigger di sini */}
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child) && child.type === SelectTrigger) {
                            return child;
                        }
                        return null;
                    })}
                </div>
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {React.Children.map(children, (child) => {
                            // PERBAIKAN: Hanya render SelectContent di dalam dropdown
                            if (React.isValidElement(child) && child.type === SelectContent) {
                                const contentChild = child as React.ReactElement<SelectInternalProps>;
                                return React.cloneElement(contentChild, {
                                    onItemClick: (itemValue: string) => {
                                        onValueChange?.(itemValue);
                                        setIsOpen(false);
                                    }
                                });
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button" // Mencegah form auto-submit
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }
);

SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
}

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
    return <span className="text-slate-300">{children || placeholder}</span>;
};

interface SelectContentProps {
    children: React.ReactNode;
    onItemClick?: (value: string) => void;
}

const SelectContent = ({ children, onItemClick }: SelectContentProps) => {
    return (
        <div className="p-1">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SelectItem) {
                    const itemChild = child as React.ReactElement<SelectItemProps>;
                    return React.cloneElement(itemChild, {
                        onClick: () => onItemClick?.(itemChild.props.value)
                    });
                }
                return child;
            })}
        </div>
    );
};

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
}

const SelectItem = forwardRef<HTMLButtonElement, SelectItemProps>(
    ({ className, value, children, onClick, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button" // Mencegah form auto-submit
                className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 text-slate-300",
                    className
                )}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
export default Select;