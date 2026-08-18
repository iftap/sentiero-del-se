import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsShell } from "@/features/settings/components/SettingsShell";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  const [permissions, preferences] = await Promise.all([
    prisma.aIAccessPermission.findMany({
      where: { userId: user.id },
    }),
    prisma.aIPreference.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">System & Preferences</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Settings & Customization
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <SettingsShell
          user={user}
          permissions={permissions}
          preferences={preferences}
        />
      </div>
    </div>
  );
}
