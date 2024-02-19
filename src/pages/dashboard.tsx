import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { addYears, formatDistanceToNow, parseISO } from "date-fns";

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
    <>
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
            <Button onClick={onSubscribe} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Subscribe
            </Button>
          )}
          <SignOutButton signOutCallback={() => router.push("/")}>
            <Button>Logout</Button>
          </SignOutButton>
        </div>
      </main>
    </>
  );
}
