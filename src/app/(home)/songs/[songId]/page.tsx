import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import {
  SongIdView,
  SongIdViewError,
  SongIdViewLoading
} from "@/modules/songs/ui/views/song-id-view"

interface Props {
  params: Promise<{
    songId: string
  }>
}

export default async function Page({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()
  const songId = (await params).songId

  queryClient.prefetchQuery(trpc.songs.getLyrics.queryOptions({ songId }))
  queryClient.prefetchQuery(trpc.songs.getOne.queryOptions({ id: songId }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SongIdViewLoading />}>
        <ErrorBoundary fallback={<SongIdViewError />}>
          <SongIdView id={songId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
