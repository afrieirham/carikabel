import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { addYears, format, formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import DashboardNavBar from "~/components/molecule/DashboardNavBar";
import Footer from "~/components/molecule/Footer";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useHostName } from "~/hooks/useHostName";
import { api } from "~/utils/api";

export default function Dashboard() {
  const hostname = useHostName();
  const [loading, setLoading] = useState(false);
  const auth = useUser();
  const router = useRouter();

  const today = new Date();
  const expiredAt = auth.user?.publicMetadata.expiredAt as string;
  const expiredDate = new Date(expiredAt);
  const hasAccess = today < expiredDate;

  const response = api.company.subscriberGetAll.useQuery({ hasAccess });
  const companies = response.data;
  const isLoading = response.isLoading;

  if (!auth.user) {
    return null;
  }

  const onSubscribe = async () => {
    setLoading(true);
    try {
      const { data }: { data: { redirect: string } } = await axios.post(
        "/api/stripe/checkout",
        {
          email: auth.user.primaryEmailAddress?.emailAddress,
          clerkId: auth.user.id,
          expiredAt: addYears(today, 1).toISOString(),
          baseUrl: hostname,
        },
      );
      void router.push(data.redirect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-2 bg-gray-50">
      <SEOHead
        title="Dashboard | CariKabel.com"
        description="CariKabel.com is a platform that connects you (the job seekers) with employees from a company."
        path="/dashboard"
        ogPath=""
      />
      <DashboardNavBar />
      {!hasAccess && (
        <main className="flex w-full flex-col items-center justify-center gap-4 pt-8">
          <p>You have no access. Subscribe to get 1-year access.</p>
          <Button onClick={onSubscribe} loading={loading}>
            Subscribe
          </Button>
        </main>
      )}
      <div className="flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row">
        {hasAccess && (
          <div className="w-full text-xs">
            <p>
              Access for {formatDistanceToNow(parseISO(expiredAt))}.{" "}
              <br className="sm:hidden" />
              Valid until{" "}
              {format(parseISO(expiredAt), "(EEE, do MMM yyyy 'at' h:mmaaa)")}.
            </p>
          </div>
        )}
        <Button className="w-full sm:w-auto" variant="outline" asChild>
          <Link href="/be-a-referrer">Apply as referrer</Link>
        </Button>
      </div>
      {hasAccess && isLoading && (
        <div className="mx-auto flex items-center justify-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-loader animate-spin"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#2c3e50"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 6l0 -3" />
            <path d="M16.25 7.75l2.15 -2.15" />
            <path d="M18 12l3 0" />
            <path d="M16.25 16.25l2.15 2.15" />
            <path d="M12 18l0 3" />
            <path d="M7.75 16.25l-2.15 2.15" />
            <path d="M6 12l-3 0" />
            <path d="M7.75 7.75l-2.15 -2.15" />
          </svg>
        </div>
      )}
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
            <div className="space-y-2">
              <p className="text-xs underline">Referrers</p>
              <div className="space-y-4">
                {company.Referrer.map((referrer) => (
                  <div key={referrer.id} className="space-y-1 text-xs">
                    <p className="font-bold">{referrer.name}</p>
                    <p>{referrer.jobTitle}</p>
                    <p>{referrer.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Footer />
    </div>
  );
}
