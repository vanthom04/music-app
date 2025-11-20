import Link from "next/link"
import Image from "next/image"

import { usePathname } from "next/navigation"
import { HomeIcon, LibraryIcon, HeartIcon, ListMusicIcon, UploadIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon
  },
  {
    label: "Upload",
    href: "/upload",
    icon: UploadIcon
  },
  {
    label: "Library",
    href: "/library",
    icon: LibraryIcon
  },
  {
    label: "Liked",
    href: "/liked",
    icon: HeartIcon
  },
  {
    label: "Playlists",
    href: "/playlists",
    icon: ListMusicIcon
  },
]

export const HomeSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar className="pb-[5rem]">
      <SidebarHeader className="bg-background">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image width={36} height={36} src="/images/logo.png" alt="Logo" />
          <p className="text-2xl font-bold">Music Player</p>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} className="h-10" asChild>
                    <Link href={item.href}>
                      <item.icon className="!size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
