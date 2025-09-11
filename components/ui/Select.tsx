import React from 'react';

export function Select({
  className = '',
  children,
  ...props
}: {
  className?: string;
  [key: string]: any;
}) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-md border outline-none transition-colors
        bg-[var(--color-input)] text-[var(--color-foreground)]
        border-[var(--color-border)] focus:border-[var(--color-primary)]
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
