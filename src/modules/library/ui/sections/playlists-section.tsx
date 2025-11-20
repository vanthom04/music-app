import { PlusIcon } from "lucide-react"
import { useSuspenseQuery } from "@tanstack/react-query"

import { PlaylistItem } from "@/modules/playlists/ui/components/playlist-item"
import { useNewPlaylistModal } from "@/modules/playlists/store/use-new-playlist-modal"

import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"

export const PlaylistsSection = () => {
  const newPlaylistModal = useNewPlaylistModal()
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.playlists.getMany.queryOptions())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">My playlists</h4>
        <Button size="sm" onClick={newPlaylistModal.onOpen}>
          <PlusIcon />
          New playlist
        </Button>
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-4 lg:grid-cols-5 mt-2">
        {data.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            id={playlist.id}
            title={playlist.title}
            description={playlist.description}
            totalSongs={playlist.totalSongs}
            image={playlist.thumbnailUrl}
          />
        ))}
        {data.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="No playlist yet"
              image="/images/empty-state.png"
              description="Click the button below to create a new playlist."
              actionLabel="New playlist"
              onAction={newPlaylistModal.onOpen}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export const PlaylistsSectionLoading = () => {
  return (
    <div className="h-full px-4 py-3 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">Playlists</h4>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={`loading-${index}`} className="aspect-square rounded-md" />
        ))}
      </div>
    </div>
  )
}

export const PlaylistsSectionError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
