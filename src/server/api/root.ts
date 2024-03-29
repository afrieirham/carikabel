import { createTRPCRouter } from "~/server/api/trpc";
import { companyRouter } from "./routers/company";
import { referrerRouter } from "./routers/referrer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  referrer: referrerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
