"use client"

import Link from "next/link"
import Image from "next/image"

import { z } from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { signInPasskeySchema } from "../../schemas"

export const PasskeyView = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signInPasskeySchema>>({
    resolver: zodResolver(signInPasskeySchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof signInPasskeySchema>) => {
    startTransition(async () => {
      await authClient.signIn.passkey(values, {
        onSuccess: () => {
          window.location.href = "/"
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <div className="w-full text-center">
          <CardTitle className="text-2xl">Sign in with Passkey</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email to continue.
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
            <Button type="submit" className="w-full" disabled={isPending}>
              Continue
            </Button>
          </form>
        </Form>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/sign-in">
            Back to sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
