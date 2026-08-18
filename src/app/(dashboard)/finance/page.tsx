import React from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FinanceShell } from "@/features/finance/components/FinanceShell";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const user = await requireUser();

  const [accounts, transactions, financialGoals, savingsFunds] = await Promise.all([
    prisma.financialAccount.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: { account: true },
      orderBy: { date: "desc" },
      take: 25,
    }),
    prisma.financialGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savingsFund.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="module-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} className="text-[var(--accent-blue)]" />
              <span className="section-label">Financial Module</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)]">
              Mindful Finance
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <FinanceShell
          accounts={accounts as any}
          transactions={transactions as any}
          financialGoals={financialGoals as any}
          savingsFunds={savingsFunds as any}
        />
      </div>
    </div>
  );
}
