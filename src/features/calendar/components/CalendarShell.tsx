"use client";

import React, { useState, useTransition } from "react";
import { createCalendarEventAction } from "@/features/calendar/actions";
import { formatEnglishDate, formatRelativeDate, cn } from "@/lib/utils";
import {
  CalendarDays,
  Plus,
  X,
  Clock,
  CheckCircle2,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface CalendarItem {
  id: string;
  title: string;
  date: Date;
  time?: string | null;
  type: "Event" | "Task" | "Milestone" | "Goal";
  href: string;
  status?: string;
}

interface CalendarShellProps {
  items: CalendarItem[];
}

export function CalendarShell({ items }: CalendarShellProps) {
  const [showModal, setShowModal] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [isPending, startTransition] = useTransition();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const upcomingItems = items
    .filter((i) => new Date(i.date) >= todayStart)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastItems = items
    .filter((i) => new Date(i.date) < todayStart)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayItems = showPast ? pastItems : upcomingItems;

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createCalendarEventAction(fd);
      setShowModal(false);
    });
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Event":
        return "badge-muted";
      case "Task":
        return "badge-amber";
      case "Milestone":
        return "badge-blue";
      case "Goal":
        return "badge-success";
      default:
        return "badge-muted";
    }
  };

  return (
    <div className="space-y-8">
      {/* Action and Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPast(false)}
            className={cn(
              "px-3.5 py-1.5 rounded-full font-sans text-xs font-medium transition-colors cursor-pointer",
              !showPast
                ? "bg-[var(--accent-blue)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Upcoming ({upcomingItems.length})
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={cn(
              "px-3.5 py-1.5 rounded-full font-sans text-xs font-medium transition-colors cursor-pointer",
              showPast
                ? "bg-[var(--accent-blue)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Past History ({pastItems.length})
          </button>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs shrink-0">
          <Plus size={13} />
          <span>New Standalone Event</span>
        </button>
      </div>

      {/* Unified Chronological Agenda Timeline */}
      {displayItems.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <CalendarDays size={32} className="text-[var(--text-muted)]" />
          <h3 className="font-serif text-lg text-[var(--text-primary)]">
            {showPast ? "No past events recorded" : "Nothing scheduled ahead"}
          </h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Calendar automatically aggregates task deadlines, milestone deadlines, and standalone events chronologically.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2.5 top-3 bottom-3 w-px bg-gradient-to-b from-[var(--accent-blue)] via-[var(--border-subtle)] to-transparent" />

          {displayItems.map((item) => (
            <div key={item.id} className="relative flex items-center gap-4 group">
              <div className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-strong)] flex items-center justify-center shrink-0 -ml-[23px] z-10 group-hover:border-[var(--accent-blue)] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] group-hover:bg-[var(--accent-blue)]" />
              </div>

              <Link
                href={item.href}
                className="flex-1 p-4 rounded-xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn("badge text-[9px]", getBadgeColor(item.type))}>
                    {item.type}
                  </span>
                  <span className="font-sans text-sm font-medium text-[var(--text-primary)] truncate">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)] shrink-0">
                  {item.time && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {item.time}
                    </span>
                  )}
                  <span>{formatEnglishDate(new Date(item.date))}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* New Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Add Calendar Event
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-[var(--text-muted)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Event Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Doctor appointment, Flight, Review..."
                  className="form-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Date *
                  </label>
                  <input name="date" type="date" className="form-input text-xs" required />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Time (Optional)
                  </label>
                  <input name="time" type="time" className="form-input text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
