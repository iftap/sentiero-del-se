"use client";

import React, { useState, useTransition } from "react";
import {
  createCareerEventAction,
  createCareerSkillAction,
} from "@/features/career/actions";
import { formatEnglishDate, formatShortDate } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  X,
  Award,
  Terminal,
  Calendar,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface CareerShellProps {
  careerEvents: any[];
  careerSkills: any[];
  careerGoals: any[];
}

export function CareerShell({
  careerEvents,
  careerSkills,
  careerGoals,
}: CareerShellProps) {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createCareerEventAction(fd);
      setShowNewEventModal(false);
    });
  };

  const handleCreateSkill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createCareerSkillAction(fd);
      setShowNewSkillModal(false);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── LEFT 2 COLS: PRIMARY CAREER TIMELINE (HERO) ── */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="section-label">Manual Journey Timeline</span>
            <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)] mt-0.5">
              Career Timeline
            </h2>
          </div>
          <button
            onClick={() => setShowNewEventModal(true)}
            className="btn-primary text-xs"
          >
            <Plus size={13} />
            <span>Add Career Event</span>
          </button>
        </div>

        {careerEvents.length === 0 ? (
          <div className="empty-state glass-card rounded-2xl">
            <Briefcase size={28} className="text-[var(--text-muted)]" />
            <h3 className="font-serif text-lg text-[var(--text-primary)]">
              Your career journey starts here
            </h3>
            <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
              Record promotions, pivotal projects, role transitions, or public launches manually.
            </p>
            <button
              onClick={() => setShowNewEventModal(true)}
              className="btn-primary text-xs mt-2"
            >
              Add First Milestone
            </button>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6">
            {/* Timeline Line */}
            <div className="absolute left-2.5 top-3 bottom-3 w-px bg-gradient-to-b from-[var(--accent-blue)] via-[var(--border-subtle)] to-transparent" />

            {careerEvents.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-4 group">
                <div className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--accent-blue)] flex items-center justify-center shrink-0 -ml-[23px] z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />
                </div>

                <div className="flex-1 p-5 rounded-2xl glass-card space-y-2 hover:border-[var(--border-strong)] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="badge badge-blue text-[10px]">
                      {evt.type || "Career Milestone"}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {formatEnglishDate(new Date(evt.date))}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                    {evt.title}
                  </h3>

                  {evt.description && (
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT 1 COL: SKILLS & CAREER GOALS ── */}
      <div className="space-y-8">
        {/* Career Goals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-[var(--text-primary)]">
              Career Goals
            </h3>
            <Link
              href="/growth?tab=goals"
              className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
            >
              <span>Manage in Growth</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          {careerGoals.length === 0 ? (
            <div className="p-4 rounded-xl glass-card text-xs font-sans text-[var(--text-muted)] text-center">
              No career-specific goals. Create goals with type &ldquo;Career&rdquo; in the Growth module.
            </div>
          ) : (
            <div className="space-y-3">
              {careerGoals.map((cg) => (
                <div key={cg.id} className="p-4 rounded-xl glass-card space-y-2">
                  <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                    {cg.title}
                  </h4>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${cg.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
                    <span>{cg.progressPercent}%</span>
                    <span>{cg.milestones.length} Milestones</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Inventory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-[var(--text-primary)]">
              Skills Profile
            </h3>
            <button
              onClick={() => setShowNewSkillModal(true)}
              className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Add Skill</span>
            </button>
          </div>

          {careerSkills.length === 0 ? (
            <div className="p-4 rounded-xl glass-card text-xs font-sans text-[var(--text-muted)] text-center">
              No skills logged yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {careerSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-sans flex items-center gap-2"
                >
                  <span className="font-medium text-[var(--text-primary)]">{sk.name}</span>
                  {sk.level && (
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      ({sk.level})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Career Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Add Career Timeline Event
              </h3>
              <button
                onClick={() => setShowNewEventModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <input
                name="title"
                type="text"
                placeholder="Title (e.g. Promoted to Staff Engineer)..."
                className="form-input text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="type"
                  type="text"
                  placeholder="Type (e.g. Promotion, Project)..."
                  className="form-input text-xs"
                />
                <input name="date" type="date" className="form-input text-xs" />
              </div>
              <textarea
                name="description"
                placeholder="Details of the event or accomplishment..."
                className="form-input text-xs resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
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

      {/* New Skill Modal */}
      {showNewSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Add Skill
              </h3>
              <button
                onClick={() => setShowNewSkillModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSkill} className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Skill name (e.g. TypeScript, System Design)..."
                className="form-input text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="level"
                  type="text"
                  placeholder="Level (e.g. Expert, Proficient)..."
                  className="form-input text-xs"
                />
                <input
                  name="category"
                  type="text"
                  placeholder="Category (e.g. Backend)..."
                  className="form-input text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewSkillModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
