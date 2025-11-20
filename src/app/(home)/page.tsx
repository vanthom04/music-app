import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import { HomeView, HomeViewError, HomeViewLoading } from "@/modules/home/ui/views/home-view"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()

  void queryClient.prefetchInfiniteQuery(trpc.songs.newest.infiniteQueryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HomeViewLoading />}>
        <ErrorBoundary fallback={<HomeViewError />}>
          <HomeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
