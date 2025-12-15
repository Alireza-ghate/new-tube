import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";

// create schemas for every tables in database
// create schema for "users" table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").unique().notNull(), // clerk user id // notNull() means that this field is required // unique() means that this field must be unique
    name: text("name").notNull(), // use text when we do not know name field how many characters it will have // user varchar({ length: 255 }) for limit length of string
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(), // defaultNow() means that this field will be set to the current date and time
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)] // create unique index on "clerk_id" field for querying by clerk user id
);

// export const userRelations = relations(users, ({ many }) => ({
//   videos: many(videos),
//   videoviews: many(videoViews),
//   videoReactions: many(videoReactions),
//   subscriptions: many(subscriptions, {
//     relationName: "subscriptions_viewerId_fkey",
//   }),
//   subscribers: many(subscriptions, {
//     relationName: "subscriptions_creatorId_fkey",
//   }),
// }));

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    }),
  ]
);

// export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
//   viewerId: one(users, {
//     fields: [subscriptions.viewerId],
//     references: [users.id],
//     relationName: "subscriptions_viewerId_fkey",
//   }),
//   creatorId: one(users, {
//     fields: [subscriptions.creatorId],
//     references: [users.id],
//     relationName: "subscriptions_creatorId_fkey",
//   }),
// }));

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

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

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
  thumbnailKey: text("thumbnail_key"),
  previewKey: text("preview_key"),
  previewUrl: text("preview_url"),
  duration: integer("duration").default(0).notNull(),
  // duration: integer("duration"),
  visibility: videoVisibility("visibility")
    .default("private")
    .notNull()
    .$type<"private" | "public">(), //$type<"private" | "public">() means that this field will be of type "private" or "public" bcs if we dont do this it will be also type 2 as number
  // some of videos are connected to certain category or user, while categories are optional and users are requierd
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

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id"),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: "comments_parent_id_fkey",
      }).onDelete("cascade"),
    ];
  }
);

export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);

// we use pgEnum to define field or column should be type of "like" or "dislike"
export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);
export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => comments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId],
    }), // primary key is combination of userId and commentId
  ]
);

export const videoViews = pgTable(
  "video_views",
  {
    // 2 foriegn keys
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId],
    }), // primary key is combination of userId and videoId
  ]
);

export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);
export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoReactions = pgTable(
  "video_reactions",
  {
    // 2 foriegn keys
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "video_reactions_pk",
      columns: [t.userId, t.videoId],
    }), // primary key is combination of userId and videoId
  ]
);

export const videReactionsInsertSchema = createInsertSchema(videoReactions);
export const videReactionsUpdateSchema = createUpdateSchema(videoReactions);
export const videReactionsSelectSchema = createSelectSchema(videoReactions);

// each video can be in deffrent playlist so we need a relationship and new table
export const playlistVideos = pgTable(
  "playlist_videos",
  {
    playlistId: uuid("playlist_id")
      .references(() => playlists.id, {
        onDelete: "cascade",
      })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "playlist_videos_pk",
      columns: [t.playlistId, t.videoId],
    }),
  ]
);

export const playlists = pgTable("playlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // required field
  description: text("description"), // optional field
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // each playlist will created by a user
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
