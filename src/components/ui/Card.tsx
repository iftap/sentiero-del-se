import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glass-heavy" | "cinematic" | "transparent";
}

export function Card({
  className,
  variant = "glass",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]",
    glass:
      "glass-card",
    "glass-heavy":
      "glass-card-heavy",
    cinematic:
      "glass-card relative overflow-hidden",
    transparent:
      "bg-transparent",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] p-5 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 mb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2 font-mono",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[var(--text-muted)]", className)}
      {...props}
    >
      {children}
    </p>
  );
}
