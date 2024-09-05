import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SuperJSON from "superjson";
import { z } from "zod";

import Footer from "~/components/molecule/Footer";
import NavBar from "~/components/molecule/NavBar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { db } from "~/server/db";
import { type RouterOutputs } from "~/utils/api";

export const getStaticProps: GetStaticProps<{
  rawCompany: string;
}> = async (context) => {
  const companyId = context.params?.companyId;
  const company = await db.company.findFirst({
    where: { id: String(companyId) },
  });

  return {
    props: {
      rawCompany: SuperJSON.stringify(company),
    },
    // revalidate every 1 minute
    revalidate: 60 * 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const companies = await db.company.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const paths = companies.map((c) => ({ params: { companyId: c.id } }));

  return {
    paths,
    fallback: false,
  };
};

function JoinCompany({
  rawCompany,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const company =
    SuperJSON.parse<RouterOutputs["company"]["getOne"]>(rawCompany);

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    email: z.string().email().min(1, { message: "Name is required" }),
    jobTitle: z.string().min(1, { message: "Job title is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      jobTitle: "",
    },
  });

  const [loading, setLoading] = useState(false);

  if (!company) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-2 bg-gray-50">
      <NavBar />
      <div className="flex w-full max-w-screen-xl flex-col items-center justify-between gap-2 px-4 py-2 pb-8 sm:flex-row">
        <div className="mx-auto flex w-full max-w-sm flex-col space-y-6 py-6">
          <h1 className="text-xl font-bold">Apply as Referrer</h1>
          <div className="flex w-full flex-col space-y-4">
            <h2 className="font-bold">Your Company</h2>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-full rounded-md border bg-white p-2 text-sm">
                <div className="flex items-center gap-4">
                  <Image
                    width={200}
                    height={200}
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="h-10 w-10 rounded border"
                  />
                  <p className="">{company.name}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="link">
                <Link href="/be-a-referrer" className="text-xs">
                  Change company selection
                </Link>
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full  flex-col space-y-6"
            >
              <h2 className="font-bold">About you</h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Farah Ahmad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="6013 123 1234" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      For internal use
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="farah@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      How candidates will contact you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title (with seniority level)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Senior Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" loading={loading}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default JoinCompany;
