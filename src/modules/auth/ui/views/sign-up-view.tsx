"use client"

import Link from "next/link"
import Image from "next/image"

import { z } from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { signUpSchema } from "../../schemas"

export const SignUpView = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email(values, {
        onSuccess: () => {
          toast.success("Account created successfully!", {
            description: "Please check your email to verify your account.",
            duration: 8000
          })
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  const onSocial = async (provider: "google" | "github") => {
    await authClient.signIn.social({ provider }, {
      onError: ({ error }) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <div className="w-full text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please enter your details to sign up.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="type"
                      spellCheck="false"
                      disabled={isPending}
                      placeholder="Enter your name"
                      className={cn(form.formState.errors.name && "placeholder:!text-destructive")}
                    />
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
                    <Input
                      {...field}
                      type="email"
                      spellCheck="false"
                      disabled={isPending}
                      placeholder="Enter your email"
                      className={cn(form.formState.errors.email && "placeholder:!text-destructive")}
                    />
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
                      {...field}
                      type="password"
                      spellCheck="false"
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Enter your password"
                      className={cn(
                        form.formState.errors.password && "placeholder:!text-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Sign up"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center">
            <div className="w-full h-px bg-neutral-300" />
            <span className="text-muted-foreground text-xs px-1.5">Or</span>
            <div className="w-full h-px bg-neutral-300" />
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-full shrink"
              onClick={() => onSocial("google")}
            >
              <FcGoogle />
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-full shrink"
              onClick={() => onSocial("github")}
            >
              <FaGithub />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-center text-sm text-neutral-800">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium hover:text-neutral-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
