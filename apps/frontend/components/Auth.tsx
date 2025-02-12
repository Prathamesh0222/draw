"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SigninSchema, SignupSchema } from "@repo/common/types";
import { useMutation } from "@tanstack/react-query";
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
import { z } from "zod";
import { HTTP_URL, SIGNIN_IMG, SIGNUP_IMG } from "@/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

type SigninInput = z.infer<typeof SigninSchema>;
type SignupInput = z.infer<typeof SignupSchema>;

export default function Auth({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const schema = isSignin ? SigninSchema : SignupSchema;
  const defaultValues = isSignin
    ? { username: "", password: "" }
    : { username: "", email: "", password: "" };
  const form = useForm<SigninInput | SignupInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.ok) {
      router.push("/dashboard");
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: SigninInput | SignupInput) => {
      const endpoint = isSignin ? `${HTTP_URL}/signin` : `${HTTP_URL}/signup`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },

    onError: (error) => {
      console.error(error);
    },

    onSuccess: (data) => {
      if (isSignin) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        router.push("/signin");
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-32 py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {isSignin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isSignin
                ? "Enter your credentials to continue"
                : "Get started with your free account"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-11 px-4 border-2 focus:ring-2 focus:ring-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isSignin && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="abc@example.com"
                          {...field}
                          className="h-11 px-4 border-2 focus:ring-2 focus:ring-primary/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-11 px-4 border-2 focus:ring-2 focus:ring-primary/50"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Password should be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                type="submit"
              >
                {isSignin ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-11 font-medium border-2 hover:bg-secondary/50 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isSignin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <a
              className="text-sm font-medium hover:underline cursor-pointer text-primary"
              href={isSignin ? "/signup" : "/signin"}
            >
              {isSignin ? "Create an account" : "Sign in"}
            </a>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src={isSignin ? SIGNIN_IMG : SIGNUP_IMG}
          width={1920}
          height={1080}
          alt="DrawTopia Interface"
          className="object-cover h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
      </div>
    </div>
  );
}
