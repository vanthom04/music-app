import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarHeader } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const AccountSidebarHeader = () => {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[160px] rounded-full" />
        <div className="flex flex-col items-center gap-y-1 mt-2">
          <Skeleton className="h-5 w-[110px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </SidebarHeader>
    )
  }

  if (!data) {
    return null
  }

  return (
    <SidebarHeader className="flex items-center justify-center">
      <Link href="/profile">
        <Avatar className="size-[160px]">
          <AvatarImage src={data.user.image!} />
          <AvatarFallback className="bg-primary text-white text-5xl">
            {data.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-col items-center mt-2">
        <p className="font-medium">{data.user.name}</p>
        <p className="text-sm text-muted-foreground">{data.user.email}</p>
      </div>
    </SidebarHeader>
  )
}
