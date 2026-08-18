"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TaskStatus, GoalStatus, GoalType, HabitType, HabitObjective, HabitState } from "@prisma/client";

// ──────────────────────────────────────────────────
// TASK ACTIONS
// ──────────────────────────────────────────────────

export async function createTaskAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = (formData.get("status") as TaskStatus) || "INBOX";
  const dueDateStr = formData.get("dueDate") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!title?.trim()) {
    throw new Error("Task title is required");
  }

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title: title.trim(),
      description,
      status,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      notes,
    },
  });

  // Log Task Creation Event
  await prisma.taskEvent.create({
    data: {
      taskId: task.id,
      type: "CREATED",
      description: `Task created in ${status} status`,
    },
  });

  revalidatePath("/growth");
  revalidatePath("/home");
  return task;
}

export async function updateTaskStatusAction(taskId: string, newStatus: TaskStatus) {
  const user = await requireUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
  });

  if (!task) throw new Error("Task not found");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
      completedAt: newStatus === "COMPLETED" ? new Date() : null,
      progressPercent: newStatus === "COMPLETED" ? 100 : task.progressPercent,
    },
  });

  // Record history event
  await prisma.taskEvent.create({
    data: {
      taskId,
      type: newStatus === "COMPLETED" ? "COMPLETED" : "STATUS_CHANGED",
      description: `Status changed to ${newStatus}`,
    },
  });

  // If this task was linked to any milestones, create milestone journey event
  const milestoneLinks = await prisma.milestoneTask.findMany({
    where: { taskId },
  });

  if (newStatus === "COMPLETED") {
    for (const link of milestoneLinks) {
      await prisma.milestoneEvent.create({
        data: {
          milestoneId: link.milestoneId,
          type: "TASK_COMPLETED",
          description: `Linked task completed: "${task.title}"`,
          relatedTaskId: taskId,
        },
      });
    }
  }

  revalidatePath("/growth");
  revalidatePath("/home");
  return updated;
}

export async function updateTaskProgressAction(taskId: string, progressPercent: number) {
  const user = await requireUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
  });

  if (!task) throw new Error("Task not found");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      status: progressPercent === 100 ? "COMPLETED" : task.status,
      completedAt: progressPercent === 100 ? new Date() : null,
    },
  });

  await prisma.taskEvent.create({
    data: {
      taskId,
      type: "PROGRESS_CHANGED",
      description: `Progress updated to ${progressPercent}%`,
    },
  });

  revalidatePath("/growth");
  return updated;
}

export async function updateTaskTimerAction(taskId: string, additionalSeconds: number) {
  const user = await requireUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
  });

  if (!task) throw new Error("Task not found");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      timerSeconds: task.timerSeconds + additionalSeconds,
    },
  });

  revalidatePath("/growth");
  return updated;
}

export async function deleteTaskAction(taskId: string) {
  const user = await requireUser();

  await prisma.task.deleteMany({
    where: { id: taskId, userId: user.id },
  });

  revalidatePath("/growth");
  revalidatePath("/home");
}

export async function addSubtaskAction(taskId: string, title: string) {
  const user = await requireUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
    include: { subtasks: true },
  });

  if (!task) throw new Error("Task not found");

  const subtask = await prisma.taskSubtask.create({
    data: {
      taskId,
      title: title.trim(),
      order: task.subtasks.length,
    },
  });

  revalidatePath("/growth");
  return subtask;
}

export async function toggleSubtaskAction(subtaskId: string, isCompleted: boolean) {
  const user = await requireUser();

  const subtask = await prisma.taskSubtask.findUnique({
    where: { id: subtaskId },
    include: { task: true },
  });

  if (!subtask || subtask.task.userId !== user.id) {
    throw new Error("Unauthorized or subtask not found");
  }

  const updated = await prisma.taskSubtask.update({
    where: { id: subtaskId },
    data: { isCompleted },
  });

  revalidatePath("/growth");
  return updated;
}

// ──────────────────────────────────────────────────
// GOAL & MILESTONE ACTIONS
// ──────────────────────────────────────────────────

export async function createGoalAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const type = (formData.get("type") as GoalType) || "PERSONAL";
  const customType = (formData.get("customType") as string) || null;
  const why = (formData.get("why") as string) || null;
  const whyNot = (formData.get("whyNot") as string) || null;
  const how = (formData.get("how") as string) || null;
  const deadlineStr = formData.get("deadline") as string;

  if (!title?.trim()) throw new Error("Goal title is required");

  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: title.trim(),
      type,
      customType,
      why,
      whyNot,
      how,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    },
  });

  revalidatePath("/growth");
  revalidatePath("/home");
  return goal;
}

export async function updateGoalProgressAction(goalId: string, progressPercent: number) {
  const user = await requireUser();

  const goal = await prisma.goal.updateMany({
    where: { id: goalId, userId: user.id },
    data: { progressPercent: Math.min(100, Math.max(0, progressPercent)) },
  });

  revalidatePath("/growth");
  return goal;
}

export async function createMilestoneAction(goalId: string, title: string, dueDateStr?: string) {
  const user = await requireUser();

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId: user.id },
    include: { milestones: true },
  });

  if (!goal) throw new Error("Goal not found");

  const milestone = await prisma.goalMilestone.create({
    data: {
      goalId,
      title: title.trim(),
      order: goal.milestones.length,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    },
  });

  // Milestone Journey Event: Created
  await prisma.milestoneEvent.create({
    data: {
      milestoneId: milestone.id,
      type: "CREATED",
      description: `Milestone "${title}" established for goal "${goal.title}"`,
    },
  });

  revalidatePath("/growth");
  return milestone;
}

export async function completeMilestoneAction(milestoneId: string, isCompleted: boolean) {
  const user = await requireUser();

  const milestone = await prisma.goalMilestone.findUnique({
    where: { id: milestoneId },
    include: { goal: true },
  });

  if (!milestone || milestone.goal.userId !== user.id) {
    throw new Error("Unauthorized or milestone not found");
  }

  const updated = await prisma.goalMilestone.update({
    where: { id: milestoneId },
    data: {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  });

  // Record Milestone Journey Event
  await prisma.milestoneEvent.create({
    data: {
      milestoneId,
      type: isCompleted ? "COMPLETED" : "EDITED",
      description: isCompleted
        ? `Milestone successfully achieved and verified!`
        : `Milestone status reopened for further work`,
    },
  });

  revalidatePath("/growth");
  revalidatePath("/home");
  return updated;
}

export async function addMilestoneNoteAction(milestoneId: string, noteText: string) {
  const user = await requireUser();

  const milestone = await prisma.goalMilestone.findUnique({
    where: { id: milestoneId },
    include: { goal: true },
  });

  if (!milestone || milestone.goal.userId !== user.id) {
    throw new Error("Unauthorized or milestone not found");
  }

  const event = await prisma.milestoneEvent.create({
    data: {
      milestoneId,
      type: "NOTE_ADDED",
      description: noteText.trim(),
    },
  });

  revalidatePath("/growth");
  return event;
}

// ──────────────────────────────────────────────────
// HABIT ACTIONS
// ──────────────────────────────────────────────────

export async function createHabitAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const type = (formData.get("type") as HabitType) || "DEVELOPING";
  const objective = (formData.get("objective") as HabitObjective) || "IMPROVE";
  const state = (formData.get("state") as HabitState) || "IDENTIFIED";
  const initialNote = (formData.get("initialNote") as string) || null;

  if (!title?.trim()) throw new Error("Habit title is required");

  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      title: title.trim(),
      description,
      type,
      objective,
      state,
      notes: initialNote
        ? {
            create: { content: initialNote.trim() },
          }
        : undefined,
    },
  });

  revalidatePath("/growth");
  revalidatePath("/home");
  return habit;
}

export async function updateHabitStateAction(habitId: string, state: HabitState) {
  const user = await requireUser();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });

  if (!habit) throw new Error("Habit not found");

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: { state },
  });

  revalidatePath("/growth");
  return updated;
}

export async function addHabitNoteAction(habitId: string, content: string) {
  const user = await requireUser();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });

  if (!habit) throw new Error("Habit not found");

  const note = await prisma.habitNote.create({
    data: {
      habitId,
      content: content.trim(),
    },
  });

  revalidatePath("/growth");
  return note;
}

// ──────────────────────────────────────────────────
// SELF-GROWTH ASSESSMENT ACTIONS
// ──────────────────────────────────────────────────

export async function createDimensionAction(name: string, description?: string) {
  const user = await requireUser();

  const count = await prisma.growthDimension.count({
    where: { userId: user.id },
  });

  const dimension = await prisma.growthDimension.create({
    data: {
      userId: user.id,
      name: name.trim(),
      description: description?.trim() || null,
      order: count,
    },
  });

  revalidatePath("/growth");
  return dimension;
}

export async function createAssessmentAction(
  assessmentData: {
    currentState?: string;
    whatChanged?: string;
    cause?: string;
    evidence?: string;
    stillNeeds?: string;
    notes?: string;
    dimensionEntries?: { dimensionId: string; reflection: string }[];
  }
) {
  const user = await requireUser();

  const assessment = await prisma.growthAssessment.create({
    data: {
      userId: user.id,
      currentState: assessmentData.currentState?.trim() || null,
      whatChanged: assessmentData.whatChanged?.trim() || null,
      cause: assessmentData.cause?.trim() || null,
      evidence: assessmentData.evidence?.trim() || null,
      stillNeeds: assessmentData.stillNeeds?.trim() || null,
      notes: assessmentData.notes?.trim() || null,
      dimensionEntries: assessmentData.dimensionEntries?.length
        ? {
            create: assessmentData.dimensionEntries
              .filter((e) => e.reflection?.trim())
              .map((e) => ({
                dimensionId: e.dimensionId,
                reflection: e.reflection.trim(),
              })),
          }
        : undefined,
    },
  });

  revalidatePath("/growth");
  return assessment;
}
