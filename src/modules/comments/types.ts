import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

// generates a type that represents the shape of the data returned by the getmany method in the comment router, without having to manually write out the type definition.
export type CommentsGetManyOutput =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];
