import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

function ReferrerCompanyPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: companies } = api.company.getAll.useQuery();

  const formSchema = z.object({
    companyId: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    console.log(values);
    setTimeout(() => {
      void router.push("/referrer/add");
    }, 1000);
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
                (company) =>
                  field.value ===
                  JSON.stringify({
                    id: company.id,
                    name: company.name,
                  }).replaceAll('"', "'"),
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
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}

export default ReferrerCompanyPage;
