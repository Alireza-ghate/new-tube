// initialize the connection
// Connect Drizzle ORM to the database
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.DATABASE_URL!); //typescript dosn't know that DATABASE_URL will be a string, it think it will undefined
