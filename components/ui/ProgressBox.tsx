'use client';

import React, { useState } from 'react';

export function ProgressBox({
  children,
  className = '',
  duration = 2000,
  fill = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  fill?: boolean;
  duration?: number;
  onComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  React.useEffect(() => {
    if (!fill) {
      setProgress(0);
      return;
    }
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
      }
    };
    requestAnimationFrame(step);
  }, [fill, duration]);

  return (
    <div
      className={`
        ${className}
      `}
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
      <span className="relative">{children}</span>
    </div>
  );
}
