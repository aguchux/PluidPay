import React from 'react';

export function Label({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <label
      className={`block mb-1 text-sm font-medium text-[var(--color-secondary-foreground)] ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
