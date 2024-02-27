import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import superjson from "superjson";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { db } from "~/server/db";
import { api, type RouterOutputs } from "~/utils/api";

type CompanyRouterOutput = RouterOutputs["company"]["getAll"][number];
interface CompanyOutput extends CompanyRouterOutput {
  selectValue: string;
}

export const getServerSideProps = (async () => {
  const companies = await db.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: {
      rawCompanies: superjson.stringify(
        companies.map((c) => ({
          ...c,
          selectValue: JSON.stringify({
            id: c.id,
            name: c.name,
          }).replaceAll('"', "'"),
        })),
      ),
    },
  };
}) satisfies GetServerSideProps<{ rawCompanies: string }>;

function ReferrerFormPage({
  rawCompanies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const companies = superjson.parse<CompanyOutput[]>(rawCompanies);
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    // referrer details
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    email: z.string().email().min(1, { message: "Name is required" }),
    jobTitle: z.string().min(1, { message: "Job title is required" }),

    // company details
    companySelectValue: z.string(),
    companyName: z.string(),
    linkedinUrl: z.string(),
    jobsUrl: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      jobTitle: "",

      companySelectValue: "",
      companyName: "",
      linkedinUrl: "",
      jobsUrl: "",
    },
  });

  // Create a map to avoid O(n) lookups
  const companiesMap = companies.reduce(
    (acc, company) => {
      acc[company.selectValue] = company;
      return acc;
    },
    {} as Record<string, CompanyOutput>,
  );

  const { mutate } = api.referrer.createDraftReferrer.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Profile has been submitted.",
      });
      setTimeout(() => void router.push("/dashboard"), 1500);
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const companyId = companiesMap[values.companySelectValue]?.id;
    const hasNewCompany =
      values.companyName && values.jobsUrl && values.linkedinUrl;

    // if both is empty
    if (!companyId && !hasNewCompany) {
      toast({
        title: "Company info not provided!",
        description: "Please choose or add your company",
      });
      form.setError("companySelectValue", {
        message: "required if no company added",
      });

      form.setError("companyName", {
        message: "required if no company choosen",
      });
      form.setError("jobsUrl", {
        message: "required if no company choosen",
      });
      form.setError("linkedinUrl", {
        message: "required if no company choosen",
      });

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { companySelectValue, ...rest } = values;

    if (hasNewCompany) {
      mutate({
        ...rest,
        companyName: "",
        jobsUrl: "",
        linkedinUrl: "",
        companyId: "",
      });
      return;
    }

    if (companyId) {
      form.resetField("companyName");
      form.resetField("linkedinUrl");
      form.resetField("jobsUrl");

      mutate({ ...rest, companyId });
      return;
    }

    setLoading(false);
  }

  const { companyName, jobsUrl, linkedinUrl } = form.watch();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-2 py-8">
      <div className="w-full">
        <Button asChild variant="link" className="p-0">
          <Link href="/dashboard">← back to dashboard</Link>
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-6"
        >
          <h2 className="font-bold">Which company are you from?</h2>
          <FormField
            control={form.control}
            name="companySelectValue"
            render={({ field }) => {
              const selectedCompany = companiesMap[field.value];
              return (
                <FormItem>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={Boolean(
                            companyName || jobsUrl || linkedinUrl,
                          )}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            {selectedCompany && Boolean(selectedCompany) ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={selectedCompany.logoUrl}
                                  alt={`${selectedCompany.name} logo`}
                                  className="h-6 w-6 rounded-sm border"
                                />
                                <span>{selectedCompany.name}</span>
                              </>
                            ) : (
                              "Choose a company"
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2">
                      <Command
                        filter={(value, search) => {
                          const { name } = JSON.parse(
                            value.replaceAll("'", '"'),
                          ) as { id: string; name: string };

                          if (name?.includes(search)) return 1;
                          return 0;
                        }}
                      >
                        <CommandInput placeholder="Search company..." />
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup className="flex h-[380px] w-[400px] flex-col space-y-2 overflow-scroll">
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.selectValue}
                              onSelect={() => {
                                if (field.value === company.selectValue)
                                  form.setValue("companySelectValue", "");
                                else
                                  form.setValue(
                                    "companySelectValue",
                                    company.selectValue,
                                  );

                                // if current field has value (field.value is based on prev state, that's why logic seem off)
                                if (!field.value) {
                                  form.clearErrors("companySelectValue");
                                  form.resetField("companyName");
                                  form.resetField("linkedinUrl");
                                  form.resetField("jobsUrl");
                                }

                                setOpen(false);
                              }}
                              className="flex items-center space-x-2 rounded p-2 hover:bg-zinc-100"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.selectValue === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={company.logoUrl}
                                alt={`${company.name} logo`}
                                className="h-6 w-6 rounded-sm border"
                              />
                              <p>{company.name}</p>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-full" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="w-full" />
          </div>
          <div
            className={`${Boolean(form.getValues("companySelectValue")) ? "opacity-50" : "opacity-100"} space-y-6`}
          >
            <h2 className="font-bold">Add your company</h2>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Google"
                      disabled={Boolean(form.getValues("companySelectValue"))}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value) {
                          form.clearErrors("companySelectValue");
                        }
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company careers page</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://google.com/careers"
                      disabled={Boolean(form.getValues("companySelectValue"))}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value) {
                          form.clearErrors("companySelectValue");
                        }
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/company/google"
                      disabled={Boolean(form.getValues("companySelectValue"))}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value) {
                          form.clearErrors("companySelectValue");
                        }
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  <Input placeholder="Senior Frontend Developer" {...field} />
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
    </main>
  );
}

export default ReferrerFormPage;
