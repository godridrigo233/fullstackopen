"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { blogs, readingList } from "@/lib/db/schema";

export type BlogFormState = {
  errors: Record<string, string>;
  values: {
    title: string;
    author: string;
    url: string;
  };
  success?: boolean;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createBlog(
  _previousState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const values = {
    title: readFormValue(formData, "title"),
    author: readFormValue(formData, "author"),
    url: readFormValue(formData, "url"),
  };
  const errors: Record<string, string> = {};

  if (values.title.length < 5) errors.title = "Title must be at least 5 characters long.";
  if (values.author.length < 5) errors.author = "Author must be at least 5 characters long.";
  if (values.url.length < 5) errors.url = "URL must be at least 5 characters long.";

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isSafeInteger(userId) || userId < 1) {
    return {
      errors: { form: "You must be logged in to create a blog." },
      values,
    };
  }

  const db = getDb();
  await db.insert(blogs).values({
    ...values,
    userId,
  });

  revalidatePath("/blogs");
  return { errors: {}, values: { title: "", author: "", url: "" }, success: true };
}

export async function likeBlog(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("A valid blog id is required.");
  }

  const [updatedBlog] = await getDb()
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id))
    .returning({ id: blogs.id });

  if (!updatedBlog) {
    throw new Error("Blog not found.");
  }

  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
}

export async function addToReadingList(formData: FormData) {
  const blogId = Number(formData.get("blogId"));
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isSafeInteger(userId) || userId < 1) {
    throw new Error("You must be logged in to update your reading list.");
  }
  if (!Number.isSafeInteger(blogId) || blogId < 1) {
    throw new Error("A valid blog id is required.");
  }

  const db = getDb();
  const [blog] = await db
    .select({ id: blogs.id, userId: blogs.userId })
    .from(blogs)
    .where(eq(blogs.id, blogId))
    .limit(1);

  if (!blog) {
    throw new Error("Blog not found.");
  }
  if (blog.userId === userId) {
    throw new Error("You cannot add your own blog to your reading list.");
  }

  await db
    .insert(readingList)
    .values({ userId, blogId })
    .onConflictDoNothing({
      target: [readingList.userId, readingList.blogId],
    });

  revalidatePath(`/blogs/${blogId}`);
  revalidatePath("/me");
}
