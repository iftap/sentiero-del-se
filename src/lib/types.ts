/**
 * Shared TypeScript types for Sentiero del Sé.
 * These mirror the Prisma models but are safe for use in client components.
 */

// ──────────────────────────────────────────────────
// TASKS
// ──────────────────────────────────────────────────

export type TaskStatus = "INBOX" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskEventType = "CREATED" | "EDITED" | "STATUS_CHANGED" | "PROGRESS_CHANGED" | "COMPLETED";

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  order: number;
}

export interface TaskEventRecord {
  id: string;
  taskId: string;
  type: TaskEventType;
  description: string | null;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: Date | null;
  startDate: Date | null;
  progressPercent: number;
  notes: string | null;
  links: string[];
  reminderAt: Date | null;
  timerSeconds: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
  events?: TaskEventRecord[];
}

// ──────────────────────────────────────────────────
// GOALS & MILESTONES
// ──────────────────────────────────────────────────

export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type GoalType =
  | "SHORT_TERM"
  | "MEDIUM_TERM"
  | "LONG_TERM"
  | "LIFE"
  | "ACADEMIC"
  | "CAREER"
  | "PERSONAL"
  | "GROWTH"
  | "CUSTOM";

export type MilestoneEventType =
  | "CREATED"
  | "EDITED"
  | "TASK_LINKED"
  | "TASK_COMPLETED"
  | "PROGRESS_CHANGED"
  | "NOTE_ADDED"
  | "HABIT_CHANGED"
  | "COMPLETED";

export interface MilestoneEvent {
  id: string;
  milestoneId: string;
  type: MilestoneEventType;
  description: string | null;
  relatedTaskId: string | null;
  relatedHabitId: string | null;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: Date | null;
  dueDate: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  events?: MilestoneEvent[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: GoalType;
  customType: string | null;
  why: string | null;
  whyNot: string | null;
  how: string | null;
  status: GoalStatus;
  deadline: Date | null;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
  milestones: Milestone[];
}

// ──────────────────────────────────────────────────
// HABITS
// ──────────────────────────────────────────────────

export type HabitType = "GOOD" | "BAD" | "DEVELOPING";
export type HabitObjective = "MAINTAIN" | "IMPROVE" | "REDUCE" | "REMOVE";
export type HabitState =
  | "IDENTIFIED"
  | "EVALUATING"
  | "IMPROVING"
  | "MAINTAINING"
  | "CHANGED"
  | "REMOVED";

export interface HabitNote {
  id: string;
  habitId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: HabitType;
  objective: HabitObjective;
  state: HabitState;
  createdAt: Date;
  updatedAt: Date;
  notes: HabitNote[];
}

// ──────────────────────────────────────────────────
// GROWTH ASSESSMENT
// ──────────────────────────────────────────────────

export interface GrowthDimension {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  order: number;
}

export interface AssessmentDimensionEntry {
  id: string;
  assessmentId: string;
  dimensionId: string;
  reflection: string | null;
  dimension?: GrowthDimension;
}

export interface GrowthAssessment {
  id: string;
  userId: string;
  currentState: string | null;
  whatChanged: string | null;
  cause: string | null;
  evidence: string | null;
  stillNeeds: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  dimensionEntries: AssessmentDimensionEntry[];
}

// ──────────────────────────────────────────────────
// STUDY
// ──────────────────────────────────────────────────

export interface StudyRoutine {
  id: string;
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
}

export interface StudySubject {
  id: string;
  name: string;
  grade: string | null;
  routines: StudyRoutine[];
}

// ──────────────────────────────────────────────────
// FINANCE
// ──────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";

export interface FinancialAccount {
  id: string;
  name: string;
  balance: string; // Decimal serialized as string
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string | null;
  amount: string; // Decimal serialized as string
  type: TransactionType;
  category: string | null;
  date: Date;
  description: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface SavingsFund {
  id: string;
  name: string;
  balance: string;
  targetAmount: string | null;
  description: string | null;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: Date | null;
  why: string | null;
  whyNot: string | null;
  how: string | null;
}

// ──────────────────────────────────────────────────
// CAREER
// ──────────────────────────────────────────────────

export interface CareerSkill {
  id: string;
  name: string;
  description: string | null;
  level: string | null;
  category: string | null;
}

export interface CareerEvent {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  type: string | null;
}

// ──────────────────────────────────────────────────
// MEDIA
// ──────────────────────────────────────────────────

export type MediaType = "BOOK" | "MOVIE" | "SERIES" | "MUSIC" | "GAME" | "PODCAST";

export interface MediaEntry {
  id: string;
  title: string;
  type: MediaType;
  content: string | null;
  rating: number | null;
  status: string | null;
  createdAt: Date;
}

// ──────────────────────────────────────────────────
// CALENDAR
// ──────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string | null;
  reminderAt: Date | null;
}

// Unified calendar item for cross-module timeline
export type CalendarItemType = "event" | "task" | "milestone" | "goal";

export interface CalendarTimelineItem {
  id: string;
  title: string;
  date: Date;
  type: CalendarItemType;
  status?: string;
  href?: string;
}

// ──────────────────────────────────────────────────
// NEWS
// ──────────────────────────────────────────────────

export interface NewsInterest {
  id: string;
  topic: string;
  isActive: boolean;
}

// ──────────────────────────────────────────────────
// AI
// ──────────────────────────────────────────────────

export interface AIAccessPermission {
  section: string;
  isEnabled: boolean;
}
