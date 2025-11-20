import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import {
  PlaylistIdView,
  PlaylistIdViewError,
  PlaylistIdViewLoading
} from "@/modules/playlists/ui/views/playlist-id-view"

interface Props {
  params: Promise<{
    playlistId: string
  }>
}

export default async function Page({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const playlistId = (await params).playlistId
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.playlists.getOne.queryOptions({
    id: playlistId
  }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PlaylistIdViewLoading />}>
        <ErrorBoundary fallback={<PlaylistIdViewError />}>
          <PlaylistIdView id={playlistId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
