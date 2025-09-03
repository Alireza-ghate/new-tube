import {
  integer,
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

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"), //can be null (its optional field)
  muxStatus: text("mux_status"), // shows the status of video process in mux (ready or waiting)
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  duration: integer("duration"),
  // some of videos are connected to certain category or user while categories are optional and users are requierd
  // each video obj has 3 ids: category id and user id and its own id
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), //required field //{ onDelete: "cascade" }: if user is deleted, delete all videos created by this user(userId=23 deleted , all videos created by userId=23 also deleted)
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }), // optional field //{onDelete: "set null"} if we deleted a category, all videos related to that category wont be deleted instead their categoryId gonna be NULL
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
