"use client";

import React, { useState, useTransition } from "react";
import {
  createAccountAction,
  createTransactionAction,
  createFinancialGoalAction,
  updateAccountBalanceAction,
} from "@/features/finance/actions";
import { formatEnglishDate, formatShortDate, cn } from "@/lib/utils";
import {
  Wallet,
  Plus,
  TrendingDown,
  TrendingUp,
  Target,
  X,
  CreditCard,
  Edit2,
  Check,
} from "lucide-react";

interface FinanceShellProps {
  accounts: any[];
  transactions: any[];
  financialGoals: any[];
  savingsFunds: any[];
}

export function FinanceShell({
  accounts,
  transactions,
  financialGoals,
  savingsFunds,
}: FinanceShellProps) {
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState("");
  const [txFilter, setTxFilter] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL");
  const [isPending, startTransition] = useTransition();

  const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createAccountAction(fd);
      setShowNewAccountModal(false);
    });
  };

  const handleCreateTx = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTransactionAction(fd);
      setShowNewTxModal(false);
    });
  };

  const handleCreateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createFinancialGoalAction(fd);
      setShowNewGoalModal(false);
    });
  };

  const handleSaveBalance = (accountId: string) => {
    const val = parseFloat(newBalanceInput);
    if (isNaN(val)) return;

    startTransition(async () => {
      await updateAccountBalanceAction(accountId, val);
      setEditingAccountId(null);
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === "ALL") return true;
    return t.type === txFilter;
  });

  return (
    <div className="space-y-12">
      {/* ── ACCOUNTS BAR ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="section-label">Manual Balances</span>
            <h2 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
              Accounts & Wallets
            </h2>
          </div>
          <button
            onClick={() => setShowNewAccountModal(true)}
            className="btn-primary text-xs"
          >
            <Plus size={13} />
            <span>New Account</span>
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="p-6 rounded-2xl glass-card text-center text-xs font-sans text-[var(--text-muted)]">
            No accounts added. Track cash, digital wallets, or bank accounts with user-controlled manual balances.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accounts.map((acc) => {
              const isEditing = editingAccountId === acc.id;
              return (
                <div
                  key={acc.id}
                  className="p-5 rounded-2xl glass-card space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-medium text-[var(--text-muted)]">
                      {acc.name}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--accent-blue)]">
                      {acc.currency}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="number"
                        step="0.01"
                        value={newBalanceInput}
                        onChange={(e) => setNewBalanceInput(e.target.value)}
                        className="form-input text-xs py-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveBalance(acc.id)}
                        disabled={isPending}
                        className="p-1.5 rounded bg-[var(--accent-blue)] text-white shrink-0"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => setEditingAccountId(null)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] shrink-0"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between pt-1">
                      <div className="font-mono text-2xl font-medium text-[var(--text-primary)]">
                        {acc.currency === "USD" ? "$" : ""}{Number(acc.balance).toLocaleString()}
                      </div>
                      <button
                        onClick={() => {
                          setEditingAccountId(acc.id);
                          setNewBalanceInput(String(acc.balance));
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-opacity p-1"
                        title="Manually adjust balance"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}

                  <p className="font-mono text-[9px] text-[var(--text-ghost)]">
                    Manual balance control
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TRANSACTIONS & GOALS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Transaction Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="section-label">Log History</span>
              <h3 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
                Transactions
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[var(--bg-subtle)] p-1 rounded-xl text-xs font-sans">
                {(["ALL", "EXPENSE", "INCOME"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTxFilter(filter)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer",
                      txFilter === filter
                        ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium shadow-sm"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    {filter === "ALL" ? "All" : filter === "EXPENSE" ? "Expenses" : "Income"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowNewTxModal(true)}
                className="btn-primary text-xs"
              >
                <Plus size={13} />
                <span>Log</span>
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl text-xs font-sans text-[var(--text-muted)]">
              No transactions recorded in this view.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)] glass-card rounded-2xl p-4">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        tx.type === "INCOME"
                          ? "bg-[var(--status-success)]/10 text-[var(--status-success)]"
                          : "bg-[var(--status-error)]/10 text-[var(--status-error)]"
                      )}
                    >
                      {tx.type === "INCOME" ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    </div>

                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-[var(--text-primary)] truncate">
                        {tx.description || tx.category || "Transaction"}
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)]">
                        <span>{formatShortDate(new Date(tx.date))}</span>
                        {tx.category && (
                          <>
                            <span>•</span>
                            <span>{tx.category}</span>
                          </>
                        )}
                        {tx.account && (
                          <>
                            <span>•</span>
                            <span>{tx.account.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "font-mono text-sm font-medium shrink-0",
                      tx.type === "INCOME" ? "text-[var(--status-success)]" : "text-[var(--status-error)]"
                    )}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Financial Goals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="section-label">Targets</span>
              <h3 className="font-serif text-xl font-medium text-[var(--text-primary)] mt-0.5">
                Financial Goals
              </h3>
            </div>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Add Target</span>
            </button>
          </div>

          {financialGoals.length === 0 ? (
            <div className="p-6 rounded-2xl glass-card text-center text-xs font-sans text-[var(--text-muted)]">
              No financial goals set. Track dedicated targets with Why, Why Not, and How.
            </div>
          ) : (
            <div className="space-y-4">
              {financialGoals.map((g) => {
                const target = Number(g.targetAmount);
                const current = Number(g.currentAmount);
                const percent = Math.min(100, Math.round((current / target) * 100)) || 0;
                return (
                  <div
                    key={g.id}
                    className="p-5 rounded-2xl glass-card space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                        {g.name}
                      </h4>
                      <span className="font-mono text-xs text-[var(--accent-blue)]">
                        {percent}%
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
                      <span>${current.toLocaleString()}</span>
                      <span>Target: ${target.toLocaleString()}</span>
                    </div>

                    {g.why && (
                      <p className="font-serif italic text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)] line-clamp-2">
                        &ldquo;{g.why}&rdquo;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Create Account
              </h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Account name (e.g. Cash, Savings, bKash)..."
                className="form-input text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="Starting Balance..."
                  className="form-input text-xs"
                  defaultValue="0"
                />
                <input
                  name="currency"
                  type="text"
                  placeholder="Currency (USD, EUR, ৳)..."
                  className="form-input text-xs"
                  defaultValue="USD"
                />
              </div>
              <p className="font-mono text-[10px] text-[var(--text-ghost)]">
                Note: Balances are user-controlled and manual.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewAccountModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {showNewTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Log Transaction
              </h3>
              <button
                onClick={() => setShowNewTxModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateTx} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Type
                  </label>
                  <select name="type" className="form-input text-xs" defaultValue="EXPENSE">
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Description
                </label>
                <input
                  name="description"
                  type="text"
                  placeholder="e.g. Server hosting, Book purchase..."
                  className="form-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Category
                  </label>
                  <input
                    name="category"
                    type="text"
                    placeholder="e.g. Tech, Groceries, Salary..."
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Date
                  </label>
                  <input name="date" type="date" className="form-input text-xs" />
                </div>
              </div>

              {accounts.length > 0 && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Account (Optional tag)
                  </label>
                  <select name="accountId" className="form-input text-xs">
                    <option value="">None</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewTxModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Financial Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Create Financial Target
              </h3>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Target name (e.g. 6-Month Runway)..."
                className="form-input text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="Target Amount ($)..."
                  className="form-input text-xs"
                  required
                />
                <input
                  name="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="Current Amount ($)..."
                  className="form-input text-xs"
                  defaultValue="0"
                />
              </div>
              <textarea
                name="why"
                placeholder="Why does this financial target matter?..."
                className="form-input text-xs resize-none"
                rows={2}
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
