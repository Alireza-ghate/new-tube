import { commentReactions } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingCommentReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, input.commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "like") // bcs it is a like precdure
          )
        );
      if (existingCommentReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, input.commentId),
              eq(commentReactions.userId, userId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }

      const [createdCommentReactions] = await db
        .insert(commentReactions)
        .values({
          commentId: input.commentId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdCommentReactions;
    }),

  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingCommentReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, input.commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "dislike") // bcs it is a like precdure
          )
        );
      if (existingCommentReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, input.commentId),
              eq(commentReactions.userId, userId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }

      const [createdCommentReactions] = await db
        .insert(commentReactions)
        .values({
          commentId: input.commentId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return createdCommentReactions;
    }),
});
