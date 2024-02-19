import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const candidateRouter = createTRPCRouter({
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.candidate.findMany({ take: 10 });
  // }),
});
