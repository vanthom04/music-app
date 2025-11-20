import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import {
  PlaylistsView,
  PlaylistsViewError,
  PlaylistsViewLoading
} from "@/modules/playlists/ui/views/playlists-view"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.playlists.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PlaylistsViewLoading />}>
        <ErrorBoundary fallback={<PlaylistsViewError />}>
          <PlaylistsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
