"use client";

import React, { useState, useTransition } from "react";
import { createMemoryAction } from "@/features/memories/actions";
import { formatEnglishDate } from "@/lib/utils";
import { Camera, Plus, X, Image as ImageIcon } from "lucide-react";

interface MemoriesShellProps {
  memories: any[];
}

export function MemoriesShell({ memories }: MemoriesShellProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createMemoryAction(fd);
      setShowModal(false);
    });
  };

  return (
    <div className="space-y-8">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <p className="font-serif italic text-xs text-[var(--text-muted)]">
          A nostalgic, visual timeline of personal moments and milestones.
        </p>
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs">
          <Plus size={13} />
          <span>Capture Memory</span>
        </button>
      </div>

      {memories.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <Camera size={32} className="text-[var(--text-muted)]" />
          <h3 className="font-serif text-lg text-[var(--text-primary)]">
            Your memories live here
          </h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Preserve moments with photos, videos, and heartfelt captions.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs mt-2"
          >
            Add First Moment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[var(--border-strong)] transition-all"
            >
              {mem.photoUrl && (
                <div className="relative aspect-[4/3] w-full bg-[var(--bg-subtle)] overflow-hidden">
                  <img
                    src={mem.photoUrl}
                    alt={mem.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="font-serif italic text-base text-[var(--text-primary)] leading-relaxed">
                  &ldquo;{mem.caption}&rdquo;
                </p>

                <p className="font-mono text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
                  {formatEnglishDate(new Date(mem.date))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Record a Memory
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
                  Caption / Thought *
                </label>
                <textarea
                  name="caption"
                  placeholder="What made this moment memorable?..."
                  className="form-input text-xs resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  name="photoUrl"
                  type="url"
                  placeholder="https://..."
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Date
                </label>
                <input name="date" type="date" className="form-input text-xs" />
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
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
