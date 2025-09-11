import React from 'react';

export function Card({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div
      className={`rounded-lg shadow-md p-4 bg-[var(--color-background)] border border-[var(--color-border)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
