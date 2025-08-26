import { categories } from "@/db/schema";
import { db } from "@/index";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  // Gets data from "categories" table
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(categories);

    return data;
  }),
});
