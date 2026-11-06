"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type RegistrationState = {
  errors: Record<string, string>;
  values: {
    username: string;
    name: string;
  };
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerUser(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");
  const values = {
    username: readFormValue(formData, "username"),
    name: readFormValue(formData, "name"),
    password: typeof password === "string" ? password : "",
    passwordConfirm: typeof passwordConfirm === "string" ? passwordConfirm : "",
  };
  const errors: Record<string, string> = {};

  if (values.username.length < 4) {
    errors.username = "Username must be at least 4 characters long.";
  }
  if (values.name.length < 1) {
    errors.name = "Name is required.";
  }
  if (values.password.length < 4) {
    errors.password = "Password must be at least 4 characters long.";
  }
  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { username: values.username, name: values.name },
    };
  }

  const passwordHash = await bcrypt.hash(values.password, 10);
  const [user] = await getDb()
    .insert(users)
    .values({
      username: values.username,
      name: values.name,
      passwordHash,
    })
    .onConflictDoNothing({ target: users.username })
    .returning({ id: users.id });

  if (!user) {
    return {
      errors: { username: "A user with this username already exists." },
      values: { username: values.username, name: values.name },
    };
  }

  redirect("/login");
}
