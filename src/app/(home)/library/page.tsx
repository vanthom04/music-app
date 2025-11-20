import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import { LibraryView } from "@/modules/library/ui/views/library-view"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.songs.getMany.queryOptions({}))
  void queryClient.prefetchQuery(trpc.playlists.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  )
}
