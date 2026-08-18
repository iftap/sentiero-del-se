"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function toggleAIPermissionAction(section: string, isEnabled: boolean) {
  const user = await requireUser();

  const permission = await prisma.aIAccessPermission.upsert({
    where: {
      userId_section: {
        userId: user.id,
        section,
      },
    },
    update: { isEnabled },
    create: {
      userId: user.id,
      section,
      isEnabled,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/home");
  return permission;
}

export async function saveAIPreferenceAction(key: string, value: string) {
  const user = await requireUser();
  if (!key?.trim() || !value?.trim()) throw new Error("Key and value required");

  const pref = await prisma.aIPreference.upsert({
    where: {
      userId_key: {
        userId: user.id,
        key: key.trim(),
      },
    },
    update: { value: value.trim() },
    create: {
      userId: user.id,
      key: key.trim(),
      value: value.trim(),
    },
  });

  revalidatePath("/settings");
  return pref;
}

export async function deleteAIPreferenceAction(id: string) {
  const user = await requireUser();

  await prisma.aIPreference.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/settings");
}
