"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const FormSchema = z
  .object({
    name: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password is too short"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const RegisterForm = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = api.user.createUser.useMutation({
    onSuccess: async (data, variables, context) => {
      await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        callbackUrl: "/",
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: `${error?.message}`,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  async function signInWithGoogle() {
    const res = await signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <div>
      <Button
        variant="outline"
        type="button"
        disabled={mutation.isLoading}
        className="w-full"
        onClick={signInWithGoogle}
      >
        <FcGoogle className="h-6 w-6 pr-2" /> Sign up with Google
      </Button>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter acoount details below to create an account
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full pt-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Mensah" {...field} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-enter Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <Button
            className="mt-6 w-full"
            variant="default"
            type="submit"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          If you already have an account, please&nbsp;
          <Link href="/signin" className="text-blue-500 hover:underline">
            sign in
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default RegisterForm;
