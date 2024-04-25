import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
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
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-2">
      <UserButton showName />
      <div className="flex flex-col space-y-2">
        {hasAccess && (
          <>
            <p>
              Expired{" "}
              {formatDistanceToNow(parseISO(expiredAt), {
                addSuffix: true,
              })}
            </p>
          </>
        )}
        {!hasAccess && (
          <Button onClick={onSubscribe} loading={loading}>
            Subscribe
          </Button>
        )}

        <SignOutButton signOutCallback={() => router.push("/")}>
          <Button variant="ghost">Logout</Button>
        </SignOutButton>
      </div>
    </main>
  );
}
