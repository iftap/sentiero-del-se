"use client";

import React, { useState, useTransition } from "react";
import { GrowthAssessment, GrowthDimension } from "@/lib/types";
import { formatEnglishDate } from "@/lib/utils";
import {
  createAssessmentAction,
  createDimensionAction,
} from "@/features/growth/actions";
import {
  BookOpen,
  Plus,
  X,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AssessmentsViewProps {
  assessments: GrowthAssessment[];
  dimensions: GrowthDimension[];
}

export function AssessmentsView({
  assessments,
  dimensions,
}: AssessmentsViewProps) {
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [newDimName, setNewDimName] = useState("");
  const [newDimDesc, setNewDimDesc] = useState("");
  const [dimensionReflections, setDimensionReflections] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();

  const handleCreateDimension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDimName.trim()) return;

    startTransition(async () => {
      await createDimensionAction(newDimName, newDimDesc);
      setNewDimName("");
      setNewDimDesc("");
      setShowDimensionModal(false);
    });
  };

  const handleCreateAssessment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dimensionEntries = dimensions.map((dim) => ({
      dimensionId: dim.id,
      reflection: dimensionReflections[dim.id] || "",
    }));

    startTransition(async () => {
      await createAssessmentAction({
        currentState: (formData.get("currentState") as string) || undefined,
        whatChanged: (formData.get("whatChanged") as string) || undefined,
        cause: (formData.get("cause") as string) || undefined,
        evidence: (formData.get("evidence") as string) || undefined,
        stillNeeds: (formData.get("stillNeeds") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
        dimensionEntries,
      });
      setShowNewAssessmentModal(false);
      setDimensionReflections({});
    });
  };

  return (
    <div className="space-y-8">
      {/* Top action bar & Dimension overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-serif italic text-xs text-[var(--text-muted)]">
            Manual, qualitative self-assessments based on evidence and user-defined dimensions. No numerical scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDimensionModal(true)}
            className="btn-ghost text-xs"
          >
            <Layers size={13} />
            <span>Manage Dimensions</span>
          </button>

          <button
            onClick={() => setShowNewAssessmentModal(true)}
            className="btn-primary text-xs"
          >
            <Plus size={14} />
            <span>New Self-Assessment</span>
          </button>
        </div>
      </div>

      {/* Tracked Dimensions Chips */}
      <div className="p-4 rounded-xl glass-card flex flex-wrap items-center gap-2.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mr-2">
          Active Dimensions:
        </span>
        {dimensions.length === 0 ? (
          <span className="text-xs font-sans text-[var(--text-muted)]">
            No custom dimensions yet (e.g. Discipline, Focus, Patience).
          </span>
        ) : (
          dimensions.map((dim) => (
            <span
              key={dim.id}
              className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-sans text-[var(--text-secondary)]"
            >
              {dim.name}
            </span>
          ))
        )}
      </div>

      {/* Historical Assessments List */}
      {assessments.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <div className="empty-state-icon">
            <BookOpen size={24} />
          </div>
          <h3 className="font-serif text-lg text-[var(--text-primary)]">
            No self-assessments logged
          </h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Reflect on what changed, what caused the change, and real evidence of your development.
          </p>
          <button
            onClick={() => setShowNewAssessmentModal(true)}
            className="btn-primary text-xs mt-2"
          >
            Begin First Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="p-6 sm:p-8 rounded-2xl glass-card space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <span className="badge badge-amber">Self-Growth Assessment</span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {formatEnglishDate(new Date(assessment.createdAt))}
                  </span>
                </div>
              </div>

              {/* Assessment Main Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessment.currentState && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-blue)]">
                      1. Current State & Perception
                    </span>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)]/60 p-3 rounded-xl border border-[var(--border-subtle)]">
                      {assessment.currentState}
                    </p>
                  </div>
                )}

                {assessment.whatChanged && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-amber)]">
                      2. What Changed Since Last Time?
                    </span>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)]/60 p-3 rounded-xl border border-[var(--border-subtle)]">
                      {assessment.whatChanged}
                    </p>
                  </div>
                )}

                {assessment.cause && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--wolf-silver)]">
                      3. Underlying Cause of the Change
                    </span>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)]/60 p-3 rounded-xl border border-[var(--border-subtle)]">
                      {assessment.cause}
                    </p>
                  </div>
                )}

                {assessment.evidence && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-success)]">
                      4. Concrete Real-World Evidence
                    </span>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)]/60 p-3 rounded-xl border border-[var(--border-subtle)]">
                      {assessment.evidence}
                    </p>
                  </div>
                )}
              </div>

              {/* Dimension Reflections */}
              {assessment.dimensionEntries?.length > 0 && (
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                    Dimensions Reflection
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {assessment.dimensionEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1"
                      >
                        <p className="font-sans text-xs font-medium text-[var(--text-primary)]">
                          {entry.dimension?.name || "Dimension"}
                        </p>
                        <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                          {entry.reflection}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What Still Needs Improvement */}
              {assessment.stillNeeds && (
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-amber)] block mb-1">
                    What Still Needs Improvement
                  </span>
                  <p className="font-serif italic text-xs text-[var(--text-primary)]">
                    &ldquo;{assessment.stillNeeds}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Assessment Modal */}
      {showNewAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl max-h-[90vh] glass-card-heavy rounded-2xl border border-[var(--border-strong)] flex flex-col shadow-[var(--shadow-elevated)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <span className="section-label">Qualitative Reflection</span>
                <h3 className="font-serif text-lg font-medium text-[var(--text-primary)] mt-0.5">
                  Self-Growth Assessment
                </h3>
              </div>
              <button
                onClick={() => setShowNewAssessmentModal(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-blue)] block mb-1">
                  1. Current State — How am I doing overall?
                </label>
                <textarea
                  name="currentState"
                  placeholder="Reflect on your present emotional, mental, and developmental state..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-amber)] block mb-1">
                  2. What has changed since previous assessment?
                </label>
                <textarea
                  name="whatChanged"
                  placeholder="Notice shifts in mindset, habits, or capabilities..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--wolf-silver)] block mb-1">
                  3. Cause — What caused this change?
                </label>
                <textarea
                  name="cause"
                  placeholder="Specific actions, books, milestones, or external events..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-success)] block mb-1">
                  4. Evidence — What have I actually done?
                </label>
                <textarea
                  name="evidence"
                  placeholder="Concrete milestones, tasks, notes, or achievements..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              {/* Per-Dimension Reflections */}
              {dimensions.length > 0 && (
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                    Dimensions Reflection
                  </span>
                  <div className="space-y-2.5">
                    {dimensions.map((dim) => (
                      <div key={dim.id} className="space-y-1">
                        <label className="font-sans text-xs font-medium text-[var(--text-secondary)] block">
                          {dim.name}
                        </label>
                        <input
                          type="text"
                          value={dimensionReflections[dim.id] || ""}
                          onChange={(e) =>
                            setDimensionReflections((prev) => ({
                              ...prev,
                              [dim.id]: e.target.value,
                            }))
                          }
                          placeholder={`Observations regarding ${dim.name.toLowerCase()}...`}
                          className="form-input text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  What still needs improvement?
                </label>
                <textarea
                  name="stillNeeds"
                  placeholder="Focus areas for your next phase..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewAssessmentModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  {isPending ? "Recording..." : "Save Assessment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Dimensions Modal */}
      {showDimensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Add Growth Dimension
              </h3>
              <button
                onClick={() => setShowDimensionModal(false)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDimension} className="space-y-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Dimension Name *
                </label>
                <input
                  type="text"
                  value={newDimName}
                  onChange={(e) => setNewDimName(e.target.value)}
                  placeholder="e.g. Emotional Intelligence, Patience, Craft..."
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDimDesc}
                  onChange={(e) => setNewDimDesc(e.target.value)}
                  placeholder="Short definition of this growth area..."
                  className="form-input text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDimensionModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Dimension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
