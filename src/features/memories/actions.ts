"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createMemoryAction(formData: FormData) {
  const user = await requireUser();
  const caption = formData.get("caption") as string;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const videoUrl = (formData.get("videoUrl") as string) || null;
  const dateStr = formData.get("date") as string;

  if (!caption?.trim()) throw new Error("Caption is required");

  const memory = await prisma.memory.create({
    data: {
      userId: user.id,
      caption: caption.trim(),
      photoUrl: photoUrl?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      date: dateStr ? new Date(dateStr) : new Date(),
    },
  });

  revalidatePath("/memories");
  revalidatePath("/home");
  return memory;
}
