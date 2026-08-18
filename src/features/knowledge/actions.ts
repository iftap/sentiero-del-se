"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createFolderAction(name: string) {
  const user = await requireUser();
  if (!name?.trim()) throw new Error("Folder name is required");

  const folder = await prisma.knowledgeFolder.create({
    data: {
      userId: user.id,
      name: name.trim(),
    },
  });

  revalidatePath("/knowledge");
  return folder;
}

export async function createNoteAction(folderId: string, title: string, content: string) {
  const user = await requireUser();
  if (!title?.trim()) throw new Error("Note title is required");

  const note = await prisma.knowledgeNote.create({
    data: {
      userId: user.id,
      folderId,
      title: title.trim(),
      content: content || "",
    },
  });

  revalidatePath("/knowledge");
  return note;
}

export async function createConceptAction(
  folderId: string,
  data: { title: string; explanation?: string; notes?: string; examples?: string }
) {
  const user = await requireUser();
  if (!data.title?.trim()) throw new Error("Concept title is required");

  const concept = await prisma.knowledgeConcept.create({
    data: {
      userId: user.id,
      folderId,
      title: data.title.trim(),
      explanation: data.explanation?.trim() || null,
      notes: data.notes?.trim() || null,
      examples: data.examples?.trim() || null,
    },
  });

  revalidatePath("/knowledge");
  return concept;
}

export async function createResourceAction(folderId: string, title: string, url?: string) {
  const user = await requireUser();
  if (!title?.trim()) throw new Error("Resource title is required");

  const resource = await prisma.knowledgeResource.create({
    data: {
      userId: user.id,
      folderId,
      title: title.trim(),
      url: url?.trim() || null,
    },
  });

  revalidatePath("/knowledge");
  return resource;
}
