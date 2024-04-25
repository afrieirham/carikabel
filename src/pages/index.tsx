import { SignedIn } from "@clerk/clerk-react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";
import { marketingCompanies } from "~/constant";

export default function Home() {
  return (
    <>
      <SEOHead
        title="Get connected with 40+ referrers waiting to help you out! | CariKabel.com"
        description="CariKabel.com is a platform that connects you (the job seekers) with employees from a company."
        ogPath="/og.png"
        path="/"
      />

      <div className="flex w-full flex-col items-center">
        <nav className="w-full">
          <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-3xl sm:block">🤝</p>
              <p>CariKabel.com</p>
            </div>

            <SignedOut>
              <SignInButton redirectUrl="/dashboard">
                <Button variant="secondary">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </nav>
        <main className="flex flex-col items-center space-y-20 px-4 pb-32 pt-16">
          <div className="flex flex-col items-center space-y-8">
            <div>
              <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Stop applying for jobs blindly.
              </h1>
              <p className="mt-6 text-center text-lg leading-8 text-gray-600">
                Get connected with 40+ referrers waiting to help you out!
              </p>
            </div>
            <SignInButton redirectUrl="/dashboard">
              <Button>Get referred now!</Button>
            </SignInButton>
          </div>
          <div className="flex flex-col space-y-2 rounded border border-dashed border-gray-300 p-4 text-center">
            <p>
              <span className="font-bold">kabel (/&apos;keɪbl/)</span> or cable
            </p>
            <p>
              definition: “orang dalam” or referrer (ie. someone in a company
              that can help you get a job)
            </p>
            <div className="mx-auto flex text-center">
              <p className="border-l-2 border-black px-2 text-lg">
                &ldquo;zaman sekarang ni nak dapat kerja kena ada kabel
                bro&rdquo;
              </p>
            </div>
          </div>
          <div className="flex max-w-screen-xl flex-col items-center justify-center space-y-8">
            <p className="text-center text-gray-600">
              We have referrers from these companies
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {marketingCompanies?.map((company) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={company.id}
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="h-10 w-10 rounded border"
                />
              ))}
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-lg flex-col space-y-4">
            <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Why CariKabel?
            </h2>
            <div className="max-w-lg space-y-8 text-center">
              <p>
                CariKabel.com is a platform that connects you (the job seekers)
                with employees from a company.
              </p>
              <p>
                Say you&apos;re interested to apply for a Frontend Engineer
                position in company XYZ.
              </p>
              <p>
                Instead of submitting your applications through their job
                portals and <s>waiting</s>, <s>wishing</s>, praying that
                you&apos;ll get a response – you&apos;ll have a better chance by
                asking for a referral from their employees directly.
              </p>
              <p>
                <i>
                  “But I don&apos;t know anyone from the company, I have no
                  connections”
                </i>
              </p>
              <p>
                That&apos;s where CariKabel.com comes in. With a small fee of
                RM100, you will instantly get access to 40+ connections ready to
                help you – pretty cool right?
              </p>
              <div className="flex items-center justify-center gap-4">
                <p>If you&apos;re ready,</p>
                <SignInButton redirectUrl="/dashboard">
                  <Button>Get referred now!</Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
