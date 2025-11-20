"use client"

import Link from "next/link"
import Image from "next/image"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircleIcon, LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { forgotPasswordSchema } from "../../schemas"

export const ForgotPasswordView = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      await authClient.forgetPassword(values, {
        onSuccess: () => {
          setIsSuccess(true)
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  if (isSuccess) {
    return (
      <Card className="flex-1">
        <CardContent className="text-center">
          <CheckCircleIcon className="size-10 mx-auto text-emerald-500 mb-2" />
          <div className="space-y-0.5 text-center">
            <p className="text-lg font-medium">Email sent successfully</p>
            <p className="text-sm text-muted-foreground">
              Please check your email inbox.
            </p>
          </div>
          <div className="text-center w-full mt-4">
            <Button variant="outline" className="w-full" disabled={isPending} asChild>
              <Link href="/sign-in">
                Back to sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Please enter your email to continue.
        </CardDescription>
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Continue"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <Button variant="outline" className="w-full" disabled={isPending} asChild>
            <Link href="/sign-in">
              Back to sign in
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
