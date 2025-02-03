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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center max-w-7xl mx-32">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isSignin ? "Login" : "Register"}
        </h1>
        <p className="text-md text-muted-foreground text-center mb-4">
          {isSignin ? "Enter your credentials to sign in" : "Create an account"}
        </p>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="12345678" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password should be atleast 8 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <div className="flex justify-center mt-4 gap-2">
          <p>
            {isSignin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <a
            className="underline mouse-pointer"
            href={isSignin ? "/signup" : "/signin"}
          >
            {isSignin ? "Signup" : "Signin"}
          </a>
        </div>
      </div>
      <div className="h-screen">
        {isSignin ? (
          <Image
            src={SIGNIN_IMG}
            alt="DrawTopia Interface"
            className="object-cover h-full w-full"
          />
        ) : (
          <Image
            src={SIGNUP_IMG}
            alt="DrawTopia Interface"
            className="object-cover h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
