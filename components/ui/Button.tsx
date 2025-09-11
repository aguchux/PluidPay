import React from 'react';

export function Button({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium hover:ring transition-colors cursor-pointer
        bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
        hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]
        focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
