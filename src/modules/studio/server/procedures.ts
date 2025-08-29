import { z } from "zod";
import { videos } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const studioRouter = createTRPCRouter({
  // we use protectedProcedure bcs /studio is a p>rotected route
  // if useSuspenseInfiniteQuery() dosnt show up we use input()
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(), //means cursor is optional
        limit: z.number().min(1).max(100),
      })
    )
    // bcs its a protected precodure we can destructure ctx and input
    .query(async ({ ctx, input }) => {
      // from input {} we destructure curosr and limit
      const { limit, cursor } = input;
      // from ctx we can destructyure user id
      const { id: userId } = ctx.user; //user === currently logged in user in app
      // only selects videos that uploaded by currently logged in user
      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1); // from videos table, select videos which their userId property is eq to user.userId // in studio we want only show videos uploaded by currently logged in user notALL OTHER USERS!
      const hasMore = data.length > limit; //if data(videos uploaded by current user) are more than limit that we pass as argument in prefetchinfinite
      const items = hasMore ? data.slice(0, -1) : data;
      // set the cursor to last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;
      return { items, nextCursor };
    }),
});
