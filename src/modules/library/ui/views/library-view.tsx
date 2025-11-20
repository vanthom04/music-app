"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import {
  PlaylistsSection,
  PlaylistsSectionError,
  PlaylistsSectionLoading
} from "../sections/playlists-section"
import { SongsSection, SongsSectionError, SongsSectionLoading } from "../sections/songs-section"

export const LibraryView = () => {
  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <h3 className="text-2xl font-semibold">My library</h3>
      <div className="space-y-6 mt-4">
        <Suspense fallback={<SongsSectionLoading />}>
          <ErrorBoundary fallback={<SongsSectionError />}>
            <SongsSection />
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<PlaylistsSectionLoading />}>
          <ErrorBoundary fallback={<PlaylistsSectionError />}>
            <PlaylistsSection />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  )
}
