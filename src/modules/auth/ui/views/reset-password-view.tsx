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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { resetPasswordSchema } from "../../schemas"

interface Props {
  token: string
}

export const ResetPasswordView = ({ token }: Props) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmNewPassword: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      await authClient.resetPassword(values, {
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
        <CardContent className="w-full flex items-center justify-center gap-y-2">
          <CheckCircleIcon className="size-10 text-emerald-500" />
          <div className="space-y-0.5 text-center">
            <p className="text-lg font-medium">Password reset successfully</p>
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
          </div>
          <Button className="w-full mt-4" asChild>
            <Link href="/sign-in">
              Go to sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter new password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      spellCheck="false"
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Enter your new password"
                      className={cn(
                        "bg-white",
                        form.formState.errors.newPassword && "placeholder:!text-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      spellCheck="false"
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Enter confirm new password"
                      className={cn(
                        "bg-white",
                        form.formState.errors.confirmNewPassword && "placeholder:!text-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Confirm"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
