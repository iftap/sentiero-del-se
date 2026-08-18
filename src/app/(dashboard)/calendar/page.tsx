import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CalendarShell } from "@/features/calendar/components/CalendarShell";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const user = await requireUser();

  const [events, tasks, goals] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    }),
    prisma.task.findMany({
      where: { userId: user.id, dueDate: { not: null } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.goal.findMany({
      where: { userId: user.id },
      include: { milestones: true },
    }),
  ]);

  // Aggregate into unified agenda items
  const eventItems = events.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    date: e.date,
    time: e.time,
    type: "Event" as const,
    href: "/calendar",
  }));

  const taskItems = tasks.map((t) => ({
    id: `task-${t.id}`,
    title: `${t.title} [Task Deadline]`,
    date: t.dueDate!,
    time: null,
    type: "Task" as const,
    href: "/growth?tab=tasks",
    status: t.status,
  }));

  const goalItems = goals
    .filter((g) => g.deadline)
    .map((g) => ({
      id: `goal-${g.id}`,
      title: `${g.title} [Goal Target]`,
      date: g.deadline!,
      time: null,
      type: "Goal" as const,
      href: "/growth?tab=goals",
    }));

  const milestoneItems = goals.flatMap((g) =>
    g.milestones
      .filter((m) => m.dueDate)
      .map((m) => ({
        id: `milestone-${m.id}`,
        title: `${m.title} [${g.title} Milestone]`,
        date: m.dueDate!,
        time: null,
        type: "Milestone" as const,
        href: "/growth?tab=goals",
        status: m.isCompleted ? "COMPLETED" : "ACTIVE",
      }))
  );

  const allItems = [...eventItems, ...taskItems, ...goalItems, ...milestoneItems];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Chronological Agenda</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Calendar & Deadlines
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <CalendarShell items={allItems} />
      </div>
    </div>
  );
}
