import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

function ReferrerFormPage() {
  const { data: companies } = api.company.getAll.useQuery();

  const formSchema = z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    jobTitle: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      jobTitle: "",
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
          className="w-full space-y-8"
        >
          <h1 className="text-2xl">About You</h1>
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
                <FormLabel>Your job title with seniority level</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h1 className="text-2xl">Your Company</h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose or add your company" />
            </SelectTrigger>
            <SelectContent className="">
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={company.logoUrl}
                      className="h-6 w-6 rounded-sm border"
                      alt=""
                    />
                    <span>{company.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}

export default ReferrerFormPage;
