import { videoReactions } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideoReactionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, input.videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "like") // bcs it is a like precdure
          )
        );
      if (existingVideoReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, input.videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }

      const [createdVideoReactions] = await db
        .insert(videoReactions)
        .values({
          videoId: input.videoId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdVideoReactions;
    }),

  dislike: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, input.videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "dislike") // bcs it is a like precdure
          )
        );
      if (existingVideoReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, input.videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }

      const [createdVideoReactions] = await db
        .insert(videoReactions)
        .values({
          videoId: input.videoId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return createdVideoReactions;
    }),
});
