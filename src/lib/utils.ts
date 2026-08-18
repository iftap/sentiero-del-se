import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns normalized calendar date key "YYYY-MM-DD" for a given date.
 */
export function getTodayCalendarKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date into a natural English string.
 * Example: "Monday, August 18, 2026"
 */
export function formatEnglishDate(d: Date = new Date(), timezone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(d);
}

/**
 * Formats a short date: "Aug 18, 2026"
 */
export function formatShortDate(d: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(d);
}

/**
 * Formats a relative date label: "Today", "Tomorrow", "Yesterday", or short date.
 */
export function formatRelativeDate(d: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < -1 && diff >= -7) return `${Math.abs(diff)} days ago`;
  return formatShortDate(d);
}

/**
 * Returns true if the date is in the past (before today's start).
 */
export function isOverdue(d: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Returns a calm, contextual greeting depending on the hour of the day.
 */
export function getEnglishGreeting(hour: number = new Date().getHours()): string {
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else if (hour >= 18 && hour < 22) {
    return "Good evening";
  } else {
    return "Still awake";
  }
}

/**
 * Formats seconds into a readable duration string: "1h 23m" or "45m".
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/**
 * Formats a GoalType enum value into a readable label.
 */
export function formatGoalType(type: string, customType?: string | null): string {
  if (type === "CUSTOM" && customType) return customType;
  const map: Record<string, string> = {
    SHORT_TERM: "Short-term",
    MEDIUM_TERM: "Medium-term",
    LONG_TERM: "Long-term",
    LIFE: "Life",
    ACADEMIC: "Academic",
    CAREER: "Career",
    PERSONAL: "Personal",
    GROWTH: "Growth",
    CUSTOM: "Custom",
  };
  return map[type] ?? type;
}

/**
 * Returns a motivational quote based on an index (e.g., day of year).
 */
const QUOTES = [
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Know thyself.", author: "Socrates" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

export function getDailyQuote(dayIndex: number = new Date().getDay()): { text: string; author: string } {
  return QUOTES[dayIndex % QUOTES.length];
}

/**
 * Truncates a string to a given length, adding "..." if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Returns the day name for a dayOfWeek number (0=Sunday).
 */
export function getDayName(dayOfWeek: number, short = false): string {
  const days = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek] ?? "";
}
