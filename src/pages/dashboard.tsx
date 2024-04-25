import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { addYears, formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";

import { Button } from "~/components/ui/button";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const auth = useUser();
  const router = useRouter();

  const today = new Date();
  const expiredAt = auth.user?.publicMetadata.expiredAt as string;
  const expiredDate = new Date(expiredAt);
  const hasAccess = today < expiredDate;

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
        },
      );
      void router.push(data.redirect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-2">
      <nav className="flex w-full items-center justify-between border-b-2 bg-gray-100 p-4">
        <p>CariKabel.com</p>
        {hasAccess && (
          <>
            <p className="text-sm">
              Expired{" "}
              {formatDistanceToNow(parseISO(expiredAt), {
                addSuffix: true,
              })}
            </p>
          </>
        )}
        <UserButton showName />
      </nav>
      {!hasAccess && (
        <main className="flex w-full flex-col items-center justify-center gap-4 pt-8">
          <p>You have no access. Subscribe to get 1-yaer access.</p>
          <Button onClick={onSubscribe} loading={loading}>
            Subscribe
          </Button>
        </main>
      )}
    </div>
  );
}
