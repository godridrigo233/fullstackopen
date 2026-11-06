import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

function unavailableInProduction() {
  return process.env.NODE_ENV === "production"
    ? Response.json(
        { error: "This endpoint is not available in production" },
        { status: 403 },
      )
    : null;
}

export async function POST(request: Request) {
  const forbidden = unavailableInProduction();
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("name" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.name !== "string" ||
    typeof body.password !== "string" ||
    !body.username.trim() ||
    !body.name.trim() ||
    !body.password
  ) {
    return Response.json(
      { error: "username, name, and password are required." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const [user] = await getDb()
    .insert(users)
    .values({
      username: body.username.trim(),
      name: body.name.trim(),
      passwordHash,
    })
    .onConflictDoNothing({ target: users.username })
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
    });

  if (!user) {
    return Response.json({ error: "A user with this username already exists." }, { status: 409 });
  }

  return Response.json(user, { status: 201 });
}
