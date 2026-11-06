"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { readingList, users } from "@/lib/db/schema";

export async function generateApiToken() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isSafeInteger(userId) || userId < 1) {
    throw new Error("You must be logged in to generate an API token.");
  }

  const token = crypto.randomUUID();
  await getDb().update(users).set({ token }).where(eq(users.id, userId));
  revalidatePath("/me");
}

export async function markAsRead(formData: FormData) {
  const blogId = Number(formData.get("blogId"));
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isSafeInteger(userId) || userId < 1) {
    throw new Error("You must be logged in to update your reading list.");
  }
  if (!Number.isSafeInteger(blogId) || blogId < 1) {
    throw new Error("A valid blog id is required.");
  }

  await getDb()
    .update(readingList)
    .set({ read: true })
    .where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)));

  revalidatePath("/me");
}
