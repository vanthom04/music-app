import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { ResetPasswordView } from "@/modules/auth/ui/views/reset-password-view"

interface Props {
  searchParams: Promise<{
    token: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  const { token } = await searchParams

  return <ResetPasswordView token={token} />
}
