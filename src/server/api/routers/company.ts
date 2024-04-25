import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  subscriberGetAll: privateProcedure
    .input(z.object({ hasAccess: z.boolean() }))
    .query(({ ctx, input }) => {
      if (!input.hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.company.findMany({
        orderBy: {
          name: "asc",
        },
        where: { Referrer: { some: {} } },
        include: { Referrer: true },
      });
    }),
});
