"use client"

import Link from "next/link"
import Image from "next/image"

import { toast } from "sonner"
import { useTransition } from "react"
import { LoaderIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Props {
  email: string
}

export const SendOTPView = ({ email }: Props) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const onSendOTP = () => {
    startTransition(async () => {
      await authClient.twoFactor.sendOtp(undefined, {
        onSuccess: () => {
          router.push("/2fa/verify-otp")
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  return (
    <Card className="flex-1 gap-4">
      <CardHeader className="flex flex-col items-center">
        <Image width={42} height={42} src="/images/logo.png" alt="Logo" />
        <div className="w-full text-center">
          <CardTitle className="text-2xl">2FA - Send OTP Code</CardTitle>
          <CardDescription className="text-muted-foreground">
            {email ? (
              <>We will send a verification code to <strong>{email}</strong>.</>
            ) : (
              <>We will send a verification code to your email.</>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button className="w-full" onClick={onSendOTP}>
          {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Confirm"}
        </Button>
        <Button variant="outline" className="w-full" disabled={isPending} asChild>
          <Link href="/sign-in">
            Back to sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
