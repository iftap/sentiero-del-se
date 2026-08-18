"use client";

import React, { useState, useTransition } from "react";
import { Goal, Milestone } from "@/lib/types";
import { formatGoalType, formatShortDate, cn } from "@/lib/utils";
import { MilestoneJourney } from "./MilestoneJourney";
import {
  completeMilestoneAction,
  createMilestoneAction,
  updateGoalProgressAction,
} from "@/features/growth/actions";
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  History,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GoalDetailProps {
  goal: Goal;
}

export function GoalDetail({ goal }: GoalDetailProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("");
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleToggleMilestone = (milestoneId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await completeMilestoneAction(milestoneId, !currentStatus);
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    startTransition(async () => {
      await createMilestoneAction(goal.id, newMilestoneTitle, newMilestoneDueDate || undefined);
      setNewMilestoneTitle("");
      setNewMilestoneDueDate("");
      setShowAddMilestone(false);
    });
  };

  const completedMilestones = goal.milestones.filter((m) => m.isCompleted).length;
  const totalMilestones = goal.milestones.length;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 transition-all">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue">{formatGoalType(goal.type, goal.customType)}</span>
            <span
              className={cn(
                "badge",
                goal.status === "ACTIVE"
                  ? "badge-success"
                  : goal.status === "COMPLETED"
                  ? "badge-muted"
                  : "badge-error"
              )}
            >
              {goal.status}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[var(--text-primary)]">
            {goal.title}
          </h3>

          {goal.deadline && (
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-1.5">
              <Calendar size={13} /> Target: {formatShortDate(new Date(goal.deadline))}
            </p>
          )}
        </div>

        {/* Progress Display */}
        <div className="sm:text-right shrink-0">
          <div className="font-mono text-xl font-medium text-[var(--text-primary)]">
            {goal.progressPercent}%
          </div>
          <p className="font-sans text-xs text-[var(--text-muted)]">
            {completedMilestones} of {totalMilestones} Milestones Achieved
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${goal.progressPercent}%` }} />
      </div>

      {/* Goal Strategic Rationale: Why / Why Not / How */}
      {(goal.why || goal.whyNot || goal.how) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {goal.why && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-blue)] block mb-1">
                The Why
              </span>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {goal.why}
              </p>
            </div>
          )}

          {goal.whyNot && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-amber)] block mb-1">
                Why Not & Tradeoffs
              </span>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {goal.whyNot}
              </p>
            </div>
          )}

          {goal.how && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--wolf-silver)] block mb-1">
                The How (Strategy)
              </span>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {goal.how}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Milestones Section */}
      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--accent-blue)]" />
            <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
              Milestones & Journey
            </h4>
          </div>

          <button
            onClick={() => setShowAddMilestone(!showAddMilestone)}
            className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Add Milestone</span>
          </button>
        </div>

        {/* Add Milestone Inline Form */}
        {showAddMilestone && (
          <form
            onSubmit={handleAddMilestone}
            className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-strong)] space-y-3 animate-scale-in"
          >
            <input
              type="text"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Milestone title (e.g. Complete Phase 1)..."
              className="form-input text-xs"
              required
            />
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={newMilestoneDueDate}
                onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                className="form-input text-xs flex-1"
              />
              <button type="submit" disabled={isPending} className="btn-primary text-xs shrink-0">
                {isPending ? "Adding..." : "Save Milestone"}
              </button>
            </div>
          </form>
        )}

        {/* Milestones List */}
        {goal.milestones.length === 0 ? (
          <p className="text-xs font-sans text-[var(--text-muted)] py-4 text-center">
            No milestones set yet. Break this goal down into meaningful checkpoints.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {goal.milestones
              .sort((a, b) => a.order - b.order)
              .map((milestone) => (
                <div
                  key={milestone.id}
                  className="py-3 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleMilestone(milestone.id, milestone.isCompleted)}
                      disabled={isPending}
                      className="shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
                      title={milestone.isCompleted ? "Mark incomplete" : "Mark achieved"}
                    >
                      {milestone.isCompleted ? (
                        <CheckCircle2 size={18} className="text-[var(--status-success)]" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-sans text-sm font-medium truncate transition-all",
                          milestone.isCompleted
                            ? "line-through text-[var(--text-muted)]"
                            : "text-[var(--text-primary)]"
                        )}
                      >
                        {milestone.title}
                      </p>
                      {milestone.dueDate && (
                        <p className="font-mono text-[11px] text-[var(--text-muted)]">
                          Target: {formatShortDate(new Date(milestone.dueDate))}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* View Journey Button */}
                  <button
                    onClick={() => setSelectedMilestone(milestone)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-sans text-[var(--text-muted)] hover:text-[var(--accent-amber)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer border border-[var(--border-subtle)]"
                  >
                    <History size={12} />
                    <span className="hidden sm:inline">View Journey</span>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Journey Modal Drawer */}
      {selectedMilestone && (
        <MilestoneJourney
          milestoneId={selectedMilestone.id}
          milestoneTitle={selectedMilestone.title}
          isCompleted={selectedMilestone.isCompleted}
          events={selectedMilestone.events || []}
          onClose={() => setSelectedMilestone(null)}
        />
      )}
    </div>
  );
}
