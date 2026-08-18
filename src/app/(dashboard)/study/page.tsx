import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDayName } from "@/lib/utils";
import { createSubjectAction, createRoutineAction } from "@/features/study/actions";
import { GraduationCap, Plus, BookOpen, Clock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const user = await requireUser();

  const subjects = await prisma.studySubject.findMany({
    where: { userId: user.id },
    include: { routines: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] } },
    orderBy: { name: "asc" },
  });

  const routines = await prisma.studyRoutine.findMany({
    where: { userId: user.id },
    include: { subject: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Group routines by day (0..6)
  const routinesByDay: Record<number, typeof routines> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  };
  routines.forEach((r) => {
    routinesByDay[r.dayOfWeek]?.push(r);
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Academic Module</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Study & Routines
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Subjects & Grades */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                Subjects & Grades
              </h2>
              <span className="badge badge-muted">{subjects.length} Total</span>
            </div>

            {/* Add Subject Form */}
            <form
              action={createSubjectAction}
              className="p-4 rounded-xl glass-card space-y-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                Add Subject
              </span>
              <input
                name="name"
                type="text"
                placeholder="e.g. Distributed Systems..."
                className="form-input text-xs"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  name="grade"
                  type="text"
                  placeholder="Grade (e.g. A, 30/30, 95%)..."
                  className="form-input text-xs flex-1"
                />
                <button type="submit" className="btn-primary text-xs shrink-0">
                  <Plus size={13} />
                  <span>Save</span>
                </button>
              </div>
            </form>

            {/* Subjects List */}
            {subjects.length === 0 ? (
              <div className="p-6 rounded-xl glass-card text-center text-xs font-sans text-[var(--text-muted)]">
                No academic subjects recorded. Add subjects to structure your schedule.
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl glass-card flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-sans text-sm font-medium text-[var(--text-primary)]">
                        {sub.name}
                      </h3>
                      <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">
                        {sub.routines.length} weekly sessions
                      </p>
                    </div>
                    {sub.grade ? (
                      <span className="badge badge-blue text-xs font-mono">{sub.grade}</span>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--text-ghost)]">No grade</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right 2 Columns: Weekly Schedule Routine */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                Weekly Study Schedule
              </h2>
            </div>

            {/* Add Routine Form */}
            {subjects.length > 0 && (
              <form
                action={createRoutineAction}
                className="p-4 rounded-xl glass-card grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Subject
                  </label>
                  <select name="subjectId" className="form-input text-xs" required>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Day
                  </label>
                  <select name="dayOfWeek" className="form-input text-xs" defaultValue="1">
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Time
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="startTime"
                      type="time"
                      defaultValue="09:00"
                      className="form-input text-xs"
                      required
                    />
                    <button type="submit" className="btn-primary text-xs shrink-0 p-2">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 7-Day Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                const dayRoutines = routinesByDay[dayIdx] || [];
                return (
                  <div
                    key={dayIdx}
                    className="p-4 rounded-xl glass-card space-y-3 min-h-[140px]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-medium">
                        {getDayName(dayIdx, true)}
                      </span>
                      <span className="badge badge-muted text-[9px]">{dayRoutines.length}</span>
                    </div>

                    {dayRoutines.length === 0 ? (
                      <p className="text-[11px] font-sans text-[var(--text-ghost)] italic py-2">
                        No routine
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {dayRoutines.map((r) => (
                          <div
                            key={r.id}
                            className="p-2 rounded-lg bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)] space-y-0.5"
                          >
                            <p className="font-sans text-xs font-medium text-[var(--text-primary)] truncate">
                              {r.subject.name}
                            </p>
                            <p className="font-mono text-[10px] text-[var(--accent-blue)] flex items-center gap-1">
                              <Clock size={10} /> {r.startTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
