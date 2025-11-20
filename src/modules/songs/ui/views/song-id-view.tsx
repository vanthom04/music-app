"use client"

import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/error-state"

import { Lyrics } from "../components/lyrics"
import { SongInfo } from "../components/song-info"

interface Props {
  id: string
}

export const SongIdView = ({ id }: Props) => {
  const trpc = useTRPC()

  const { data: song } = useSuspenseQuery(trpc.songs.getOne.queryOptions({ id }))
  const { data: lyrics } = useSuspenseQuery(trpc.songs.getLyrics.queryOptions({ songId: id }))

  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <div className="flex-1 flex gap-3">
        <SongInfo song={song} />
        <Lyrics songId={song.id} lyrics={lyrics} />
      </div>
    </div>
  )
}

export const SongIdViewLoading = () => {
  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <div className="flex-1 flex gap-3">
        <div className="w-1/2 space-y-4">
          <div className="flex items-center gap-x-2">
            <Button size="sm" variant="outline">
              <ArrowLeftIcon />
              Back
            </Button>
            <h3 className="text-lg font-semibold">Song info</h3>
          </div>
          <Skeleton className="size-[200px] aspect-square rounded-lg" />
          <Skeleton className="w-full h-[100px] rounded-md" />
          <Skeleton className="w-full h-[100px] rounded-md" />
          <Skeleton className="w-full h-[100px] rounded-md" />
        </div>
        <div className="w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Lyrics</h5>
            <Button className="size-6">
              <PlusIcon />
            </Button>
          </div>
          <Skeleton className="h-[420px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export const SongIdViewError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
