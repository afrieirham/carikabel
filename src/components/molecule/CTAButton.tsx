import Link from "next/link";

import { Button } from "../ui/button";

export default function CTAButton() {
  return (
    <Button asChild>
      <Link href="/dashboard">Get referred now!</Link>
    </Button>
  );
}
