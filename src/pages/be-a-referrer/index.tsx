import { UserButton } from "@clerk/nextjs";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import superjson from "superjson";

import { Input } from "~/components/ui/input";
import { db } from "~/server/db";
import type { RouterOutputs } from "~/utils/api";

export const getServerSideProps = (async () => {
  const companies = await db.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: {
      rawCompanies: superjson.stringify(companies),
    },
  };
}) satisfies GetServerSideProps<{ rawCompanies: string }>;

type CompanyOutput = RouterOutputs["company"]["getAll"][number];

function BeAReferrer({
  rawCompanies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const originalCompanies = superjson.parse<CompanyOutput[]>(rawCompanies);

  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState(originalCompanies);

  useEffect(() => {
    const newCompanies = originalCompanies.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );

    const timeout = setTimeout(() => {
      setCompanies(newCompanies);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, originalCompanies]);

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-2 bg-gray-50">
      <nav className="w-full border-b bg-white">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-4">
            <p className="text-3xl sm:block">🤝</p>
            <p>CariKabel.com</p>
          </Link>
          <UserButton
            showName
            appearance={{
              elements: { userButtonTrigger: "bg-gray-100 py-1.5 px-2" },
            }}
          />
        </div>
      </nav>
      <div className="flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row">
        <div className="flex w-full flex-col space-y-4 py-6">
          <h2 className="text-center font-bold">
            Are you from any of these company?
          </h2>

          <div className="mx-auto w-full max-w-sm">
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company..."
            />
          </div>

          <div className="grid w-full max-w-screen-xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="rounded-md border bg-white p-4 text-sm hover:bg-gray-100">
              Add new company
            </button>
            {companies.map((c) => (
              <button
                key={c.id}
                className="rounded-md border bg-white p-2 text-sm hover:bg-gray-100"
              >
                <div className="flex items-center gap-4">
                  <Image
                    width={200}
                    height={200}
                    src={c?.logoUrl}
                    alt={`${c?.name} logo`}
                    className="h-10 w-10 rounded border"
                  />
                  <p className="">{c?.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeAReferrer;
