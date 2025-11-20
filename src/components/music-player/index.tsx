"use client"

import { Extras } from "./extras"
import { Controls } from "./controls"
import { MediaItem } from "./media-item"

export const MusicPlayer = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 h-[5rem] border-t px-4 py-2 bg-background z-50">
      <div className="max-w-screen-2xl h-full mx-auto flex items-center justify-between gap-4 lg:gap-6">
        <MediaItem />
        <Controls />
        <Extras />
      </div>
    </div>
  )
}
