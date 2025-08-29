import { videos } from "@/db/schema";
import { db } from "@/index";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  // getMany: baseProcedure.query(), // gets all videos
  create: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "NOT_FOUND" , message: "specific error message" });
    // throw new Error("something went wrong")
    const { id: userId } = ctx.user;
    const [video] = await db
      .insert(videos)
      .values({ userId, title: "untitled" })
      .returning();

    return { video };
  }), // for return value from this expression we use returning()
});
