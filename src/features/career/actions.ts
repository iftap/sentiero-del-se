"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createCareerEventAction(formData: FormData) {
  const user = await requireUser();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const dateStr = formData.get("date") as string;
  const type = (formData.get("type") as string) || null;

  if (!title?.trim()) throw new Error("Title is required");

  const event = await prisma.careerEvent.create({
    data: {
      userId: user.id,
      title: title.trim(),
      description,
      date: dateStr ? new Date(dateStr) : new Date(),
      type,
    },
  });

  revalidatePath("/career");
  return event;
}

export async function createCareerSkillAction(formData: FormData) {
  const user = await requireUser();
  const name = formData.get("name") as string;
  const category = (formData.get("category") as string) || null;
  const level = (formData.get("level") as string) || null;

  if (!name?.trim()) throw new Error("Skill name is required");

  const skill = await prisma.careerSkill.create({
    data: {
      userId: user.id,
      name: name.trim(),
      category,
      level,
    },
  });

  revalidatePath("/career");
  return skill;
}
