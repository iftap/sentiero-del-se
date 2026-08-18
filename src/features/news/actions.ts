"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function addInterestAction(topic: string) {
  const user = await requireUser();
  if (!topic?.trim()) throw new Error("Topic required");

  const interest = await prisma.newsInterest.upsert({
    where: {
      userId_topic: {
        userId: user.id,
        topic: topic.trim(),
      },
    },
    update: { isActive: true },
    create: {
      userId: user.id,
      topic: topic.trim(),
      isActive: true,
    },
  });

  revalidatePath("/news");
  revalidatePath("/home");
  return interest;
}

export async function toggleInterestAction(interestId: string, isActive: boolean) {
  const user = await requireUser();

  const updated = await prisma.newsInterest.updateMany({
    where: { id: interestId, userId: user.id },
    data: { isActive },
  });

  revalidatePath("/news");
  revalidatePath("/home");
  return updated;
}
