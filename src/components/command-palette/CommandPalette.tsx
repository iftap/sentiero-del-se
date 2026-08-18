"use client";

import React, { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  Sprout,
  GraduationCap,
  BookOpen,
  Wallet,
  Briefcase,
  Camera,
  Clapperboard,
  CalendarDays,
  Newspaper,
  Settings,
  CheckSquare,
  Target,
  X,
  ArrowRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAVIGATION_COMMANDS = [
  { id: "nav-home",      label: "Go to Home",      href: "/home",      icon: Home },
  { id: "nav-growth",    label: "Go to Growth",    href: "/growth",    icon: Sprout },
  { id: "nav-study",     label: "Go to Study",     href: "/study",     icon: GraduationCap },
  { id: "nav-knowledge", label: "Go to Knowledge", href: "/knowledge", icon: BookOpen },
  { id: "nav-finance",   label: "Go to Finance",   href: "/finance",   icon: Wallet },
  { id: "nav-career",    label: "Go to Career",    href: "/career",    icon: Briefcase },
  { id: "nav-memories",  label: "Go to Memories",  href: "/memories",  icon: Camera },
  { id: "nav-media",     label: "Go to Media",     href: "/media",     icon: Clapperboard },
  { id: "nav-calendar",  label: "Go to Calendar",  href: "/calendar",  icon: CalendarDays },
  { id: "nav-news",      label: "Go to News",      href: "/news",      icon: Newspaper },
  { id: "nav-settings",  label: "Go to Settings",  href: "/settings",  icon: Settings },
];

const ACTION_COMMANDS = [
  { id: "new-task",  label: "New Task",  subtitle: "Create a task in Growth",  href: "/growth?tab=tasks&new=1",  icon: CheckSquare },
  { id: "new-goal",  label: "New Goal",  subtitle: "Create a goal in Growth",  href: "/growth?tab=goals&new=1",  icon: Target },
  { id: "new-habit", label: "New Habit", subtitle: "Track a behavior change",   href: "/growth?tab=habits&new=1", icon: Plus },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const allCommands = [
    ...ACTION_COMMANDS.map((c) => ({ ...c, group: "actions" })),
    ...NAVIGATION_COMMANDS.map((c) => ({ ...c, group: "navigation", subtitle: undefined })),
  ];

  const filteredCommands = query.trim()
    ? allCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  const actionCommands = filteredCommands.filter((c) => c.group === "actions");
  const navCommands = filteredCommands.filter((c) => c.group === "navigation");

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  const handleSelect = useCallback(
    (href: string) => {
      handleClose();
      startTransition(() => {
        router.push(href);
      });
    },
    [handleClose, router]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleClose, handleSelect]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let globalIndex = 0;

  const renderCommand = (cmd: (typeof allCommands)[0]) => {
    const idx = globalIndex++;
    const isSelected = idx === selectedIndex;
    const Icon = cmd.icon;
    return (
      <button
        key={cmd.id}
        onClick={() => handleSelect(cmd.href)}
        onMouseEnter={() => setSelectedIndex(idx)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
          isSelected
            ? "bg-[var(--accent-blue-bg)] text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
        )}
      >
        <Icon
          size={16}
          className={cn(
            "shrink-0",
            isSelected ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-medium truncate">{cmd.label}</p>
          {"subtitle" in cmd && cmd.subtitle && (
            <p className="font-sans text-xs text-[var(--text-muted)] truncate mt-0.5">
              {cmd.subtitle}
            </p>
          )}
        </div>
        {isSelected && (
          <ArrowRight size={14} className="shrink-0 text-[var(--accent-blue)] opacity-60" />
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-[560px] glass-card-heavy border border-[var(--border-strong)] shadow-[var(--shadow-elevated)] animate-scale-in overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search size={16} className="shrink-0 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or navigate…"
            className="flex-1 bg-transparent font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-ghost)] outline-none"
          />
          <button
            onClick={handleClose}
            className="shrink-0 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-sans text-sm text-[var(--text-muted)]">
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {actionCommands.length > 0 && (
                <div>
                  <p className="section-label px-4 pt-2 pb-1">Quick Actions</p>
                  {actionCommands.map(renderCommand)}
                </div>
              )}
              {navCommands.length > 0 && (
                <div>
                  <p className="section-label px-4 pt-3 pb-1">Navigate</p>
                  {navCommands.map(renderCommand)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] flex items-center gap-4">
          <span className="font-mono text-[10px] text-[var(--text-ghost)]">
            <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded text-[9px]">↑↓</kbd>
            {" "}navigate
          </span>
          <span className="font-mono text-[10px] text-[var(--text-ghost)]">
            <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded text-[9px]">↵</kbd>
            {" "}select
          </span>
          <span className="font-mono text-[10px] text-[var(--text-ghost)]">
            <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded text-[9px]">esc</kbd>
            {" "}close
          </span>
        </div>
      </div>
    </div>
  );
}
