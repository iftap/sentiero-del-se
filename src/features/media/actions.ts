"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MediaType } from "@prisma/client";

export async function createMediaEntryAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const type = formData.get("type") as MediaType;
  const content = (formData.get("content") as string) || null;
  const ratingStr = formData.get("rating") as string;
  const status = (formData.get("status") as string) || null;

  if (!title?.trim()) throw new Error("Title is required");

  const entry = await prisma.mediaEntry.create({
    data: {
      userId: user.id,
      title: title.trim(),
      type: type || "BOOK",
      content: content?.trim() || null,
      rating: ratingStr ? parseInt(ratingStr, 10) : null,
      status: status?.trim() || null,
    },
  });

  revalidatePath("/media");
  return entry;
}
