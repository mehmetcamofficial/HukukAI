import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-semibold tracking-tight sm:text-lg">{title}</h1>
          {children}
        </div>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
