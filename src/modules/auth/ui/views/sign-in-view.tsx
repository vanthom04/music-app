"use client"

import Link from "next/link"
import Image from "next/image"

import { z } from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { LoaderIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"

import { signInSchema } from "../../schemas"

export const SignInView = () => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email(values, {
        onSuccess: async ({ data }) => {
          if (data.twoFactorRedirect) {
            return router.push(`/2fa/send-otp?email=${values.email}`)
          }

          router.push("/")
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
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please enter your details to sign in.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormDescription className="text-right">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => router.push("/forgot-password")}
                      className="text-[13px] font-medium text-neutral-500 hover:text-neutral-600 hover:underline disabled:opacity-50"
                    >
                      Forgot password?
                    </button>
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Sign in"}
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
        <div className="text-center mt-4">
          <Button size="sm" variant="link" disabled={isPending} asChild>
            <Link href="/passkey">
              🔑 Sign in with passkey
            </Link>
          </Button>
          <p className="text-sm text-neutral-800">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium hover:text-neutral-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
