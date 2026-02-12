import { subscriptions, users } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";

export const subscriptionsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            creatorId: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(), //means cursor is optional
        limit: z.number().min(1).max(100),
      }),
    )
    // bcs its a protected precodure we can destructure ctx and input
    .query(async ({ input, ctx }) => {
      // from input {} we destructure curosr and limit
      const { limit, cursor } = input;
      // from ctx we can destructyure user id
      const { id: userId } = ctx.user;

      // only selects videos that uploaded by currently logged in user
      const data = await db
        .select({
          ...getTableColumns(subscriptions),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id),
            ),
          },
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.creatorId, users.id))
        .where(
          and(
            eq(subscriptions.viewerId, userId), // if userId provided only feteches videos who created/uploader by that user
            cursor
              ? or(
                  lt(subscriptions.updatedAt, cursor.updatedAt),
                  and(
                    eq(subscriptions.updatedAt, cursor.updatedAt),
                    lt(subscriptions.creatorId, cursor.creatorId),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
        .limit(limit + 1); // from videos table, select videos which their userId property is eq to user.userId // in studio we want only show videos uploaded by currently logged in user notALL OTHER USERS!
      const hasMore = data.length > limit; //if data(videos uploaded by current user) are more than limit that we pass as argument in prefetchinfinite
      const items = hasMore ? data.slice(0, -1) : data;
      // set the cursor to last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { creatorId: lastItem.creatorId, updatedAt: lastItem.updatedAt }
        : null;
      return { items, nextCursor };
    }),
  create: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      // if users try to subscribe to themself we throw error
      if (userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST" });

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({ viewerId: ctx.user.id, creatorId: userId })
        .returning();

      return createdSubscription;
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      // if users try to subscribe to themself we throw error
      if (userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST" });

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, ctx.user.id),
            eq(subscriptions.creatorId, userId),
          ),
        )
        .returning();

      return deletedSubscription;
    }),
});
