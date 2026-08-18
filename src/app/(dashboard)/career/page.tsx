import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CareerShell } from "@/features/career/components/CareerShell";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const user = await requireUser();

  const [careerEvents, careerSkills, careerGoals] = await Promise.all([
    prisma.careerEvent.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    }),
    prisma.careerSkill.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
    prisma.goal.findMany({
      where: { userId: user.id, type: "CAREER" },
      include: { milestones: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Professional Development</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Career & Trajectory
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <CareerShell
          careerEvents={careerEvents}
          careerSkills={careerSkills}
          careerGoals={careerGoals}
        />
      </div>
    </div>
  );
}
