import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth"
import { trpc, getQueryClient } from "@/trpc/server"

import {
  SearchView,
  SearchViewError,
  SearchViewLoading
} from "@/modules/search/ui/views/search-view"
import { InfoIcon } from "lucide-react"

interface Props {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const q = (await searchParams).q
  const queryClient = getQueryClient()

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10">
        <InfoIcon className="size-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Please enter the keyword you are looking for in the search bar.
        </p>
      </div>
    )
  }

  void queryClient.prefetchQuery(trpc.songs.getMany.queryOptions({ q }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SearchViewLoading />}>
        <ErrorBoundary fallback={<SearchViewError />}>
          <SearchView q={q} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
