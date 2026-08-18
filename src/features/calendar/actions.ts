"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createCalendarEventAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const time = (formData.get("time") as string) || null;

  if (!title?.trim() || !dateStr) {
    throw new Error("Event title and date are required");
  }

  const event = await prisma.calendarEvent.create({
    data: {
      userId: user.id,
      title: title.trim(),
      date: new Date(dateStr),
      time: time ? time.trim() : null,
    },
  });

  revalidatePath("/calendar");
  revalidatePath("/home");
  return event;
}
