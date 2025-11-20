"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { InfoIcon, LoaderIcon, SearchIcon } from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { usePlayer } from "@/hooks/use-player"
import { Button } from "@/components/ui/button"

import { useUpdateSongLyricsModal } from "@/modules/songs/store/use-update-song-lyrics-modal"

import { PlainLyrics } from "../components/plain-lyrics"
import { SyncedLyrics } from "../components/synced-lyrics"

export const LyricsView = () => {
  const trpc = useTRPC()
  const router = useRouter()
  const player = usePlayer()
  const updateLyricsModal = useUpdateSongLyricsModal()

  useEffect(() => {
    if (!player.activeSong) {
      router.replace("/")
    }
  }, [player.activeSong, router])

  const { data, isLoading } = useQuery(trpc.songs.getLyrics.queryOptions(
    { songId: player.activeSong?.id as string },
    { enabled: !!player.activeSong }
  ))

  if (isLoading || !player.activeSong) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-y-2">
        <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Loading lyrics</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-full px-4 py-3 space-y-4 overflow-y-auto">
        <div className="flex-1 h-full flex flex-col items-center justify-center gap-y-2">
          <InfoIcon className="size-5" />
          <p className="text-sm text-muted-foreground">
            Lyrics not found
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => updateLyricsModal.onOpen(player.activeSong?.id as string)}
          >
            <SearchIcon />
            Search lyrics
          </Button>
        </div>
      </div>
    )
  }

  const hasSynced = !!data.syncText && data.syncText.trim().length > 0

  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      {hasSynced ? (
        <SyncedLyrics
          autoScroll
          height={480}
          lrcText={data.syncText!}
          currentTime={player.currentTime}
        />
      ) : (
        <PlainLyrics text={data.text} />
      )}
    </div>
  )
}
