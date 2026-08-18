"use client";

import React, { useState, useTransition } from "react";
import { Habit, HabitType, HabitObjective, HabitState } from "@/lib/types";
import { formatEnglishDate, cn } from "@/lib/utils";
import {
  createHabitAction,
  updateHabitStateAction,
  addHabitNoteAction,
} from "@/features/growth/actions";
import {
  Sprout,
  Plus,
  X,
  FileText,
  TrendingUp,
  ShieldCheck,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HabitsViewProps {
  habits: Habit[];
}

export function HabitsView({ habits }: HabitsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeNoteHabitId, setActiveNoteHabitId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const handleCreateHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createHabitAction(formData);
      setShowCreateModal(false);
    });
  };

  const handleStateChange = (habitId: string, newState: HabitState) => {
    startTransition(async () => {
      await updateHabitStateAction(habitId, newState);
    });
  };

  const handleAddNote = (habitId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    startTransition(async () => {
      await addHabitNoteAction(habitId, newNoteContent);
      setNewNoteContent("");
      setActiveNoteHabitId(null);
    });
  };

  const toggleExpandNotes = (habitId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
  };

  const getTypeBadge = (type: HabitType) => {
    switch (type) {
      case "GOOD":
        return <span className="badge badge-success">Good</span>;
      case "BAD":
        return <span className="badge badge-error">To Break</span>;
      case "DEVELOPING":
        return <span className="badge badge-blue">Developing</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif italic text-xs text-[var(--text-muted)]">
            Behavior-change objects with first-class qualitative observations. No forced streaks.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs">
          <Plus size={14} />
          <span>New Habit Object</span>
        </button>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <div className="empty-state-icon">
            <Sprout size={24} />
          </div>
          <h3 className="font-serif text-lg text-[var(--text-primary)]">No habits tracked yet</h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Track meaningful behaviors you wish to maintain, improve, reduce, or remove.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs mt-2"
          >
            Track First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const isNotesExpanded = expandedNotes[habit.id] ?? false;
            return (
              <div
                key={habit.id}
                className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Type, Objective, State */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(habit.type)}
                      <span className="badge badge-muted">{habit.objective}</span>
                    </div>

                    {/* State Selector */}
                    <select
                      value={habit.state}
                      onChange={(e) => handleStateChange(habit.id, e.target.value as HabitState)}
                      disabled={isPending}
                      className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-[10px] rounded px-2 py-0.5 outline-none"
                    >
                      <option value="IDENTIFIED">Identified</option>
                      <option value="EVALUATING">Evaluating</option>
                      <option value="IMPROVING">Improving</option>
                      <option value="MAINTAINING">Maintaining</option>
                      <option value="CHANGED">Changed</option>
                      <option value="REMOVED">Removed</option>
                    </select>
                  </div>

                  <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                    {habit.title}
                  </h4>

                  {habit.description && (
                    <p className="font-sans text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      {habit.description}
                    </p>
                  )}
                </div>

                {/* Notes History (First-Class Feature) */}
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleExpandNotes(habit.id)}
                      className="text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText size={13} />
                      <span>Observations ({habit.notes.length})</span>
                      {isNotesExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    <button
                      onClick={() =>
                        setActiveNoteHabitId(
                          activeNoteHabitId === habit.id ? null : habit.id
                        )
                      }
                      className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Add Note</span>
                    </button>
                  </div>

                  {/* Add Note Inline Form */}
                  {activeNoteHabitId === habit.id && (
                    <form
                      onSubmit={(e) => handleAddNote(habit.id, e)}
                      className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-strong)] space-y-2 animate-scale-in"
                    >
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="e.g. This week I avoided it 4 out of 7 days..."
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-2 font-sans text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] resize-none"
                        rows={2}
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveNoteHabitId(null)}
                          className="btn-ghost text-[11px] py-1 px-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isPending}
                          className="btn-primary text-[11px] py-1 px-2.5"
                        >
                          Save Observation
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Expanded Notes List */}
                  {isNotesExpanded && habit.notes.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {habit.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-lg bg-[var(--bg-subtle)]/60 border border-[var(--border-subtle)] text-xs font-sans space-y-1"
                        >
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {note.content}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-ghost)]">
                            {formatEnglishDate(new Date(note.createdAt))}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg glass-card-heavy rounded-2xl border border-[var(--border-strong)] flex flex-col shadow-[var(--shadow-elevated)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Track a Behavior Change
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="p-6 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Habit Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Reduce mindless screen scrolling..."
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Description / Context
                </label>
                <textarea
                  name="description"
                  placeholder="What triggers this? Why do you want to change it?..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Behavior Type
                  </label>
                  <select name="type" className="form-input text-xs" defaultValue="DEVELOPING">
                    <option value="DEVELOPING">Developing (Forming New)</option>
                    <option value="GOOD">Good (Positive Habit)</option>
                    <option value="BAD">Bad (Behavior to Reduce/Remove)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Objective
                  </label>
                  <select name="objective" className="form-input text-xs" defaultValue="IMPROVE">
                    <option value="IMPROVE">Improve</option>
                    <option value="MAINTAIN">Maintain</option>
                    <option value="REDUCE">Reduce</option>
                    <option value="REMOVE">Remove</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Initial Observation Note (Optional)
                </label>
                <textarea
                  name="initialNote"
                  placeholder="e.g. Currently doing this daily without realizing it..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  {isPending ? "Tracking..." : "Save Habit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
