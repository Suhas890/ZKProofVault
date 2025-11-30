import { defineConfig } from "drizzle-kit";

// FIX: Commented out the check. Since .env.development sets DATABASE_URL="",
// this check would crash the application when the database is not in use.
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL, ensure the database is provisioned");
// }

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});