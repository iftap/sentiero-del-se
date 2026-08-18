"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
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
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from "lucide-react";

// ──────────────────────────────────────────────────
// Navigation items
// ──────────────────────────────────────────────────

const PRIMARY_NAV = [
  { name: "Home",      href: "/home",      icon: Home },
  { name: "Growth",    href: "/growth",    icon: Sprout },
  { name: "Study",     href: "/study",     icon: GraduationCap },
  { name: "Knowledge", href: "/knowledge", icon: BookOpen },
  { name: "Finance",   href: "/finance",   icon: Wallet },
  { name: "Career",    href: "/career",    icon: Briefcase },
  { name: "Memories",  href: "/memories",  icon: Camera },
  { name: "Media",     href: "/media",     icon: Clapperboard },
  { name: "Calendar",  href: "/calendar",  icon: CalendarDays },
  { name: "News",      href: "/news",      icon: Newspaper },
  { name: "Settings",  href: "/settings",  icon: Settings },
];

// Primary mobile tabs (the 5 most important)
const MOBILE_PRIMARY = ["Home", "Growth", "Calendar", "News", "More"];

// ──────────────────────────────────────────────────
// Theme helper
// ──────────────────────────────────────────────────

function getStoredTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

// ──────────────────────────────────────────────────
// DESKTOP SIDEBAR
// ──────────────────────────────────────────────────

export function DesktopSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(getStoredTheme);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out",
        "border-r border-[var(--border-subtle)] bg-[var(--glass-surface-heavy)]",
        "backdrop-filter backdrop-blur-[24px] -webkit-backdrop-filter",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Brand header */}
      <div
        className={cn(
          "flex items-center border-b border-[var(--border-subtle)] shrink-0",
          collapsed ? "justify-center h-[60px] px-0" : "gap-3 h-[60px] px-5"
        )}
      >
        {!collapsed && (
          <>
            <div className="w-7 h-7 rounded-md bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/30 flex items-center justify-center shrink-0">
              <span className="font-serif text-[var(--accent-blue)] text-sm font-semibold">S</span>
            </div>
            <div className="min-w-0">
              <p className="font-serif text-[13px] font-medium text-[var(--text-primary)] truncate leading-tight">
                Sentiero del Sé
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)] leading-tight">
                Personal OS
              </p>
            </div>
          </>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/30 flex items-center justify-center">
            <span className="font-serif text-[var(--accent-blue)] text-sm font-semibold">S</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {PRIMARY_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md transition-all duration-150 group relative",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5",
                isActive
                  ? "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                )}
              />
              {!collapsed && (
                <span className="font-sans text-[13px] font-medium truncate">{item.name}</span>
              )}
              {/* Active indicator dot */}
              {isActive && collapsed && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[var(--accent-blue)] opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="shrink-0 border-t border-[var(--border-subtle)] p-2 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={cn(
            "flex items-center gap-3 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors w-full",
            collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5"
          )}
        >
          {theme === "dark" ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
          {!collapsed && <span className="font-sans text-[13px]">{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-3 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors w-full",
            collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5"
          )}
        >
          {collapsed ? <ChevronRight size={16} className="shrink-0" /> : <ChevronLeft size={16} className="shrink-0" />}
          {!collapsed && <span className="font-sans text-[13px]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────────
// MOBILE BOTTOM NAVIGATION
// ──────────────────────────────────────────────────

const MOBILE_NAV_ITEMS = PRIMARY_NAV.filter((item) =>
  ["Home", "Growth", "Calendar", "News"].includes(item.name)
);

export function MobileNavigation() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Close "more" panel on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {/* More panel overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* More panel sheet */}
      {moreOpen && (
        <div className="fixed bottom-[72px] left-0 right-0 z-50 md:hidden animate-fade-up">
          <div className="mx-4 glass-card-heavy border border-[var(--border-strong)] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                All Sections
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-0 p-2">
              {PRIMARY_NAV.filter((item) =>
                !["Home", "Growth", "Calendar", "News"].includes(item.name)
              ).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-sans text-[11px] font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[var(--border-subtle)] bg-[var(--glass-surface-heavy)] backdrop-blur-[20px] -webkit-backdrop-filter"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center h-16">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors",
                  isActive ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                <span className="font-sans text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors",
              moreOpen ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"
            )}
          >
            <MoreHorizontal size={20} strokeWidth={moreOpen ? 2.5 : 1.75} />
            <span className="font-sans text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
