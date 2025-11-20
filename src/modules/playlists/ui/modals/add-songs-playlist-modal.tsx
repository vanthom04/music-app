"use client"

import Image from "next/image"

import { toast } from "sonner"
import { useState } from "react"
import { LoaderIcon, PlusCircleIcon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { extractFirstZodMessage } from "@/lib/utils"
import { ResponsiveDialog } from "@/components/responsive-dialog"

import { useAddSongsPlaylistModal } from "../../store/use-add-songs-playlist-modal"

export const AddSongsPlaylistModal = () => {
  const addSongsPlaylistModal = useAddSongsPlaylistModal()
  const trpc = useTRPC()

  const [search, setSearch] = useState("")

  const q = useDebounce(search)

  const { data: songs, isLoading } = useQuery(trpc.playlists.getAvailableSongs.queryOptions(
    { playlistId: addSongsPlaylistModal.playlistId, q },
    { enabled: !!addSongsPlaylistModal.playlistId && addSongsPlaylistModal.open }
  ))

  const onClose = () => {
    addSongsPlaylistModal.onClose()
  }

  if (!songs) {
    return null
  }

  return (
    <ResponsiveDialog
      open={addSongsPlaylistModal.open}
      onOpenChange={onClose}
      title="Add songs playlist"
      description="Select the song you want to add to playlist."
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            value={search}
            spellCheck="false"
            autoComplete="off"
            className="h-auto py-1.5"
            placeholder="Enter song title..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoaderIcon className="size-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {songs?.map((song) => (
                <SongItem
                  id={song.id}
                  key={song.id}
                  title={song.title}
                  artist={song.artist}
                  image={song.image}
                  playlistId={addSongsPlaylistModal.playlistId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  )
}

interface SongItemProps {
  id: string
  title: string
  artist: string
  image?: string | null
  playlistId: string
}

const SongItem = ({ id, title, artist, image, playlistId }: SongItemProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const addSong = useMutation(trpc.playlists.addSong.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.playlists.getOne.queryOptions({ id: playlistId }))
      await queryClient.invalidateQueries(trpc.playlists.getAvailableSongs.queryOptions({
        playlistId
      }))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  return (
    <div className="flex items-center gap-x-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200/80">
      <div className="relative size-10 rounded overflow-hidden">
        <Image
          fill
          sizes="100%"
          className="object-cover"
          src={`/api/stream/image/${image}`}
          alt={title}
        />
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm line-clamp-1">{title}</p>
        <span className="text-xs text-muted-foreground line-clamp-1">{artist}</span>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={false}
        onClick={() => addSong.mutate({ playlistId, songId: id })}
        className="min-w-[80px] shadow-none rounded-full text-xs"
      >
        {!addSong.isPending && (
          <>
            <PlusCircleIcon />
            Add
          </>
        )}
        {addSong.isPending && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
      </Button>
    </div>
  )
}
