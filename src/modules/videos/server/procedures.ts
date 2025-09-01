import { videos } from "@/db/schema";
import { db } from "@/index";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

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
});
