import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "amber" | "warning" | "error" | "subtle" | "success";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    blue:
      "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] border border-[var(--accent-blue)]/15",
    amber:
      "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)] border border-[var(--accent-amber)]/15",
    warning:
      "bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/15",
    error:
      "bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[var(--status-error)]/15",
    success:
      "bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success)]/15",
    subtle:
      "bg-transparent text-[var(--text-muted)] border border-transparent",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 rounded-[var(--radius-sm)]",
    md: "text-xs px-2 py-0.5 rounded-[var(--radius-full)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium select-none tracking-tight font-mono",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
