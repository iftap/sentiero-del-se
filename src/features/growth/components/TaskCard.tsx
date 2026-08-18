"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { formatRelativeDate, isOverdue, cn } from "@/lib/utils";
import {
  updateTaskStatusAction,
  updateTaskProgressAction,
  updateTaskTimerAction,
  addSubtaskAction,
  toggleSubtaskAction,
  deleteTaskAction,
} from "@/features/growth/actions";
import {
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  Plus,
  Trash2,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTimerSeconds, setElapsedTimerSeconds] = useState(task.timerSeconds);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(task.subtasks.length > 0);
  const [showOverdueMenu, setShowOverdueMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Local active timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      // Stop timer and persist delta
      setIsTimerRunning(false);
      const delta = elapsedTimerSeconds - task.timerSeconds;
      if (delta > 0) {
        startTransition(async () => {
          await updateTaskTimerAction(task.id, delta);
        });
      }
    } else {
      setIsTimerRunning(true);
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    startTransition(async () => {
      await updateTaskStatusAction(task.id, newStatus);
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    startTransition(async () => {
      await addSubtaskAction(task.id, newSubtaskTitle);
      setNewSubtaskTitle("");
    });
  };

  const handleToggleSubtask = (subtaskId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleSubtaskAction(subtaskId, !currentStatus);
    });
  };

  const isTaskOverdue =
    task.dueDate &&
    isOverdue(new Date(task.dueDate)) &&
    task.status !== "COMPLETED" &&
    task.status !== "CANCELLED";

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl glass-card transition-all relative group",
        isTaskOverdue && "border-[var(--status-error)]/40 bg-[var(--status-error)]/5",
        task.status === "COMPLETED" && "opacity-60"
      )}
    >
      {/* Top row: Checkbox, Title, Status selector */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <button
            onClick={() =>
              handleStatusChange(task.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED")
            }
            disabled={isPending}
            className="mt-0.5 shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-pointer"
          >
            {task.status === "COMPLETED" ? (
              <CheckCircle2 size={17} className="text-[var(--status-success)]" />
            ) : (
              <Circle size={17} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h4
              className={cn(
                "font-sans text-sm font-medium leading-snug break-words",
                task.status === "COMPLETED"
                  ? "line-through text-[var(--text-muted)]"
                  : "text-[var(--text-primary)]"
              )}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="font-sans text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={isPending}
          className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-[10px] rounded px-2 py-1 outline-none shrink-0"
        >
          <option value="INBOX">Inbox</option>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Overdue Warning & Decision Menu */}
      {isTaskOverdue && (
        <div className="mt-3 p-2.5 rounded-lg bg-[var(--status-error)]/10 border border-[var(--status-error)]/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--status-error)] font-sans">
            <AlertCircle size={13} />
            <span>Overdue since {formatRelativeDate(new Date(task.dueDate!))}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStatusChange("COMPLETED")}
              className="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-[var(--status-success)] text-white"
            >
              Complete
            </button>
            <button
              onClick={() => handleStatusChange("CANCELLED")}
              className="px-2 py-0.5 rounded text-[10px] font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-subtle)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Meta Bar: Due date, Progress bar, Timer */}
      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Due date */}
        {task.dueDate && !isTaskOverdue && (
          <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <Clock size={12} /> {formatRelativeDate(new Date(task.dueDate))}
          </span>
        )}

        {/* Manual Progress Slider */}
        <div className="flex items-center gap-2 flex-1 max-w-[160px]">
          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={task.progressPercent}
            onChange={(e) => updateTaskProgressAction(task.id, Number(e.target.value))}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-blue)]"
          />
          <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
            {task.progressPercent}%
          </span>
        </div>

        {/* Start/Stop Focus Timer */}
        <button
          onClick={toggleTimer}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer",
            isTimerRunning
              ? "bg-[var(--accent-blue)] text-white animate-pulse shadow-sm"
              : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
          title="Focus timer on this task"
        >
          {isTimerRunning ? <Pause size={11} /> : <Play size={11} />}
          <span>{formatTimer(elapsedTimerSeconds)}</span>
        </button>
      </div>

      {/* Subtasks Section */}
      <div className="mt-3 pt-2 border-t border-[var(--border-subtle)]/60">
        <button
          onClick={() => setShowSubtasks(!showSubtasks)}
          className="text-[11px] font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
        >
          {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span>
            Subtasks ({task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length})
          </span>
        </button>

        {showSubtasks && (
          <div className="mt-2 pl-2 space-y-1.5 animate-fade-in">
            {task.subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={sub.isCompleted}
                  onChange={() => handleToggleSubtask(sub.id, sub.isCompleted)}
                  className="rounded border-[var(--border-strong)] text-[var(--accent-blue)] focus:ring-0 cursor-pointer"
                />
                <span
                  className={cn(
                    "font-sans text-xs",
                    sub.isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {sub.title}
                </span>
              </div>
            ))}

            {/* Inline add subtask */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5 mt-1.5">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask..."
                className="bg-transparent border-b border-[var(--border-subtle)] text-xs text-[var(--text-primary)] outline-none py-0.5 flex-1 focus:border-[var(--accent-blue)]"
              />
              <button
                type="submit"
                className="text-[var(--accent-blue)] p-1 hover:opacity-80"
                aria-label="Add subtask"
              >
                <Plus size={13} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
