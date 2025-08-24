import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      console.log({ dbUser: opts.ctx.user });
      // throw an error for testing ErrorBoundary
      // throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      return {
        greeting: `Hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
