import { candidateRouter } from "~/server/api/routers/candidate";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  candidate: candidateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
