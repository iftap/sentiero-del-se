import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NewsShell } from "@/features/news/components/NewsShell";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const user = await requireUser();

  const interests = await prisma.newsInterest.findMany({
    where: { userId: user.id },
    orderBy: { topic: "asc" },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">World Context & Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Personalized News Feed
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <NewsShell interests={interests} />
      </div>
    </div>
  );
}
