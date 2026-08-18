"use client";

import React, { useState, useTransition } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { createTaskAction } from "@/features/growth/actions";
import {
  List,
  Kanban,
  Plus,
  X,
  CheckCircle2,
  Inbox,
  Calendar,
  PlayCircle,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TasksViewProps {
  tasks: Task[];
}

export function TasksView({ tasks }: TasksViewProps) {
  const [viewMode, setViewMode] = useState<"LIST" | "KANBAN">("LIST");
  const [quickTitle, setQuickTitle] = useState("");
  const [showFullModal, setShowFullModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const fd = new FormData();
    fd.set("title", quickTitle);
    fd.set("status", "INBOX");

    startTransition(async () => {
      await createTaskAction(fd);
      setQuickTitle("");
    });
  };

  const handleFullCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createTaskAction(formData);
      setShowFullModal(false);
    });
  };

  // Group tasks by status
  const inboxTasks = tasks.filter((t) => t.status === "INBOX");
  const plannedTasks = tasks.filter((t) => t.status === "PLANNED");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Quick Add + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Quick Add Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="flex-1 flex items-center gap-2 glass-card rounded-xl px-3 py-1.5 border border-[var(--border-subtle)]"
        >
          <Plus size={16} className="text-[var(--accent-blue)] shrink-0" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture to Inbox (press Enter)..."
            className="flex-1 bg-transparent font-sans text-xs text-[var(--text-primary)] placeholder:text-[var(--text-ghost)] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="text-[11px] font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded border border-[var(--border-subtle)] shrink-0"
          >
            Details
          </button>
        </form>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode("LIST")}
            className={cn(
              "p-1.5 rounded-lg text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === "LIST"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <List size={14} />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode("KANBAN")}
            className={cn(
              "p-1.5 rounded-lg text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === "KANBAN"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <Kanban size={14} />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === "LIST" && (
        <div className="space-y-8">
          {/* Inbox Section */}
          {inboxTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Inbox size={15} className="text-[var(--accent-blue)]" />
                <h3 className="section-label">Inbox ({inboxTasks.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inboxTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* In Progress Section */}
          {inProgressTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PlayCircle size={15} className="text-[var(--accent-amber)]" />
                <h3 className="section-label">In Progress ({inProgressTasks.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Planned Section */}
          {plannedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[var(--wolf-silver)]" />
                <h3 className="section-label">Planned ({plannedTasks.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plannedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[var(--status-success)]" />
                <h3 className="section-label">Completed ({completedTasks.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="empty-state glass-card rounded-2xl">
              <Inbox size={28} className="text-[var(--text-muted)]" />
              <h3 className="font-serif text-lg text-[var(--text-primary)]">No tasks yet</h3>
              <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
                Capture tasks into your inbox or plan actionable steps for your goals.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── KANBAN VIEW ── */}
      {viewMode === "KANBAN" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start overflow-x-auto pb-6">
          {/* Column 1: Inbox */}
          <div className="glass-card p-4 rounded-xl space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-medium">
                Inbox
              </span>
              <span className="badge badge-muted">{inboxTasks.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {inboxTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Column 2: Planned */}
          <div className="glass-card p-4 rounded-xl space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-medium">
                Planned
              </span>
              <span className="badge badge-muted">{plannedTasks.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {plannedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Column 3: In Progress */}
          <div className="glass-card p-4 rounded-xl space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-amber)] font-medium">
                In Progress
              </span>
              <span className="badge badge-amber">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="glass-card p-4 rounded-xl space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--status-success)] font-medium">
                Done
              </span>
              <span className="badge badge-success">{completedTasks.length}</span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Create Task Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg glass-card-heavy rounded-2xl border border-[var(--border-strong)] flex flex-col shadow-[var(--shadow-elevated)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Create New Task
              </h3>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFullCreate} className="p-6 space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Task Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Task title..."
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Context or instructions..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Status
                  </label>
                  <select name="status" className="form-input text-xs" defaultValue="INBOX">
                    <option value="INBOX">Inbox</option>
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Due Date
                  </label>
                  <input name="dueDate" type="date" className="form-input text-xs" />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Notes (Simple text)
                </label>
                <textarea
                  name="notes"
                  placeholder="Additional notes..."
                  className="form-input text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFullModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  {isPending ? "Creating..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
