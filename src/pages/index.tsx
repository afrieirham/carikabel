import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CTAButton from "~/components/molecule/CTAButton";
import Footer from "~/components/molecule/Footer";
import NavBar from "~/components/molecule/NavBar";
import SEOHead from "~/components/molecule/SEOHead";
import { Button } from "~/components/ui/button";
import { marketingCompanies } from "~/constant";

export default function Home() {
  const router = useRouter();
  const [shouldHighlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(router.asPath.includes("#apply-as-referrer"));
  }, [router]);

  return (
    <>
      <SEOHead
        title="Get connected with 40+ referrers waiting to help you out! | CariKabel.com"
        description="CariKabel.com is a platform that connects you (the job seekers) with employees from a company."
        ogPath="/og.png"
        path="/"
      />

      <div className="flex w-full flex-col items-center bg-gray-50">
        <NavBar />
        <div className="flex flex-col items-center space-y-20 px-4 pt-16">
          <main className="flex flex-col items-center space-y-20 px-4">
            <div className="flex flex-col items-center space-y-8">
              <div>
                <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Stop applying for jobs blindly.
                </h1>
                <p className="mt-6 text-center text-lg leading-8 text-gray-600">
                  Get connected with 40+ referrers waiting to help you out!
                </p>
              </div>
              <div className="flex gap-4">
                <CTAButton />
                <Button asChild variant="link">
                  <Link href="/companies">See company list →</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-2 rounded border border-dashed border-gray-300 p-4 text-center">
              <p>
                <span className="font-bold">kabel (/&apos;keɪbl/)</span> or
                cable
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
                    className="h-10 w-10 rounded border bg-white"
                  />
                ))}
              </div>
            </div>
          </main>
          <section className="mx-auto flex max-w-screen-lg flex-col space-y-4 px-4">
            <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Why CariKabel?
            </h2>
            <div className="max-w-xl space-y-8 ">
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
                <CTAButton />
              </div>
            </div>
          </section>
          <section className="mx-auto flex max-w-screen-lg flex-col items-center space-y-4 px-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              No job openings relevant to you? 😢
            </h2>
            <p className="text-gray-600 ">
              You could actually still benefits from it!
            </p>
            <a
              target="_blank"
              href="https://twitter.com/itsfaizhasnul/status/1637338326557667329"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tweet-1.png"
                alt=""
                className="w-full max-w-screen-sm rounded-lg border bg-white p-4"
              />
            </a>
            <div className="max-w-xl space-y-4 ">
              <p>
                Sometimes companies have roles that are not advertised publicly.
              </p>
              <div>
                <p>Maybe they don&apos;t have time to update it,</p>
                <p>
                  Maybe they haven&apos;t come up with the job description yet,
                </p>
                <p>
                  Or maybe they are practicing “referrals only” job
                  applications.
                </p>
              </div>
              <p>
                By having direct access to them, you are opening yourself up to
                more opportunities that you might not know.
              </p>
            </div>
          </section>
          <section className="mx-auto flex max-w-screen-lg flex-col items-center space-y-4 px-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Here&apos;s what other people have to say.
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/testimony.png"
              alt=""
              className="w-full max-w-screen-sm rounded-lg border bg-white p-4"
            />
          </section>
          <section className="mx-auto flex max-w-screen-lg flex-col items-center space-y-4 px-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              FAQs ❓
            </h2>
            <div className="mx-auto max-w-xl space-y-8">
              <div className="space-y-2">
                <b>Why do I need to pay?</b>
                <p>
                  To put it simply, it’s a way for me to filter serious job
                  applicants. If you are willing to spend invest RM100 to get
                  direct access to referrers, it shows you are serious about
                  getting a job and chances are, you are a high-quality
                  candidates.
                </p>
              </div>
              <div className="space-y-2">
                <b>
                  Can I share my account with other people like my friends or
                  family?
                </b>
                <p>
                  No. One purchase is for one email only. You are prohibited to
                  share, duplicate, download the data inside the referrers
                  directory in any shape way or form.
                </p>
                <p>
                  If other people want to get the access to the database, they
                  should make a purchase on their own behalf. People who do not
                  comply to this will have their access revoked permanently.
                </p>
              </div>
              <div className="space-y-2">
                <b>How can I know the referrers are serious too?</b>
                <p>
                  The referrers are filtered and reviewed before they are
                  included in the list. All of them are incentivise through
                  their company’s referral program. It means they will get some
                  commission if they manage to help you land a job there. You
                  can read more about{" "}
                  <a
                    className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                    target="_blank"
                    href="https://www.shrm.org/resourcesandtools/tools-and-samples/toolkits/pages/tk-designingandmanagingsuccessfulemployeereferralprograms.aspx#:~:text=An%20employee%20referral%20program%20is,for%20jobs%20in%20their%20organizations."
                  >
                    Employee Referral Program.
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <b>
                  Will I get a job if I pay and contact the referrers? What if I
                  failed to land a job?
                </b>
                <p>
                  Both me and the referrers can’t guarantee a job placement. It
                  depends on the hiring manager for the role and your
                  suitability as a candidate. If the company find that you are
                  not a good fit, there’s nothing we can do about it.
                </p>
                <p>
                  This platform only helps you to get connected, not hired.
                  Think of it as a place for you to build your own kabels (or
                  network).
                </p>
              </div>
              <div className="space-y-2">
                <b>
                  I’ve emailed the referrers but none of them replied back. What
                  should I do?
                </b>
                <p>
                  If it’s more than for 5 business days since you emailed them.
                  You can forward the email and include the referrer’s details
                  to{" "}
                  <a
                    className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                    target="_blank"
                    href="mailto:afrie@kerja-it.com"
                  >
                    afrie@kerja-it.com
                  </a>
                  .
                </p>
                <p>
                  I will try my best to escalate your problem to them
                  personally. I will also ensure that the referrers are
                  committed doing this. If they are not responsive or being
                  rude, please let me know.
                </p>
              </div>
              <div className="space-y-2" id="apply-as-referrer">
                <b
                  className={`transition-all ${shouldHighlight ? "bg-yellow-300" : ""}`}
                >
                  I’m interested to join as a referrer, how can I do that?
                </b>
                <p>
                  First of all, thank you for your interest. Secondly, does your
                  company have{" "}
                  <a
                    className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                    target="_blank"
                    href="https://www.shrm.org/resourcesandtools/tools-and-samples/toolkits/pages/tk-designingandmanagingsuccessfulemployeereferralprograms.aspx#:~:text=An%20employee%20referral%20program%20is,for%20jobs%20in%20their%20organizations."
                  >
                    Employee Referral Program.
                  </a>
                  ? If yes, then you can contact me directly on{" "}
                  <a
                    href="https://x.com/afrieirham_"
                    target="_blank"
                    className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                  >
                    Twitter
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://t.me/afrieirham"
                    target="_blank"
                    className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                  >
                    Telegram
                  </a>
                  .
                </p>
              </div>
              <p>
                Any other questions or problems? Contact me at{" "}
                <a
                  className="text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
                  target="_blank"
                  href="mailto:afrie@kerja-it.com"
                >
                  afrie@kerja-it.com
                </a>
              </p>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </>
  );
}
