import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { SendOTPView } from "@/modules/auth/ui/views/send-otp-view"

interface Props {
  searchParams: Promise<{
    email: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  const { email } = await searchParams

  return <SendOTPView email={email} />
}
