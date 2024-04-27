import type { GetStaticProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import SuperJSON from "superjson";

import Footer from "~/components/molecule/Footer";
import NavBar from "~/components/molecule/NavBar";
import { Card } from "~/components/ui/card";
import { db } from "~/server/db";
import type { RouterOutputs } from "~/utils/api";

export const getStaticProps: GetStaticProps<{
  rawCompanies: string;
}> = async () => {
  const companies = await db.company.findMany({
    where: { Referrer: { some: {} } },
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: {
      rawCompanies: SuperJSON.stringify(companies),
    },
    // revalidate every 1 minute
    revalidate: 60 * 1,
  };
};

function CompaniesPage({
  rawCompanies,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const companies =
    SuperJSON.parse<RouterOutputs["company"]["getAll"]>(rawCompanies);

  return (
    <div className="flex w-full flex-col items-center bg-gray-50">
      <NavBar />
      <div className="flex flex-col items-center space-y-8 py-16">
        <h1 className="px-4 text-center text-4xl font-bold">
          We have referrers from these companies
        </h1>
        <div className="grid w-full max-w-screen-xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies?.map((company) => (
            <Card key={company.id} className="space-y-6 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company?.logoUrl}
                    alt={`${company?.name} logo`}
                    className="h-10 w-10 rounded border"
                  />
                  <p className="">{company?.name}</p>
                </div>
                <div className="space-x-4">
                  <a
                    href={company.jobsUrl}
                    target="_blank"
                    className="text-xs hover:underline"
                  >
                    Job Openings ↗
                  </a>

                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    className="text-xs hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                </div>
                <div className="space-x-4">
                  <Link
                    className="rounded border px-3 py-2 text-xs hover:bg-gray-100"
                    href="/dashboard"
                  >
                    Contact referrals
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CompaniesPage;
