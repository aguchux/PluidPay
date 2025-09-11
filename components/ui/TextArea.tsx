import React from 'react';

export function TextArea({ className = '', ...props }: { className?: string; [key: string]: any }) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded-md border outline-none transition-colors
        bg-[var(--color-input)] text-[var(--color-foreground)]
        border-[var(--color-border)] focus:border-[var(--color-primary)]
        placeholder:text-[var(--color-muted-foreground)]
        ${className}
      `}
      {...props}
    />
  );
}
