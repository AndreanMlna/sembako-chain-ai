"use client";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
                                     title,
                                     description,
                                     action,
                                   }: PageHeaderProps) {
  return (
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in duration-500">
        <div>
          {/* text-gray-900 GANTI JADI text-foreground */}
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
          {description && (
              /* text-gray-500 GANTI JADI text-foreground/60 */
              <p className="mt-1 text-sm text-foreground/60">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
  );
}