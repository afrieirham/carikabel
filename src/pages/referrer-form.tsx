import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
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
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    jobTitle: z.string(),
    companyId: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      jobTitle: "",
      companyId: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  console.log(companies);

  return (
    <main className="mx-auto flex h-screen w-full max-w-md flex-col items-center justify-center space-y-2">
      <Button asChild variant="link">
        <Link href="/dashboard">back</Link>
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-8"
        >
          <h1 className="text-2xl">About your company</h1>
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => {
              const selectedCompany = companies?.find(
                (c) => c.id === field.value,
              );
              return (
                <FormItem>
                  <FormLabel>Company</FormLabel>
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
                            {Boolean(field.value) && (
                              <Image
                                width={10}
                                height={10}
                                src={selectedCompany?.logoUrl ?? ""}
                                alt={`${selectedCompany?.name} logo`}
                                className="h-6 w-6 rounded-sm border"
                              />
                            )}
                            {field.value ? (
                              <span>{selectedCompany?.name}</span>
                            ) : (
                              "Add company"
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2">
                      <Command>
                        <CommandInput placeholder="Search company..." />
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup className="flex h-[380px] w-[400px] flex-col space-y-2 overflow-scroll">
                          {companies?.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.id}
                              onSelect={() => {
                                if (field.value === company.id)
                                  form.setValue("companyId", "");
                                else form.setValue("companyId", company.id);
                                setOpen(false);
                              }}
                              className="flex items-center space-x-2 rounded p-2 hover:bg-zinc-100"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <Image
                                width={10}
                                height={10}
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
          {/* <div className="flex items-center">
            <p>Your company not listed?</p>
            <Button type="button" variant="link">
              Add your company.
            </Button>
          </div> */}
          <h1 className="text-2xl">About you</h1>
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
                <FormDescription className="text-xs">
                  For internal use
                </FormDescription>
                <FormControl>
                  <Input placeholder="6013 123 1234" {...field} />
                </FormControl>
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
                <FormDescription className="text-xs">
                  How candidates will contact you.
                </FormDescription>
                <FormControl>
                  <Input placeholder="farah@gmail.com" {...field} />
                </FormControl>
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
