import React from "react";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  quote: string;
  features: string[];
  phase: string;
}

export function PlaceholderPage({ title, subtitle, quote, features, phase }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Minimal hero space */}
      <div className="pt-32 pb-20 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto animate-fade-up">
        <span className="section-label text-[var(--accent-amber)]">{phase}</span>

        <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-none tracking-tight text-[var(--text-primary)] mt-8 mb-6">
          {title}
        </h1>

        <p className="font-serif italic text-[clamp(1.1rem,2vw,1.5rem)] text-[var(--text-secondary)] max-w-xl leading-relaxed mb-16">
          {subtitle}
        </p>

        <div className="editorial-divider mb-16" />

        {/* Quote */}
        <blockquote className="intention-text text-[clamp(1.25rem,2.5vw,2rem)] text-[var(--text-muted)] mb-20 max-w-2xl">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Coming features list */}
        <div>
          <span className="section-label text-[var(--text-muted)]">What&apos;s coming</span>
          <ul className="mt-10 space-y-0">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-baseline gap-5 py-4 border-b border-[var(--border-subtle)] last:border-0"
              >
                <span className="font-mono text-[10px] text-[var(--text-ghost)] w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[15px] text-[var(--text-secondary)]">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
