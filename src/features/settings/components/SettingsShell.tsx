"use client";

import React, { useState, useTransition } from "react";
import {
  toggleAIPermissionAction,
  saveAIPreferenceAction,
  deleteAIPreferenceAction,
} from "@/features/settings/actions";
import {
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  Brain,
  Download,
  Upload,
  Plus,
  Trash2,
  Bell,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsShellProps {
  user: any;
  permissions: any[];
  preferences: any[];
}

const ALL_SECTIONS = [
  { id: "growth",    label: "Growth (Tasks, Goals, Habits, Assessments)" },
  { id: "study",     label: "Study & Academic Routines" },
  { id: "knowledge", label: "Knowledge Base (Notes, Concepts, Resources)" },
  { id: "finance",   label: "Finance & Accounts" },
  { id: "career",    label: "Career Timeline & Skills" },
  { id: "memories",  label: "Memories (Visual Archive)" },
  { id: "media",     label: "Media Journal" },
  { id: "calendar",  label: "Calendar & Deadlines" },
  { id: "news",      label: "News Curation & Context" },
];

export function SettingsShell({
  user,
  permissions,
  preferences,
}: SettingsShellProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });

  const [newPrefKey, setNewPrefKey] = useState("");
  const [newPrefValue, setNewPrefValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleTogglePermission = (section: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleAIPermissionAction(section, !currentStatus);
    });
  };

  const handleAddPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefKey.trim() || !newPrefValue.trim()) return;

    startTransition(async () => {
      await saveAIPreferenceAction(newPrefKey, newPrefValue);
      setNewPrefKey("");
      setNewPrefValue("");
    });
  };

  const handleDeletePreference = (id: string) => {
    startTransition(async () => {
      await deleteAIPreferenceAction(id);
    });
  };

  const isSectionEnabled = (sectionId: string) => {
    const perm = permissions.find((p) => p.section === sectionId);
    return perm ? perm.isEnabled : false;
  };

  return (
    <div className="max-w-4xl space-y-12">
      {/* ── 1. APPEARANCE ── */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4">
        <div>
          <span className="section-label">Visual Theme</span>
          <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
            Appearance
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
          <button
            onClick={() => toggleTheme("dark")}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer",
              theme === "dark"
                ? "bg-[var(--accent-blue-bg)] border-[var(--accent-blue)] text-[var(--accent-blue)] font-medium"
                : "glass-card border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <Moon size={20} />
            <span className="font-sans text-xs">Dark Mode (Primary)</span>
          </button>

          <button
            onClick={() => toggleTheme("light")}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer",
              theme === "light"
                ? "bg-[var(--accent-blue-bg)] border-[var(--accent-blue)] text-[var(--accent-blue)] font-medium"
                : "glass-card border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <Sun size={20} />
            <span className="font-sans text-xs">Light Mode</span>
          </button>
        </div>
      </div>

      {/* ── 2. AI ACCESS PERMISSIONS ── */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[var(--accent-blue)]" />
            <span className="section-label">User Control & Privacy</span>
          </div>
          <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
            AI Assistant Module Permissions
          </h2>
          <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
            Choose which modules the Sentiero AI layer has permission to read and orchestrate.
            AI cannot modify existing records or delete data without explicit confirmation.
          </p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {ALL_SECTIONS.map((sec) => {
            const enabled = isSectionEnabled(sec.id);
            return (
              <div
                key={sec.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--text-primary)]">
                    {sec.label}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--text-ghost)] uppercase">
                    Section: {sec.id}
                  </p>
                </div>

                <button
                  onClick={() => handleTogglePermission(sec.id, enabled)}
                  disabled={isPending}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    enabled ? "bg-[var(--accent-blue)]" : "bg-[var(--bg-subtle)]"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      enabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. EXPLICIT AI PREFERENCES ── */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[var(--accent-amber)]" />
            <span className="section-label">Transparent AI Memory</span>
          </div>
          <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
            Saved AI Preferences
          </h2>
          <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
            Persistent AI preferences are explicitly stored by you rather than inferred silently.
          </p>
        </div>

        {/* Existing Preferences */}
        {preferences.length === 0 ? (
          <p className="text-xs font-sans text-[var(--text-muted)] italic">
            No custom AI preferences saved yet (e.g. &ldquo;Keep my tasks simple&rdquo;).
          </p>
        ) : (
          <div className="space-y-2">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-blue)] font-medium">
                    {pref.key}
                  </p>
                  <p className="font-sans text-xs text-[var(--text-primary)] mt-0.5">
                    {pref.value}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePreference(pref.id)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--status-error)] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Preference Form */}
        <form
          onSubmit={handleAddPreference}
          className="p-4 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)] space-y-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
            Add Explicit Preference Rule
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newPrefKey}
              onChange={(e) => setNewPrefKey(e.target.value)}
              placeholder="Rule Name (e.g. Task Style)..."
              className="form-input text-xs"
              required
            />
            <input
              type="text"
              value={newPrefValue}
              onChange={(e) => setNewPrefValue(e.target.value)}
              placeholder="Instruction (e.g. Always keep my tasks simple)..."
              className="form-input text-xs"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary text-xs">
              <Plus size={12} />
              <span>Save AI Preference</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 4. DATA & BACKUP ── */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4">
        <div>
          <span className="section-label">Portability & Ownership</span>
          <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
            One Complete Sentiero Backup
          </h2>
          <p className="font-sans text-xs text-[var(--text-muted)] mt-1">
            Export your entire interconnected Personal OS into a single unified JSON backup file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => alert("Sentiero full backup export prepared.")}
            className="btn-ghost text-xs flex items-center gap-2"
          >
            <Download size={14} />
            <span>Export Sentiero Backup File</span>
          </button>

          <button
            onClick={() => alert("Restore wizard ready.")}
            className="btn-ghost text-xs flex items-center gap-2"
          >
            <Upload size={14} />
            <span>Restore Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
