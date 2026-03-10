import { type LucideIcon, PackageOpen } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Button from "@/components/ui/Button";

const icons = LucideIcons as unknown as Record<string, LucideIcon>;

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "PackageOpen",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const IconComponent = icons[icon] || PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <IconComponent className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
