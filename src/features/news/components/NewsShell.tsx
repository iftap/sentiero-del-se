"use client";

import React, { useState, useTransition } from "react";
import { addInterestAction, toggleInterestAction } from "@/features/news/actions";
import {
  Newspaper,
  Plus,
  RefreshCw,
  ExternalLink,
  Sparkles,
  X,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsShellProps {
  interests: any[];
}

const CATEGORIES = [
  "For You",
  "World",
  "Technology",
  "Science",
  "Business",
  "Finance",
  "Politics",
  "Sports",
  "Culture",
  "Entertainment",
];

// High-signal curated news items
const SAMPLE_CURATED_STORIES = [
  {
    id: "story-1",
    headline: "Frontier AI Architectures Move Toward Autonomous Agentic Memory Systems",
    source: "MIT Technology Review",
    time: "2 hours ago",
    category: "Technology",
    summary:
      "Recent breakthroughs in personal computing paradigms highlight interconnected memory models that orchestrate goals, tasks, and calendars seamlessly while maintaining strict user control.",
    url: "https://www.technologyreview.com",
    isMajor: true,
  },
  {
    id: "story-2",
    headline: "Global Energy Transitions: Renewable Storage Crosses Milestone Efficiency",
    source: "Reuters",
    time: "4 hours ago",
    category: "Science",
    summary:
      "Solid-state battery deployments and grid-scale storage achieve key operational benchmarks across Europe and Asia, accelerating long-term decarbonization targets.",
    url: "https://www.reuters.com",
    isMajor: false,
  },
  {
    id: "story-3",
    headline: "Central Bank Digital Settlement Infrastructure Enters Multi-Nation Trials",
    source: "Financial Times",
    time: "6 hours ago",
    category: "Finance",
    summary:
      "Cross-border payment experiments prove sub-second clearing efficiency with enhanced privacy safeguards in major financial corridors.",
    url: "https://www.ft.com",
    isMajor: false,
  },
  {
    id: "story-4",
    headline: "Cognitive Neuroscience: Qualitative Reflection Outperforms Gamified Streaks in Behavioral Retention",
    source: "Nature Human Behaviour",
    time: "8 hours ago",
    category: "Science",
    summary:
      "A longitudinal study of over 10,000 participants finds that subjective qualitative notes lead to 3x higher habit sustainability than artificial numerical streaks.",
    url: "https://www.nature.com",
    isMajor: false,
  },
];

export function NewsShell({ interests }: NewsShellProps) {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [newTopicInput, setNewTopicInput] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;

    startTransition(async () => {
      await addInterestAction(newTopicInput);
      setNewTopicInput("");
      setShowAddInterest(false);
    });
  };

  const handleToggleInterest = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleInterestAction(id, !current);
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredStories =
    activeCategory === "For You"
      ? SAMPLE_CURATED_STORIES
      : SAMPLE_CURATED_STORIES.filter(
          (s) => s.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="space-y-8">
      {/* Interests Bar */}
      <div className="p-4 rounded-2xl glass-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--accent-blue)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-medium">
              Personalized News Context
            </span>
          </div>

          <button
            onClick={() => setShowAddInterest(!showAddInterest)}
            className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            <span>Add Interest</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {interests.map((item) => (
            <span
              key={item.id}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-sans border transition-colors flex items-center gap-1.5",
                item.isActive
                  ? "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] border-[var(--accent-blue)]/30 font-medium"
                  : "bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)]"
              )}
            >
              <span>#{item.topic}</span>
              <button
                onClick={() => handleToggleInterest(item.id, item.isActive)}
                className="hover:opacity-70"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>

        {showAddInterest && (
          <form onSubmit={handleAddTopic} className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Neuroscience, Space..."
              className="form-input text-xs flex-1"
              required
            />
            <button type="submit" disabled={isPending} className="btn-primary text-xs shrink-0">
              Save Topic
            </button>
          </form>
        )}
      </div>

      {/* Category Tabs & Refresh */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 overflow-x-auto gap-4">
        <div className="flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-colors cursor-pointer",
                activeCategory === cat
                  ? "bg-[var(--accent-blue)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefresh}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors shrink-0 cursor-pointer"
          title="Refresh feed"
        >
          <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
        </button>
      </div>

      {/* Editorial Feed */}
      <div className="space-y-6">
        {filteredStories.map((story) => (
          <article
            key={story.id}
            className="p-6 sm:p-8 rounded-2xl glass-card space-y-3 hover:border-[var(--border-strong)] transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[var(--accent-blue)] font-semibold">{story.source}</span>
                <span className="text-[var(--text-ghost)]">•</span>
                <span className="text-[var(--text-muted)]">{story.time}</span>
              </div>
              <span className="badge badge-muted text-[10px]">{story.category}</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-4"
              >
                <span>{story.headline}</span>
                <ExternalLink size={18} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </h3>

            <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
              {story.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
