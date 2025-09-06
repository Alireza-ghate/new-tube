import { videos, videoUpdateSchema } from "@/db/schema";
import { db } from "@/index";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const videosRouter = createTRPCRouter({
  // getMany: baseProcedure.query(), // gets all videos
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
          // visibility: input.visibility,
        }) //what fields user can update
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning(); // only update videos created by currently logged in user()eq(videos.userId, userId)); // only update videos created by currently logged in user

      if (!updatedVideo) throw new TRPCError({ code: "NOT_FOUND" });
    }),
});
