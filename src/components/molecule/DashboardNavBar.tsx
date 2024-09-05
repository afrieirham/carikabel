import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

function DashboardNavBar() {
  return (
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
  );
}

export default DashboardNavBar;
