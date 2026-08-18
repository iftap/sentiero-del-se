"use client";

import React, { useState, useTransition } from "react";
import { MilestoneEvent, MilestoneEventType } from "@/lib/types";
import { formatShortDate, formatEnglishDate, cn } from "@/lib/utils";
import { addMilestoneNoteAction } from "@/features/growth/actions";
import {
  Sparkles,
  CheckCircle,
  TrendingUp,
  FileText,
  RefreshCw,
  Award,
  Link as LinkIcon,
  Circle,
  Plus,
  X,
  History,
} from "lucide-react";

interface MilestoneJourneyProps {
  milestoneId: string;
  milestoneTitle: string;
  isCompleted: boolean;
  events: MilestoneEvent[];
  onClose: () => void;
}

function getEventIcon(type: MilestoneEventType) {
  switch (type) {
    case "CREATED":
      return <Circle size={14} className="text-[var(--text-muted)]" />;
    case "TASK_COMPLETED":
      return <CheckCircle size={14} className="text-[var(--status-success)]" />;
    case "PROGRESS_CHANGED":
      return <TrendingUp size={14} className="text-[var(--accent-blue)]" />;
    case "NOTE_ADDED":
      return <FileText size={14} className="text-[var(--accent-amber)]" />;
    case "HABIT_CHANGED":
      return <RefreshCw size={14} className="text-[var(--accent-blue-soft)]" />;
    case "COMPLETED":
      return <Award size={14} className="text-[var(--accent-amber)]" />;
    case "TASK_LINKED":
      return <LinkIcon size={14} className="text-[var(--text-muted)]" />;
    default:
      return <Circle size={14} className="text-[var(--text-muted)]" />;
  }
}

export function MilestoneJourney({
  milestoneId,
  milestoneTitle,
  isCompleted,
  events,
  onClose,
}: MilestoneJourneyProps) {
  const [noteText, setNoteText] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sort events chronologically (oldest first for journey timeline)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    startTransition(async () => {
      await addMilestoneNoteAction(milestoneId, noteText);
      setNoteText("");
      setShowAddNote(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[85vh] glass-card-heavy rounded-2xl border border-[var(--border-strong)] flex flex-col shadow-[var(--shadow-elevated)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-start justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-amber-bg)] border border-[var(--accent-amber)]/30 flex items-center justify-center text-[var(--accent-amber)]">
              <History size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="section-label">Milestone Journey</span>
                {isCompleted && (
                  <span className="badge badge-success text-[9px]">Achieved</span>
                )}
              </div>
              <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
                {milestoneTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Journey Timeline Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="font-serif italic text-xs text-[var(--text-muted)]">
            A chronological timeline of real actions, task completions, and reflections that shaped this milestone.
          </p>

          {sortedEvents.length === 0 ? (
            <div className="py-12 text-center text-sm font-sans text-[var(--text-muted)]">
              No historical events recorded yet for this milestone.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6">
              {/* Vertical connecting line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent-blue)] via-[var(--border-subtle)] to-[var(--accent-amber)]" />

              {sortedEvents.map((evt) => (
                <div key={evt.id} className="relative flex items-start gap-4 group">
                  {/* Timeline node icon */}
                  <div className="w-5 h-5 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 -ml-[23px] z-10 group-hover:border-[var(--accent-blue)] transition-colors">
                    {getEventIcon(evt.type)}
                  </div>

                  {/* Event content box */}
                  <div className="flex-1 p-3.5 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-blue)] font-medium">
                        {evt.type.replace("_", " ")}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-ghost)]">
                        {formatEnglishDate(new Date(evt.createdAt))}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[var(--text-primary)] leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline Note Addition */}
          {showAddNote ? (
            <form
              onSubmit={handleAddNote}
              className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-strong)] space-y-3 animate-scale-in"
            >
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                Record an observation or shift in approach
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write milestone reflection or update..."
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-2.5 font-sans text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-amber)] resize-none"
                rows={3}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary text-xs"
                >
                  {isPending ? "Recording..." : "Save to Journey"}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full py-3 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-[var(--accent-amber)] text-xs font-sans text-[var(--text-muted)] hover:text-[var(--accent-amber)] flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={14} />
              <span>Add Reflection to Journey</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex justify-end">
          <button onClick={onClose} className="btn-ghost text-xs">
            Close Journey
          </button>
        </div>
      </div>
    </div>
  );
}
