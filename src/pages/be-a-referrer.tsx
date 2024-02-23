import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

function ReferrerFormPage() {
  const [open, setOpen] = useState(false);
  const { data: companies } = api.company.getAll.useQuery();

  const formSchema = z.object({
    // referrer details
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    jobTitle: z.string(),

    // company details
    companyId: z.string(),
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

      companyId: "",
      companyName: "",
      linkedinUrl: "",
      jobsUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
            name="companyId"
            render={({ field }) => {
              const selectedCompany = companies?.find(
                (company) =>
                  field.value ===
                  JSON.stringify({
                    id: company.id,
                    name: company.name,
                  }).replaceAll('"', "'"),
              );
              return (
                <FormItem>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            {selectedCompany && Boolean(selectedCompany) && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={selectedCompany.logoUrl}
                                alt={`${selectedCompany.name} logo`}
                                className="h-6 w-6 rounded-sm border"
                              />
                            )}
                            {field.value ? (
                              <span>{selectedCompany?.name}</span>
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
                          {companies?.map((company) => {
                            const companyValue = JSON.stringify({
                              id: company.id,
                              name: company.name,
                            }).replaceAll('"', "'");

                            return (
                              <CommandItem
                                key={company.id}
                                value={companyValue}
                                onSelect={() => {
                                  if (field.value === companyValue)
                                    form.setValue("companyId", "");
                                  else form.setValue("companyId", companyValue);
                                  setOpen(false);
                                }}
                                className="flex items-center space-x-2 rounded p-2 hover:bg-zinc-100"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    companyValue === field.value
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
                            );
                          })}
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
            className={`${Boolean(form.getValues("companyId")) ? "opacity-50" : "opacity-100"} space-y-6`}
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
                      disabled={Boolean(form.getValues("companyId"))}
                      {...field}
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
                      disabled={Boolean(form.getValues("companyId"))}
                      {...field}
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
                      disabled={Boolean(form.getValues("companyId"))}
                      {...field}
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}

export default ReferrerFormPage;
