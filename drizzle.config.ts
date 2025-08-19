import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
// by default dotenv looks for .env file but we have .env.local
dotenv.config({ path: ".env.local" }); // we tell it to look for .env.local instead

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
