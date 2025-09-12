import { users, videos, videoUpdateSchema } from "@/db/schema";
import { db } from "@/index";
import { mux } from "@/lib/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import z from "zod";

export const videosRouter = createTRPCRouter({
  // getMany: baseProcedure.query(), // gets all videos

  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [existingVideo] = await db
        .select({
          ...getTableColumns(videos), // get all columns and spread them out
          user: {
            ...getTableColumns(users),
          },
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(eq(videos.id, input.id));

      if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" });
      return existingVideo;
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "NOT_FOUND" , message: "specific error message" });
    // throw new Error("something went wrong")

    const { id: userId } = ctx.user;
    // create an upload for creating videos
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        mp4_support: "audio-only,capped-1080p",
        playback_policy: ["public"],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
        passthrough: userId, // to know which user created this video or ulpoaded this video(when we upload a video mux bcs of its webhook dosnt know which user uploads the video)
      },
      cors_origin: "*", //in protuction will be my url
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "untitled",
        muxUploadId: upload.id,
        muxStatus: "waiting",
      })
      .returning();

    return { video: video, url: upload.url };
  }), // for return value from this expression we use returning()

  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) throw new TRPCError({ code: "BAD_REQUEST" });
      const [updatedVideo] = await db
        .update(videos)
        .set({
          categoryId: input.categoryId,
          title: input.title,
          description: input.description,
          updatedAt: new Date(),
          visibility: input.visibility as "private" | "public",
        }) //what fields user can update
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning(); //eq(videos.userId, userId)); // only update videos created by currently logged in user

      if (!updatedVideo) throw new TRPCError({ code: "NOT_FOUND" });

      return updatedVideo;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input; //id === video.id (we pass as argument)

      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning(); // user can only delets its own video and only delete that video currently looking at

      if (!removedVideo) throw new TRPCError({ code: "NOT_FOUND" });

      return removedVideo;
    }),

  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      // based on videoId we passed into procedure, we want to get that video associated with that videoId
      // after get video object based on that videoId we want to get its muxPlaybackId and use it to create new thumbnailUrl
      // then we want to update that video object with new thumbnailUrl
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" });

      // cleanup old files in uploadthing after restore tumbnailUrl
      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      if (!existingVideo.muxPlaybackId)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedVideo) throw new TRPCError({ code: "NOT_FOUND" });

      return updatedVideo;
    }),
});
