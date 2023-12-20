"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password is too short"),
});

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInWithGoogle() {
    setLoading(true);
    const res = await signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      console.log(res.error);
      setLoading(false);
      toast({
        description: "Invalid email or passward",
        variant: "destructive",
      });
    } else {
      router.refresh();
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} className=" mt-6 w-full " type="submit">
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={loading}
        className="w-full"
        onClick={signInWithGoogle}
      >
        <FcGoogle className="h-6 w-6 pr-2" /> Sign in with Google
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        If you don&apos;t have an account, please&nbsp;
        <Link href="/signup" className="text-blue-500 hover:underline">
          create an account
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
