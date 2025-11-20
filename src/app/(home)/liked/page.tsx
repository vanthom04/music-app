import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import { LikedView, LikedViewError, LikedViewLoading } from "@/modules/liked/ui/views/liked-view"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.liked.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LikedViewLoading />}>
        <ErrorBoundary fallback={<LikedViewError />}>
          <LikedView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
