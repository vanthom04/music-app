"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"
import { LogOutIcon, ShieldIcon, UserRoundIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import { AccountSidebarHeader } from "./account-sidebar-header"

export const AccountSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="pt-16 z-40">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <AccountSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/profile"}
                className="h-10 border-transparent"
                asChild
              >
                <Link href="/profile">
                  <UserRoundIcon className="!size-5" />
                  <span className="text-sm font-medium tracking-normal">Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/security"}
                className="h-10 border-transparent"
                asChild
              >
                <Link href="/security">
                  <ShieldIcon className="!size-5" />
                  <span className="text-sm font-medium tracking-normal">Security</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10" asChild>
                <Link href="/">
                  <LogOutIcon className="!size-5" />
                  <span className="text-sm font-medium tracking-normal">Exit</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
