"use client";

import React from "react";
import { Search, Command } from "lucide-react";

interface TopHeaderProps {
  userName?: string;
  onOpenCommandPalette: () => void;
}

export function TopHeader({ onOpenCommandPalette }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full h-14 flex items-center justify-end px-4 md:px-8">
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--glass-surface)] border border-[var(--glass-border)] hover:bg-[var(--bg-elevated)] transition-all text-sm text-[var(--text-muted)] group backdrop-blur-md cursor-pointer"
      >
        <Search size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
        <span className="font-sans group-hover:text-[var(--text-secondary)] transition-colors hidden sm:inline">Search or type a command...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded border border-[var(--border-strong)] text-[var(--text-secondary)]">
          <Command size={10} />K
        </kbd>
      </button>
    </header>
  );
}
