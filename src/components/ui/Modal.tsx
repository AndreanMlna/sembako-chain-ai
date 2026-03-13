"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
                                isOpen,
                                onClose,
                                title,
                                children,
                                className,
                              }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay - Background Gelap Transparan */}
        <div
            className="absolute inset-0 bg-sembako-darkest/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        />

        {/* Modal Content - Ganti ke bg-card */}
        <div
            className={cn(
                "relative z-10 w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border animate-in zoom-in duration-300",
                className
            )}
        >
          {/* Header Modal */}
          <div className="mb-5 flex items-center justify-between">
            {title ? (
                <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
            ) : (
                <div />
            )}
            <button
                onClick={onClose}
                className="rounded-full p-2 text-foreground/40 hover:bg-foreground/10 hover:text-foreground transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Modal */}
          <div className="text-foreground">
            {children}
          </div>
        </div>
      </div>
  );
}