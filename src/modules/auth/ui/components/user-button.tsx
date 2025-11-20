"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon, User2Icon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export const UserButton = () => {
  const router = useRouter()

  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />
  }

  if (!data) {
    return null
  }

  const onSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload()
        }
      }
    })
  }

  const avatarFallback = data.user.name.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-8">
          <AvatarImage src={data.user.image!} />
          <AvatarFallback className="bg-primary text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 p-1.5">
        <div className="flex flex-col p-1">
          <p className="text-sm font-medium">{data.user.name}</p>
          <p className="text-muted-foreground text-[13px]">{data.user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User2Icon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:text-rose-500!" onClick={onSignOut}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
