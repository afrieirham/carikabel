import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function Dashboard() {
  const response = api.candidate.getAll.useQuery();
  const auth = useUser();
  const router = useRouter();

  console.log(response.data, auth);

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-center space-y-2">
        <UserButton showName />
        <SignOutButton signOutCallback={() => router.push("/")}>
          <Button>Logout</Button>
        </SignOutButton>
      </main>
    </>
  );
}
