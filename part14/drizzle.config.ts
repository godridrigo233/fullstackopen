import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({
  path:
    process.env.CI || process.env.NODE_ENV === "test"
      ? ".env.test"
      : ".env.local",
  quiet: true,
});

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:password@localhost:5432/nextjs_blog",
  },
});
