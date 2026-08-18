/**
 * AI Provider Context Payload
 * Privacy-first: Strips all sensitive personal information by default.
 */
export interface AIContextPayload {
  userId: string;
  allowSensitiveJournal?: boolean;
  timeRange?: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  };
  metrics?: {
    tasksCompletedToday?: number;
    habitsCompletedToday?: number;
    totalHabitsToday?: number;
    focusMinutesToday?: number;
  };
  activeGoalsSummary?: Array<{
    title: string;
    progressPercent: number;
    areaName?: string;
  }>;
  recentHabitsSummary?: Array<{
    title: string;
    completedToday: boolean;
  }>;
}

export type InsightType = "OBSERVATION" | "REFLECTION" | "SUGGESTION";

export interface AIInsight {
  type: InsightType;
  title: string;
  body: string;
  relevanceScore?: number; // 0 to 1
}

export interface AIProvider {
  name: string;
  generateDailyPrompt(context: AIContextPayload): Promise<string>;
  analyzePatterns(context: AIContextPayload): Promise<AIInsight[]>;
  synthesizeReflection(context: AIContextPayload): Promise<string>;
}
