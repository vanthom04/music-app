import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { VerifyOTPView } from "@/modules/auth/ui/views/verify-otp-view"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  return <VerifyOTPView />
}
