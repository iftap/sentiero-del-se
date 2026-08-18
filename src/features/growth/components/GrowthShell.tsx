"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Task, Goal, Habit, GrowthAssessment, GrowthDimension } from "@/lib/types";
import { TasksView } from "./TasksView";
import { GoalsView } from "./GoalsView";
import { HabitsView } from "./HabitsView";
import { AssessmentsView } from "./AssessmentsView";
import { CheckSquare, Target, Sprout, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrowthShellProps {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  assessments: GrowthAssessment[];
  dimensions: GrowthDimension[];
}

type GrowthTab = "tasks" | "goals" | "habits" | "assessments";

export function GrowthShell({
  tasks,
  goals,
  habits,
  assessments,
  dimensions,
}: GrowthShellProps) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as GrowthTab) || "tasks";
  const [activeTab, setActiveTab] = useState<GrowthTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as GrowthTab;
    if (tabParam && ["tasks", "goals", "habits", "assessments"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabs = [
    {
      id: "tasks" as const,
      label: "Tasks",
      count: tasks.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED").length,
      icon: CheckSquare,
    },
    {
      id: "goals" as const,
      label: "Goals & Milestones",
      count: goals.filter((g) => g.status === "ACTIVE").length,
      icon: Target,
    },
    {
      id: "habits" as const,
      label: "Habits",
      count: habits.length,
      icon: Sprout,
    },
    {
      id: "assessments" as const,
      label: "Self-Assessment",
      count: assessments.length,
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="tab-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn("tab-item flex items-center gap-2", isActive && "active")}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]"
                      : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="animate-fade-in">
        {activeTab === "tasks" && <TasksView tasks={tasks} />}
        {activeTab === "goals" && <GoalsView goals={goals} />}
        {activeTab === "habits" && <HabitsView habits={habits} />}
        {activeTab === "assessments" && (
          <AssessmentsView assessments={assessments} dimensions={dimensions} />
        )}
      </div>
    </div>
  );
}
