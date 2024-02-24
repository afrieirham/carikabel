import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
});
