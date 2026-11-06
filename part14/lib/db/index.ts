import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type AppDatabase = PostgresJsDatabase<typeof schema>;

const globalForDatabase = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
  appDatabase?: AppDatabase;
};

export function getDb(): AppDatabase {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to access the database.");
  }

  if (!globalForDatabase.postgresClient) {
    globalForDatabase.postgresClient = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  if (!globalForDatabase.appDatabase) {
    globalForDatabase.appDatabase = drizzle(globalForDatabase.postgresClient, {
      schema,
    });
  }

  return globalForDatabase.appDatabase;
}
