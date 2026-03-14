import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-foreground/10 text-foreground",
    success: "bg-primary/20 text-primary border border-primary/20",
    warning: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
    danger: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20",
    info: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
