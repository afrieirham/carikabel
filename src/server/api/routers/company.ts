import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const companies = await ctx.db.company.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return companies.map((c) => ({
      ...c,
      selectValue: JSON.stringify({
        id: c.id,
        name: c.name,
      }).replaceAll('"', "'"),
    }));
  }),
});
