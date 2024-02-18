import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const auth = useUser();
  const router = useRouter();

  const isPaid = auth.user?.publicMetadata.type === "PAID";

  if (!auth.user) {
    return null;
  }

  console.log(auth.user);

  const onSubscribe = async () => {
    setLoading(true);
    try {
      const { data }: { data: { redirect: string } } = await axios.post(
        "/api/stripe/checkout",
        {
          email: auth.user.primaryEmailAddress?.emailAddress,
          clerkId: auth.user.id,
        },
      );

      void router.push(data.redirect);
    } catch (error) {
      console.log(error);
    }
  };

  const onManageBilling = async () => {
    setLoading(true);
    try {
      const { data }: { data: { redirect: string } } = await axios.post(
        "/api/stripe/portal",
        {
          stripeId: auth.user.publicMetadata.stripeId,
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
        <div className="flex space-x-2">
          {isPaid && (
            <Button onClick={onManageBilling} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Manage Billing
            </Button>
          )}
          {!isPaid && (
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
