"use client"

import { TriangleAlertIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"

import { NameForm } from "../components/name-form"
import { EmailForm } from "../components/email-form"
import { ChangeAvatar } from "../components/change-avatar"

export const ProfileView = () => {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <ProfileViewLoading />
  }

  if (!data) {
    return <ProfileViewError />
  }

  return (
    <div className="space-y-4 gap-4 px-4 py-6">
      <h3 className="text-xl font-semibold">Personal information</h3>
      <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-2">
        <div className="space-y-4">
          <NameForm value={data.user.name} />
          <EmailForm value={data.user.email} />
        </div>
        <div className="flex flex-col items-center">
          <ChangeAvatar
            name={data.user.name}
            image={data.user.image}
          />
        </div>
      </div>
    </div>
  )
}

export const ProfileViewLoading = () => {
  return (
    <div className="space-y-4 gap-4 px-4 py-6">
      <Skeleton className="w-[230px] h-8" />
      <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="size-[240px] lg:size-[300px] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export const ProfileViewError = () => {
  return (
    <div className="flex-1 h-full flex items-center flex-col justify-center gap-y-2">
      <TriangleAlertIcon className="size-12 text-red-500" />
      <p className="text-lg text-muted-foreground">
        Something went wrong. Please try again later.
      </p>
    </div>
  )
}
