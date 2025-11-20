"use client"

import { useMemo } from "react"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/error-state"

import { ListItem } from "../components/list-item"
import { NewestSongsSection } from "../sections/newest-songs-section"

export const HomeView = () => {
  const trpc = useTRPC()

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.songs.newest.infiniteQueryOptions({}, {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    })
  )

  const newestSongs = useMemo(() => data.pages.flatMap((p) => p.items), [data])

  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <h3 className="text-2xl font-semibold">Welcome back 👋</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ListItem href="liked" name="Liked songs" image="/images/liked.png" />
        <ListItem href="playlists" name="Playlists" image="/images/playlist.png" />
      </div>
      <NewestSongsSection
        songs={newestSongs}
        hasNextPage={hasNextPage}
        isLoading={isFetchingNextPage}
        onFetchNextPage={() => fetchNextPage()}
      />
    </div>
  )
}

export const HomeViewLoading = () => {
  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <h3 className="text-2xl font-semibold">Welcome back 👋</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ListItem href="liked" name="Liked songs" image="/images/liked.png" />
        <ListItem href="playlists" name="Playlists songs" image="/images/playlist.png" />
      </div>
      <div className="mt-4">
        <h4 className="text-xl font-semibold">Newest songs</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={`loading-${index}`} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const HomeViewError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
