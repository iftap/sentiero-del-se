"use client";

import React, { useState, useTransition } from "react";
import { Goal, GoalStatus } from "@/lib/types";
import { GoalDetail } from "./GoalDetail";
import { createGoalAction } from "@/features/growth/actions";
import { Plus, Target, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalsViewProps {
  goals: Goal[];
}

export function GoalsView({ goals }: GoalsViewProps) {
  const [filterStatus, setFilterStatus] = useState<GoalStatus | "ALL">("ACTIVE");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredGoals = goals.filter((g) => {
    if (filterStatus === "ALL") return true;
    return g.status === filterStatus;
  });

  const handleCreateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createGoalAction(formData);
      setShowCreateModal(false);
    });
  };

  return (
    <div className="space-y-8">
      {/* Top action bar & filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(["ACTIVE", "COMPLETED", "CANCELLED", "ALL"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-colors cursor-pointer",
                filterStatus === status
                  ? "bg-[var(--accent-blue)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {status === "ALL" ? "All Goals" : status}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs"
        >
          <Plus size={14} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="empty-state glass-card rounded-2xl">
          <div className="empty-state-icon">
            <Target size={24} />
          </div>
          <h3 className="font-serif text-lg text-[var(--text-primary)]">
            No {filterStatus.toLowerCase()} goals
          </h3>
          <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
            Goals are journeys of meaningful milestones. Define what matters and structure your path.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs mt-2"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGoals.map((goal) => (
            <GoalDetail key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-xl max-h-[90vh] glass-card-heavy rounded-2xl border border-[var(--border-strong)] flex flex-col shadow-[var(--shadow-elevated)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Target size={18} className="text-[var(--accent-blue)]" />
                <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                  Define a New Goal Journey
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Goal Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Master Full-Stack Architecture..."
                  className="form-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Goal Type
                  </label>
                  <select name="type" className="form-input text-sm">
                    <option value="PERSONAL">Personal</option>
                    <option value="SHORT_TERM">Short-term</option>
                    <option value="MEDIUM_TERM">Medium-term</option>
                    <option value="LONG_TERM">Long-term</option>
                    <option value="LIFE">Life</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="CAREER">Career</option>
                    <option value="GROWTH">Growth</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Target Deadline
                  </label>
                  <input name="deadline" type="date" className="form-input text-sm" />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-blue)] block mb-1">
                  Why — Why does this goal matter?
                </label>
                <textarea
                  name="why"
                  placeholder="The deep motivation or purpose behind this goal..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-amber)] block mb-1">
                  Why Not — Concerns, tradeoffs, or potential blockers
                </label>
                <textarea
                  name="whyNot"
                  placeholder="What could go wrong? What are the tradeoffs?..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--wolf-silver)] block mb-1">
                  How — Strategy and intended approach
                </label>
                <textarea
                  name="how"
                  placeholder="How will you achieve this? Core tactics..."
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
                  {isPending ? "Creating..." : "Establish Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
