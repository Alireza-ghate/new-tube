import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// create schemas for every tables in database
// create schema for "users" table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").unique().notNull(), // clerk user id // notNull() means that this field is required // unique() means that this field must be unique
    name: text("name").notNull(), // use text when we do not know name field how many characters it will have // user varchar({ length: 255 }) for limit length of string
    // TODO add banner fieled
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(), // defaultNow() means that this field will be set to the current date and time
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)] // create unique index on "clerk_id" field for querying by clerk user id
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(), //notNull() means that this field is required // unique() means that this field must be unique
    description: text("description"), //this is optional field bcs has no notNull()
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)] //create index for "name" field in case we wanted to query by name
);
