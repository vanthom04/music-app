"use client"

import { TriangleAlertIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"

import { DeleteAccount } from "../components/delete-account"
import { PasskeyManager } from "../components/passkey-manager"
import { PasswordsAndSecurity } from "../components/passwords-and-security"

export const SecurityView = () => {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <SecurityViewLoading />
  }

  if (!data) {
    return <SecurityViewError />
  }

  return (
    <div className="px-4 py-6">
      <h3 className="text-xl font-semibold">
        Manage your passwords, 2FA, and Passkeys.
      </h3>
      <div className="flex-1 space-y-6 mt-4">
        <PasskeyManager />
        <PasswordsAndSecurity />
        <DeleteAccount />
      </div>
    </div>
  )
}

export const SecurityViewLoading = () => {
  return (
    <div className="space-y-6 px-4 py-6">
      <Skeleton className="w-[350px] h-9" />
      <div className="flex-1 space-y-6 mt-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-[250px] h-7" />
            <Skeleton className="w-[120px] h-7" />
          </div>
          <Skeleton className="w-full py-8 rounded-xl" />
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="w-[250px] h-7" />
          <Skeleton className="w-full py-8 rounded-xl" />
          <Skeleton className="w-full py-8 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export const SecurityViewError = () => {
  return (
    <div className="flex-1 h-full flex items-center flex-col justify-center gap-y-2">
      <TriangleAlertIcon className="size-12 text-red-500" />
      <p className="text-lg text-muted-foreground">
        Something went wrong. Please try again later.
      </p>
    </div>
  )
}
