import React from 'react';

export function ErrorText({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <p className={`text-sm text-[var(--color-destructive)] mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}
