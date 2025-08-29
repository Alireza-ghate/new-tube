import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";
import { db } from "..";
import { ratelimit } from "@/lib/rateLimit";

// context will call for every single procedure call (public or protected)
export const createTRPCContext = cache(async () => {
  // we should write some light logic here
  /**
   * @see: https://trpc.io/docs/server/context
   */
  // we use auth function bcs its a light weight method (it has not fetch api call)
  const { userId } = await auth();
  // userId will be same clerk user id we get from clerk dashboard
  // here we just rename it to clerkUserId for clarity
  return { clerkUserId: userId };
});

// create proper type for trpc context
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
// create a protected procedure to make sure authenticated users can only call it
export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  // if user is not logged in, throw an error
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // users objects in database will be in protectedProcedure too
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId))
    .limit(1); //eq: select user objects wich their clerkId is equal to ctx.clerkUserId

  // IF THERE IS NO USER OBJ IN OUR DATABASE (no body signed up) THROW AN ERROR
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // we check to will allow this user make more request or not
  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: { ...ctx, user },
  });
});
