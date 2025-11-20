"use client"

import Image from "next/image"

import { toast } from "sonner"
import { useTransition } from "react"
import { LoaderIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

export const VerifyOTPView = () => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const onChange = async (code: string) => {
    if (code.length === 6) {
      startTransition(async () => {
        await authClient.twoFactor.verifyOtp({ code, trustDevice: true, }, {
          onSuccess: () => {
            router.push("/")
          },
          onError: ({ error }) => {
            toast.error(error.message)
          }
        })
      })
    }
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <div className="w-full text-center">
          <CardTitle className="text-xl md:text-2xl">Two-Factor Verification</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your one-time password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <InputOTP autoFocus maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={onChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="size-9 md:size-10" />
            <InputOTPSlot index={1} className="size-9 md:size-10" />
            <InputOTPSlot index={2} className="size-9 md:size-10" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="size-9 md:size-10" />
            <InputOTPSlot index={4} className="size-9 md:size-10" />
            <InputOTPSlot index={5} className="size-9 md:size-10" />
          </InputOTPGroup>
        </InputOTP>
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-y-1">
            <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            <p className="text-[13px] text-muted-foreground">Verifying...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
