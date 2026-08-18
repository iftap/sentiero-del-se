import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MediaShell } from "@/features/media/components/MediaShell";
import { Clapperboard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const user = await requireUser();

  const mediaEntries = await prisma.mediaEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clapperboard size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Journal Experience</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Media Journal
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <MediaShell mediaEntries={mediaEntries} />
      </div>
    </div>
  );
}
