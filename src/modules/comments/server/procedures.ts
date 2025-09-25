import { comments, users } from "@/db/schema";
import { db } from "@/index";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";

export const commentsRouter = createTRPCRouter({
  // create comment
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { value, videoId } = input;
      const [createdComment] = await db
        .insert(comments)
        .values({ videoId, value, userId })
        .returning();
      return createdComment;
    }),

  remove: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;
      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.userId, userId), eq(comments.id, commentId)))
        .returning();

      if (!deletedComment) throw new TRPCError({ code: "NOT_FOUND" });

      return deletedComment;
    }),

  // based on videoId we want to get all comments related to this video
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({ id: z.string().uuid(), updatedAt: z.date() })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId, limit, cursor } = input;

      const [totalData, data] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        db
          .select({
            ...getTableColumns(comments),
            user: users,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          // join with users table
          .innerJoin(users, eq(comments.userId, users.id))
          .orderBy(desc(comments.createdAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor, totalCount: totalData[0].count };
    }),
});
