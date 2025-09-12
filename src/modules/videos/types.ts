import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

// generates a type that represents the shape of the data returned by the getOne method in the videos router, without having to manually write out the type definition.
export type VideoGetOneOutput =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];
