'use client';

import React, { useState } from 'react';

export function ProgressButton({
  children,
  className = '',
  duration = 2000, // milliseconds for fill animation
  onComplete,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  onComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animating) return;
    setAnimating(true);
    setProgress(0);

    // Animate progress
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimating(false);
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <button
      className={`relative cursor-pointer overflow-hidden px-4 py-2 rounded-md hover:ring-1 font-medium transition-colors
        bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
        hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]
        focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={animating}
      onClick={handleClick}
      {...props}
    >
      {/* Fill bar */}
      <span
        aria-hidden={true}
        className="absolute left-0 top-0 h-full"
        style={{
          width: `${progress * 100}%`,
          background: 'var(--color-accent)',
          opacity: 0.25,
          transition: animating ? 'none' : 'width 0.2s',
          zIndex: 0,
        }}
      />
      {/* Button text */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
