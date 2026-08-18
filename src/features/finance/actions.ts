"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TransactionType } from "@prisma/client";

export async function createAccountAction(formData: FormData) {
  const user = await requireUser();
  const name = formData.get("name") as string;
  const balance = parseFloat(formData.get("balance") as string) || 0;
  const currency = (formData.get("currency") as string) || "USD";

  if (!name?.trim()) throw new Error("Account name required");

  const account = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      name: name.trim(),
      balance,
      currency,
    },
  });

  revalidatePath("/finance");
  return account;
}

export async function updateAccountBalanceAction(accountId: string, newBalance: number) {
  const user = await requireUser();

  const account = await prisma.financialAccount.updateMany({
    where: { id: accountId, userId: user.id },
    data: { balance: newBalance },
  });

  revalidatePath("/finance");
  return account;
}

export async function createTransactionAction(formData: FormData) {
  const user = await requireUser();
  const accountId = (formData.get("accountId") as string) || null;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as TransactionType;
  const category = (formData.get("category") as string) || null;
  const dateStr = formData.get("date") as string;
  const description = (formData.get("description") as string) || null;

  if (isNaN(amount)) throw new Error("Valid amount required");

  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      accountId,
      amount,
      type: type || "EXPENSE",
      category,
      date: dateStr ? new Date(dateStr) : new Date(),
      description,
    },
  });

  revalidatePath("/finance");
  return transaction;
}

export async function createFinancialGoalAction(formData: FormData) {
  const user = await requireUser();
  const name = formData.get("name") as string;
  const targetAmount = parseFloat(formData.get("targetAmount") as string);
  const currentAmount = parseFloat(formData.get("currentAmount") as string) || 0;
  const deadlineStr = formData.get("deadline") as string;
  const why = (formData.get("why") as string) || null;
  const whyNot = (formData.get("whyNot") as string) || null;
  const how = (formData.get("how") as string) || null;

  if (!name?.trim() || isNaN(targetAmount)) {
    throw new Error("Goal name and target amount required");
  }

  const goal = await prisma.financialGoal.create({
    data: {
      userId: user.id,
      name: name.trim(),
      targetAmount,
      currentAmount,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      why,
      whyNot,
      how,
    },
  });

  revalidatePath("/finance");
  return goal;
}
