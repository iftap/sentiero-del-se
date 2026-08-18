"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createSubjectAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const name = formData.get("name") as string;
  const grade = (formData.get("grade") as string) || null;

  if (!name?.trim()) throw new Error("Subject name is required");

  await prisma.studySubject.create({
    data: {
      userId: user.id,
      name: name.trim(),
      grade: grade ? grade.trim() : null,
    },
  });

  revalidatePath("/study");
}

export async function createRoutineAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const subjectId = formData.get("subjectId") as string;
  const dayOfWeek = parseInt(formData.get("dayOfWeek") as string, 10);
  const startTime = formData.get("startTime") as string;

  if (!subjectId || isNaN(dayOfWeek) || !startTime) {
    throw new Error("Missing routine fields");
  }

  await prisma.studyRoutine.create({
    data: {
      userId: user.id,
      subjectId,
      dayOfWeek,
      startTime: startTime.trim(),
    },
  });

  revalidatePath("/study");
}
