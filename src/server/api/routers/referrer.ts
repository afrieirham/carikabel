import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const referrerRouter = createTRPCRouter({
  createDraftReferrer: privateProcedure
    .input(
      z.object({
        // referrer details
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        jobTitle: z.string(),

        // company details
        companyId: z.string().nullable(),
        companyName: z.string().nullable(),
        linkedinUrl: z.string().nullable(),
        jobsUrl: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let companyId = input.companyId;
      const { companyName, linkedinUrl, jobsUrl } = input;

      // create new company if required field has value
      if (companyName && linkedinUrl && jobsUrl) {
        try {
          const newCompany = await ctx.db.company.create({
            data: {
              name: companyName,
              linkedinUrl: linkedinUrl,
              jobsUrl: jobsUrl,
              logoUrl: "", // TODO implement photo upload
            },
          });

          companyId = newCompany.id;
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }

      // throw error if new company required field is null and companyId also is null
      if (!companyId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // create referrer and connect
      return ctx.db.referrer.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          jobTitle: input.jobTitle,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
    }),
});
