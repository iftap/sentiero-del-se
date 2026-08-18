import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { KnowledgeShell } from "@/features/knowledge/components/KnowledgeShell";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const user = await requireUser();

  const folders = await prisma.knowledgeFolder.findMany({
    where: { userId: user.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      concepts: { orderBy: { createdAt: "desc" } },
      resources: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Second Brain & Library</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Knowledge
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <KnowledgeShell folders={folders} />
      </div>
    </div>
  );
}
