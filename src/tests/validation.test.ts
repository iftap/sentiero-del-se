import { describe, it, expect } from "vitest";
import { formatGoalType, getEnglishGreeting, isOverdue } from "@/lib/utils";

describe("Sentiero del Sé Core Utilities", () => {
  it("formats goal types correctly", () => {
    expect(formatGoalType("SHORT_TERM")).toBe("Short-term");
    expect(formatGoalType("CAREER")).toBe("Career");
    expect(formatGoalType("CUSTOM", "Custom Track")).toBe("Custom Track");
  });

  it("produces contextual greetings based on hour", () => {
    expect(getEnglishGreeting(8)).toBe("Good morning");
    expect(getEnglishGreeting(14)).toBe("Good afternoon");
    expect(getEnglishGreeting(20)).toBe("Good evening");
  });

  it("accurately detects overdue dates", () => {
    const past = new Date(Date.now() - 48 * 3600 * 1000);
    const future = new Date(Date.now() + 48 * 3600 * 1000);
    expect(isOverdue(past)).toBe(true);
    expect(isOverdue(future)).toBe(false);
  });
});
