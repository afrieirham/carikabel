import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "../ui/button";

function NavBar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-4">
          <p className="text-3xl sm:block">🤝</p>
          <p>CariKabel.com</p>
        </Link>

        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="secondary">
              <Link href="/dashboard">Login</Link>
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Go to dashboard →</Link>
          </Button>
        </SignedIn>
      </div>
    </nav>
  );
}

export default NavBar;
