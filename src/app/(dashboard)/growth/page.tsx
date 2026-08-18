import React, { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GrowthShell } from "@/features/growth/components/GrowthShell";
import { Sprout } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
  const user = await requireUser();

  // Fetch all user growth data in parallel
  const [tasks, goals, habits, assessments, dimensions] = await Promise.all([
    prisma.task.findMany({
      where: { userId: user.id },
      include: { subtasks: { orderBy: { order: "asc" } }, events: true },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    }),
    prisma.goal.findMany({
      where: { userId: user.id },
      include: {
        milestones: {
          include: { events: { orderBy: { createdAt: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.habit.findMany({
      where: { userId: user.id },
      include: { notes: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.growthAssessment.findMany({
      where: { userId: user.id },
      include: {
        dimensionEntries: {
          include: { dimension: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.growthDimension.findMany({
      where: { userId: user.id },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Module Header */}
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sprout size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Personal Development Workspace</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Growth & Execution
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-[var(--text-muted)]">Loading Growth Workspace...</div>}>
          <GrowthShell
            tasks={tasks as any}
            goals={goals as any}
            habits={habits as any}
            assessments={assessments as any}
            dimensions={dimensions as any}
          />
        </Suspense>
      </div>
    </div>
  );
}
