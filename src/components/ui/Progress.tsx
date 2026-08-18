import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorColor?: string;
}

export function Progress({
  value,
  max = 100,
  className = '',
  indicatorColor = 'var(--accent-blue)'
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full h-1 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-subtle)] ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: indicatorColor,
          boxShadow: `0 0 8px ${indicatorColor}`
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
