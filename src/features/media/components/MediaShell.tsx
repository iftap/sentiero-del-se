"use client";

import React, { useState, useTransition } from "react";
import { createMediaEntryAction } from "@/features/media/actions";
import { formatEnglishDate } from "@/lib/utils";
import {
  BookOpen,
  Film,
  Tv,
  Music,
  Gamepad2,
  Radio,
  Plus,
  X,
  Star,
  Clapperboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaShellProps {
  mediaEntries: any[];
}

function getMediaIcon(type: string) {
  switch (type) {
    case "BOOK":
      return <BookOpen size={16} className="text-[var(--accent-amber)]" />;
    case "MOVIE":
      return <Film size={16} className="text-[var(--accent-blue)]" />;
    case "SERIES":
      return <Tv size={16} className="text-[var(--wolf-silver)]" />;
    case "MUSIC":
      return <Music size={16} className="text-[var(--status-success)]" />;
    case "GAME":
      return <Gamepad2 size={16} className="text-[var(--accent-blue-soft)]" />;
    case "PODCAST":
      return <Radio size={16} className="text-[var(--text-muted)]" />;
    default:
      return <Clapperboard size={16} />;
  }
}

export function MediaShell({ mediaEntries }: MediaShellProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createMediaEntryAction(fd);
      setShowModal(false);
    });
  };

  const filteredEntries = mediaEntries.filter((m) => {
    if (filterType === "ALL") return true;
    return m.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl text-xs font-sans">
          {[
            { id: "ALL", label: "All Journal" },
            { id: "BOOK", label: "Books" },
            { id: "MOVIE", label: "Movies" },
            { id: "SERIES", label: "Series" },
            { id: "MUSIC", label: "Music" },
            { id: "GAME", label: "Games" },
            { id: "PODCAST", label: "Podcasts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
                filterType === tab.id
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs shrink-0">
          <Plus size={13} />
          <span>Log Media Reflection</span>
        </button>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <Clapperboard size={32} className="text-[var(--text-muted)]" />
          <h3 className="font-serif text-lg text-[var(--text-primary)]">
            Start your media journal
          </h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Write naturally about books, cinema, music, or podcasts that left an impression.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-xs mt-2">
            Write First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getMediaIcon(entry.type)}
                    <span className="badge badge-muted text-[10px]">{entry.type}</span>
                    {entry.status && (
                      <span className="badge badge-blue text-[10px]">{entry.status}</span>
                    )}
                  </div>

                  {entry.rating && (
                    <div className="flex items-center gap-0.5 text-xs font-mono text-[var(--accent-amber)]">
                      <Star size={12} className="fill-[var(--accent-amber)]" />
                      <span>{entry.rating}/5</span>
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                  {entry.title}
                </h3>

                {entry.content && (
                  <p className="font-serif italic text-sm text-[var(--text-secondary)] mt-3 leading-relaxed whitespace-pre-wrap">
                    &ldquo;{entry.content}&rdquo;
                  </p>
                )}
              </div>

              <p className="font-mono text-xs text-[var(--text-ghost)] pt-3 border-t border-[var(--border-subtle)]">
                {formatEnglishDate(new Date(entry.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Log Media Experience
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Dune, The Matrix, Dark Side of the Moon..."
                  className="form-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Media Type
                  </label>
                  <select name="type" className="form-input text-xs" defaultValue="BOOK">
                    <option value="BOOK">Book</option>
                    <option value="MOVIE">Movie</option>
                    <option value="SERIES">Series</option>
                    <option value="MUSIC">Music</option>
                    <option value="GAME">Game</option>
                    <option value="PODCAST">Podcast</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Rating (1-5)
                  </label>
                  <select name="rating" className="form-input text-xs">
                    <option value="">None</option>
                    <option value="5">5 ★ (Masterpiece)</option>
                    <option value="4">4 ★ (Great)</option>
                    <option value="3">3 ★ (Good)</option>
                    <option value="2">2 ★ (Mediocre)</option>
                    <option value="1">1 ★ (Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Status (Custom label)
                </label>
                <input
                  name="status"
                  type="text"
                  placeholder="e.g. Finished, Mind-bending, In progress..."
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Free Writing Journal Space
                </label>
                <textarea
                  name="content"
                  placeholder="What thoughts or emotions did this evoke? Write naturally..."
                  className="form-input text-xs resize-none"
                  rows={4}
                />
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
