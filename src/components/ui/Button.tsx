import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "glow" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-blue)]/30";

    const variantStyles = {
      primary:
        "bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 active:scale-[0.98]",
      secondary:
        "bg-[var(--glass-surface)] text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] backdrop-blur-sm shadow-xs",
      ghost:
        "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]",
      accent:
        "bg-[var(--accent-blue)] text-[#05090C] hover:opacity-90 active:scale-[0.98] font-semibold",
      glow:
        "bg-[var(--accent-blue)] text-[#05090C] hover:opacity-90 active:scale-[0.98] font-semibold shadow-[0_0_20px_rgba(140,199,232,0.2)]",
      danger:
        "bg-[var(--status-error-bg)] text-[var(--status-error)] hover:bg-[var(--status-error)] hover:text-white",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1 rounded-[var(--radius-sm)] gap-1.5",
      md: "text-sm px-3.5 py-1.5 rounded-[var(--radius-md)] gap-2",
      lg: "text-base px-5 py-2.5 rounded-[var(--radius-lg)] gap-2.5",
      icon: "h-8 w-8 p-0 rounded-[var(--radius-md)]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
