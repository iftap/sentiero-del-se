import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatEnglishDate,
  getEnglishGreeting,
  getDailyQuote,
  formatRelativeDate,
  formatShortDate,
  cn,
} from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Sprout,
  CalendarDays,
  Camera,
  Wallet,
  CheckCircle2,
  Clock,
  Target,
  Brain,
  Newspaper,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  const today = new Date();
  const greeting = getEnglishGreeting(today.getHours());
  const dateLabel = formatEnglishDate(today, user.timezone);
  const quote = getDailyQuote(today.getDate());

  // Fetch relevant live context in parallel
  const [
    activeGoals,
    inProgressTasks,
    habits,
    upcomingEvents,
    recentMemories,
    newsInterests,
  ] = await Promise.all([
    prisma.goal.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      include: { milestones: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    prisma.task.findMany({
      where: {
        userId: user.id,
        status: { in: ["INBOX", "PLANNED", "IN_PROGRESS"] },
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.habit.findMany({
      where: { userId: user.id },
      include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
      take: 4,
    }),
    prisma.calendarEvent.findMany({
      where: {
        userId: user.id,
        date: { gte: new Date(today.setHours(0, 0, 0, 0)) },
      },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.memory.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 2,
    }),
    prisma.newsInterest.findMany({
      where: { userId: user.id, isActive: true },
    }),
  ]);

  // Aggregate unified upcoming items (Calendar events + Task deadlines + Milestone deadlines)
  const taskDeadlines = inProgressTasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      date: t.dueDate!,
      type: "Task" as const,
      href: "/growth?tab=tasks",
    }));

  const goalMilestoneDeadlines = activeGoals.flatMap((g) =>
    g.milestones
      .filter((m) => !m.isCompleted && m.dueDate)
      .map((m) => ({
        id: `milestone-${m.id}`,
        title: `${m.title} (${g.title})`,
        date: m.dueDate!,
        type: "Milestone" as const,
        href: "/growth?tab=goals",
      }))
  );

  const directEvents = upcomingEvents.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    date: e.date,
    type: "Event" as const,
    href: "/calendar",
  }));

  const allUpcoming = [...directEvents, ...taskDeadlines, ...goalMilestoneDeadlines]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const topGoal = activeGoals[0];
  const upcomingTask = inProgressTasks[0];
  const latestMemory = recentMemories[0];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-24">
      {/* ═══════════════════════════════════════════
          SCENE 1: CINEMATIC HERO
          ═══════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-[75vh] flex flex-col justify-end overflow-hidden px-6 sm:px-12 lg:px-20 pb-16 pt-24 border-b border-[var(--border-subtle)]"
        aria-label="Personal OS Command Center"
      >
        {/* Background atmospheric gradient & ambient glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c131a] via-[var(--bg-canvas)] to-[var(--bg-canvas)]" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--accent-blue-bg)] blur-[120px] opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[300px] rounded-full bg-[var(--accent-amber-bg)] blur-[140px] opacity-25 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl animate-fade-up">
          {/* Greeting label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-blue)]">
              {greeting}, {user.name}
            </p>
          </div>

          {/* Master Identity Headline */}
          <h1 className="font-serif font-normal text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-[var(--text-primary)]">
            Walk your path.
          </h1>

          {/* Daily Motivational Quote */}
          <div className="mt-6 pl-4 border-l-2 border-[var(--accent-amber)]/50 max-w-2xl">
            <p className="font-serif italic text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mt-2">
              — {quote.author}
            </p>
          </div>

          {/* Date & Meta Stats Chips */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] tracking-wider">
              {dateLabel}
            </span>

            <div className="flex items-center gap-2 text-xs font-sans text-[var(--text-muted)]">
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
              <span>{activeGoals.length} Active Goals</span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
              <span>{inProgressTasks.length} Pending Tasks</span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
              <span>{habits.length} Habits Tracked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCENE 2: ADAPTIVE FEATURE CARDS
          Dynamically chosen based on current context
          ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 space-y-16">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label">Contextual Focus</p>
              <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)] mt-1">
                Active Journeys & Intelligence
              </h2>
            </div>
            <Link
              href="/growth"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans text-[var(--accent-blue)] hover:underline"
            >
              <span>Explore Growth</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Active Goal Focus */}
            {topGoal ? (
              <Link
                href="/growth?tab=goals"
                className="group relative p-6 rounded-2xl glass-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-blue">Goal in Motion</span>
                    <Target size={18} className="text-[var(--accent-blue)]" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                    {topGoal.title}
                  </h3>
                  {topGoal.how && (
                    <p className="font-sans text-xs text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {topGoal.how}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
                    <span>Progress</span>
                    <span>{topGoal.progressPercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${topGoal.progressPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-6 rounded-2xl glass-card flex flex-col justify-center items-center text-center">
                <Target size={28} className="text-[var(--text-muted)] mb-2" />
                <h3 className="font-serif text-base text-[var(--text-primary)]">Set Your First Goal</h3>
                <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
                  Define your why, why not, and milestones.
                </p>
                <Link href="/growth?tab=goals" className="btn-primary mt-4 text-xs">
                  Create Goal
                </Link>
              </div>
            )}

            {/* Card 2: Next Key Task */}
            {upcomingTask ? (
              <Link
                href="/growth?tab=tasks"
                className="group relative p-6 rounded-2xl glass-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-amber">Next Action</span>
                    <CheckCircle2 size={18} className="text-[var(--accent-amber)]" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors line-clamp-2">
                    {upcomingTask.title}
                  </h3>
                  {upcomingTask.dueDate && (
                    <p className="font-mono text-xs text-[var(--accent-amber)] mt-2 flex items-center gap-1.5">
                      <Clock size={12} />
                      Due {formatRelativeDate(new Date(upcomingTask.dueDate))}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="font-sans text-xs text-[var(--text-muted)]">
                    Status: {upcomingTask.status.replace("_", " ")}
                  </span>
                  <span className="font-sans text-xs text-[var(--accent-blue)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Execute <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="p-6 rounded-2xl glass-card flex flex-col justify-center items-center text-center">
                <CheckCircle2 size={28} className="text-[var(--text-muted)] mb-2" />
                <h3 className="font-serif text-base text-[var(--text-primary)]">All Clear</h3>
                <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
                  No immediate pending tasks.
                </p>
                <Link href="/growth?tab=tasks" className="btn-ghost mt-4 text-xs">
                  Add Task
                </Link>
              </div>
            )}

            {/* Card 3: Memory or Reflection Anchor */}
            {latestMemory ? (
              <Link
                href="/memories"
                className="group relative p-6 rounded-2xl glass-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-muted">Recent Memory</span>
                    <Camera size={18} className="text-[var(--text-muted)]" />
                  </div>
                  <p className="font-serif italic text-base text-[var(--text-primary)] line-clamp-3">
                    &ldquo;{latestMemory.caption}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>{formatShortDate(new Date(latestMemory.date))}</span>
                  <span className="text-[var(--accent-blue)]">View Memories →</span>
                </div>
              </Link>
            ) : (
              <Link
                href="/memories"
                className="p-6 rounded-2xl glass-card card-hover flex flex-col justify-center items-center text-center"
              >
                <Camera size={28} className="text-[var(--text-muted)] mb-2" />
                <h3 className="font-serif text-base text-[var(--text-primary)]">Nostalgic Timeline</h3>
                <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
                  Capture moments that shape your life journey.
                </p>
                <span className="btn-ghost mt-4 text-xs">Open Memories</span>
              </Link>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SCENE 3: UPCOMING TIMELINE & AI RECOMMENDATIONS
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming timeline (2 cols on lg) */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="section-label">Timeline</p>
                <h3 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
                  Upcoming Deadlines & Events
                </h3>
              </div>
              <Link
                href="/calendar"
                className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
              >
                <span>Full Agenda</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {allUpcoming.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--text-muted)] font-sans">
                No upcoming events or deadlines scheduled for the next 7 days.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {allUpcoming.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="py-3.5 flex items-center justify-between group hover:bg-[var(--bg-subtle)]/50 -mx-3 px-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={cn(
                          "badge text-[9px]",
                          item.type === "Task"
                            ? "badge-amber"
                            : item.type === "Milestone"
                            ? "badge-blue"
                            : "badge-muted"
                        )}
                      >
                        {item.type}
                      </span>
                      <span className="font-sans text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] truncate transition-colors">
                        {item.title}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[var(--text-muted)] shrink-0 ml-4">
                      {formatRelativeDate(new Date(item.date))}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* AI Orchestration / Recommendations Card */}
          <div className="glass-card-heavy p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-[var(--accent-blue)]/20">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-[var(--accent-blue)]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-blue)]">
                  Sentiero Intelligence
                </span>
              </div>

              <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Personal OS Insights
              </h4>

              <div className="mt-4 space-y-3 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-primary)] font-medium mb-1">
                    🌱 Milestone Continuity
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Keep momentum on &ldquo;{topGoal?.title || "your personal goals"}&rdquo; by completing the next sequential milestone.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-primary)] font-medium mb-1">
                    📰 Personalized World Context
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Curating high-signal updates for your tracked interests (
                    {newsInterests.map((n) => n.topic).join(", ") || "AI, Tech, Science"}
                    ).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <Link
                href="/settings"
                className="text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-between"
              >
                <span>AI Permissions & Privacy</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SCENE 4: LATEST FOR YOU (NEWS WIDGET)
            ═══════════════════════════════════════════ */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Newspaper size={18} className="text-[var(--accent-blue)]" />
              <div>
                <p className="section-label">World Context</p>
                <h3 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                  Latest for You
                </h3>
              </div>
            </div>
            <Link
              href="/news"
              className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
            >
              <span>Full Feed</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {newsInterests.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-mono text-xs border border-[var(--border-subtle)]"
              >
                #{item.topic}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] text-[var(--accent-blue)] uppercase">
                High Signal
              </span>
              <h4 className="font-serif text-base font-medium text-[var(--text-primary)] mt-1">
                Frontier AI Research & Cognitive Operating Systems
              </h4>
              <p className="font-sans text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2">
                New architectures prioritize interconnected personal memory and autonomous orchestration over rigid workflows.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[var(--text-ghost)]">
                <span>MIT Tech Review</span>
                <span>Today</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] text-[var(--accent-amber)] uppercase">
                Systems & Science
              </span>
              <h4 className="font-serif text-base font-medium text-[var(--text-primary)] mt-1">
                Deep Work and Mindful Digital Ecology
              </h4>
              <p className="font-sans text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2">
                Behavioral studies show that qualitative reflection and journey preservation significantly outperform gamified streak counters.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[var(--text-ghost)]">
                <span>Nature Neuroscience</span>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
