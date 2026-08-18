import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres@127.0.0.1:5433/sentiero_del_se?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Sentiero del Sé…");

  // Clean previous demo user
  const existing = await prisma.user.findUnique({
    where: { email: "demo@sentiero.app" },
  });
  if (existing) {
    console.log("  Removing previous demo user…");
    await prisma.user.delete({ where: { id: existing.id } });
  }

  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@sentiero.app",
      name: "Seeker",
      passwordHash,
      theme: "dark",
      locale: "en",
      timezone: "UTC",
    },
  });
  console.log(`  ✓ User: ${user.email}`);

  // ── AI Access Permissions (all off by default except growth/study/knowledge)
  const aiSections = [
    "growth", "study", "knowledge", "finance", "career",
    "memories", "media", "calendar", "news",
  ];
  for (const section of aiSections) {
    await prisma.aIAccessPermission.create({
      data: {
        userId: user.id,
        section,
        isEnabled: ["growth", "study", "knowledge"].includes(section),
      },
    });
  }
  console.log("  ✓ AI permissions initialized");

  // ── Growth Dimensions
  const dimensions = [
    { name: "Discipline", description: "Consistency in following through on commitments" },
    { name: "Focus", description: "Ability to sustain deep attention" },
    { name: "Emotional Intelligence", description: "Understanding and managing my own emotions" },
  ];
  for (let i = 0; i < dimensions.length; i++) {
    await prisma.growthDimension.create({
      data: { userId: user.id, order: i, ...dimensions[i] },
    });
  }
  console.log("  ✓ Growth dimensions created");

  // ── A demo Goal with milestones
  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Build Sentiero del Sé into a Personal OS",
      type: "PERSONAL",
      why: "I want a single coherent system that reflects how I actually think and live.",
      whyNot: "It may take longer than expected; competing priorities exist.",
      how: "Work through the specification in phases, building clean foundations first.",
      status: "ACTIVE",
      progressPercent: 20,
      deadline: new Date("2026-12-31"),
    },
  });

  const m1 = await prisma.goalMilestone.create({
    data: {
      goalId: goal.id,
      title: "Complete architecture reset and navigation",
      order: 0,
      dueDate: new Date("2026-09-01"),
    },
  });
  await prisma.milestoneEvent.create({
    data: {
      milestoneId: m1.id,
      type: "CREATED",
      description: "Milestone created as part of Phase 0–1 planning",
    },
  });

  await prisma.goalMilestone.create({
    data: {
      goalId: goal.id,
      title: "Implement full Growth module",
      order: 1,
      dueDate: new Date("2026-09-15"),
    },
  });

  await prisma.goalMilestone.create({
    data: {
      goalId: goal.id,
      title: "Launch functional study, knowledge, and finance modules",
      order: 2,
    },
  });
  console.log("  ✓ Demo goal + milestones created");

  // ── A demo Task
  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Review and finalize Growth module implementation",
      status: "IN_PROGRESS",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
      progressPercent: 40,
      notes: "Focus on milestone journey timeline and habit notes.",
    },
  });
  console.log("  ✓ Demo task created");

  // ── A demo Habit
  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      title: "Reduce social media scrolling",
      description: "Mindless scrolling reduces focus and time availability.",
      type: "BAD",
      objective: "REDUCE",
      state: "IMPROVING",
    },
  });
  await prisma.habitNote.create({
    data: {
      habitId: habit.id,
      content: "This week I avoided it on 4 out of 7 days. Progress, but not consistent yet.",
    },
  });
  console.log("  ✓ Demo habit + note created");

  // ── News interests
  const topics = ["Technology", "AI", "Science", "Finance"];
  for (const topic of topics) {
    await prisma.newsInterest.create({
      data: { userId: user.id, topic, isActive: true },
    });
  }
  console.log("  ✓ News interests created");

  console.log("\n✨ Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
