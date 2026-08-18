"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Moon, Sun, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "Today",      href: "/oggi",        isImplemented: true  },
  { name: "Direction",  href: "/direzione",   isImplemented: false },
  { name: "Growth",     href: "/crescita",    isImplemented: false },
  { name: "Management", href: "/gestione",    isImplemented: false },
  { name: "Reflection", href: "/riflessione", isImplemented: false },
  { name: "AI Vision",  href: "/visione-ai",  isImplemented: false },
];

interface TopNavigationProps {
  onOpenCommandPalette: () => void;
}

export function TopNavigation({ onOpenCommandPalette }: TopNavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Lazy initializer: reads localStorage synchronously on first render (client only)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <>
      <header
        className={cn(
          "top-nav",
          scrolled && "scrolled"
        )}
        aria-label="Main navigation"
      >
        {/* Brand monogram */}
        <Link
          href="/oggi"
          className="font-serif text-base font-medium text-[var(--text-primary)] tracking-tight mr-8 shrink-0 hover:text-[var(--text-secondary)] transition-colors"
          aria-label="Sentiero del Sé — Today"
        >
          Sé
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-3 py-1.5 text-xs tracking-wider font-sans transition-colors",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
                  !item.isImplemented && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-[var(--text-primary)] opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer"
            aria-label="Open command palette"
          >
            <Search size={12} />
            <span className="font-sans">Search</span>
            <kbd className="hidden sm:inline font-mono text-[9px] opacity-60">⌘K</kbd>
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <nav
            className="absolute top-0 left-0 right-0 pt-16 pb-8 px-6 glass-card-heavy border-b border-[var(--border-subtle)]"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-3 text-sm font-sans border-b border-[var(--border-subtle)] last:border-0",
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]",
                    !item.isImplemented && "opacity-40 pointer-events-none"
                  )}
                >
                  <span>{item.name}</span>
                  {!item.isImplemented && (
                    <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
