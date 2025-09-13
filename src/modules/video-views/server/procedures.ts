import { videoViews } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoViewsRouter = createTRPCRouter({
  // only logged in users counts per one userId view
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingvideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(
            eq(videoViews.userId, userId),
            eq(videoViews.videoId, input.videoId)
          )
        );

      if (existingvideoView) return existingvideoView;

      const [createVideoView] = await db
        .insert(videoViews)
        .values({ userId, videoId: input.videoId })
        .returning();

      return createVideoView;
    }),
});
