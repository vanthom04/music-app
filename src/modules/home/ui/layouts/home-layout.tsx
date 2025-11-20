"use client"

import { CircleAlertIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { MusicPlayer } from "@/components/music-player"
import { SidebarProvider } from "@/components/ui/sidebar"

import { HomeNavbar } from "../components/home-navbar"
import { HomeSidebar } from "../components/home-sidebar"
import { PlaylistSongs } from "../components/playlist-songs"

interface Props {
  children: React.ReactNode
}

export const HomeLayout = ({ children }: Props) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 p-10">
        <CircleAlertIcon className="size-8 text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">
          This application is not supported on mobile devices.
          <br />
          Please use a desktop browser.
        </p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="w-full flex relative">
        <HomeSidebar />
        <div className="flex-1">
          <HomeNavbar />
          <main className="h-[calc(100vh-4rem-5rem)]">
            {children}
          </main>
        </div>
        <MusicPlayer />
        <PlaylistSongs />
      </div>
    </SidebarProvider>
  )
}
