import { AIProvider, AIContextPayload, AIInsight } from "./types";

const PHILOSOPHICAL_PROMPTS = [
  "What single action will make today a meaningful step on your path?",
  "What deserves your deepest attention today, away from superficial urgencies?",
  "In what area of your life are you chasing perfection instead of cultivating progress?",
  "What inner obstacle can you transform today into an opportunity for clarity?",
  "Looking back on this day tonight, what choice will make you proud of your discipline?",
  "How can you simplify your focus today to act with greater presence?",
];

export class MockAIProvider implements AIProvider {
  public readonly name = "Sentiero Local Intelligence (Mock Phase 1)";

  async generateDailyPrompt(context: AIContextPayload): Promise<string> {
    if (context.userId) {
      const index = Math.floor(Math.random() * PHILOSOPHICAL_PROMPTS.length);
      return PHILOSOPHICAL_PROMPTS[index];
    }
    return PHILOSOPHICAL_PROMPTS[0];
  }

  async analyzePatterns(context: AIContextPayload): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    if (context.metrics?.habitsCompletedToday !== undefined) {
      insights.push({
        type: "OBSERVATION",
        title: "Habit Consistency",
        body: "Morning consistency anchors focus and intentionality for the entire day.",
        relevanceScore: 0.9,
      });
    }

    return insights;
  }

  async synthesizeReflection(context: AIContextPayload): Promise<string> {
    if (context.allowSensitiveJournal) {
      return "In-depth personalized reflection available in Phase 6.";
    }
    return "The day demonstrated clear focus on essential priorities.";
  }
}

export const defaultAIProvider: AIProvider = new MockAIProvider();
export * from "./types";
