import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { blogs, readingList, users } from "@/lib/db/schema";

export async function getBlogs(filter = "") {
  const db = getDb();

  return db
    .select()
    .from(blogs)
    .where(filter ? ilike(blogs.title, `%${filter}%`) : undefined)
    .orderBy(desc(blogs.likes), asc(blogs.id));
}

export async function getBlog(id: number) {
  return getDb().query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      user: {
        columns: {
          username: true,
          name: true,
        },
      },
    },
  });
}

export async function getUsers() {
  return getDb()
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
    })
    .from(users)
    .orderBy(asc(users.username));
}

export async function getUserWithBlogs(username: string) {
  return getDb().query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: {
        orderBy: [desc(blogs.likes), asc(blogs.id)],
      },
    },
  });
}

export async function getUserProfile(id: number) {
  return getDb().query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      username: true,
      name: true,
      token: true,
    },
    with: {
      readingList: {
        with: {
          blog: true,
        },
        orderBy: [desc(readingList.id)],
      },
    },
  });
}

export async function isOnReadingList(userId: number, blogId: number) {
  const [entry] = await getDb()
    .select({ id: readingList.id })
    .from(readingList)
    .where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)))
    .limit(1);

  return Boolean(entry);
}
