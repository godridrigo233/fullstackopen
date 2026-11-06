import { getDb } from "@/lib/db";
import { blogs, readingList, users } from "@/lib/db/schema";

function unavailableInProduction() {
  return process.env.NODE_ENV === "production"
    ? Response.json(
        { error: "This endpoint is not available in production" },
        { status: 403 },
      )
    : null;
}

export async function DELETE() {
  const forbidden = unavailableInProduction();
  if (forbidden) return forbidden;

  const db = getDb();
  await db.delete(readingList);
  await db.delete(blogs);
  await db.delete(users);

  return Response.json({ message: "Database reset" });
}
