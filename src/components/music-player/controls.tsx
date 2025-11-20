import { FaPlay, FaPause } from "react-icons/fa6"
import { MdSkipPrevious, MdSkipNext } from "react-icons/md"
import { IoShuffle, IoRepeatOutline } from "react-icons/io5"

import { cn, formatTime } from "@/lib/utils"
import { usePlayer } from "@/hooks/use-player"
import { Slider } from "@/components/ui/slider"

export const Controls = () => {
  const {
    activeSong,
    isPlaying,
    isRandom,
    isRepeat,
    progress,
    currentTime,
    duration,
    setIsRandom,
    setIsRepeat,
    setIsDragging,
    playNext,
    playPrev,
    setIsPlaying,
    setProgress
  } = usePlayer()

  const seek = (time: number) => {
    const audio = document.querySelector("audio")
    if (audio) audio.currentTime = time
  }

  const PlayIcon = isPlaying ? FaPause : FaPlay

  return (
    <div className="flex flex-col items-center gap-y-1 w-full md:w-1/3">
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          disabled={!activeSong && !isPlaying}
          onClick={() => setIsRandom(!isRandom)}
          className={cn(
            "p-1 rounded-full hover:bg-neutral-100/80 transition-colors disabled:opacity-50",
            isRandom && "[&_svg]:text-primary bg-neutral-100/80 hover:bg-neutral-100/80"
          )}
        >
          <IoShuffle className="size-5" />
        </button>
        <button
          type="button"
          onClick={playPrev}
          disabled={!activeSong && !isPlaying}
          className="p-1 rounded-full hover:bg-neutral-100/80 transition-colors disabled:opacity-50"
        >
          <MdSkipPrevious className="size-6" />
        </button>
        <button
          type="button"
          disabled={!activeSong && !isPlaying}
          onClick={() => setIsPlaying(!isPlaying)}
          className="size-8 bg-primary rounded-full relative disabled:opacity-50"
        >
          <PlayIcon className="size-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </button>
        <button
          type="button"
          onClick={playNext}
          disabled={!activeSong && !isPlaying}
          className="p-1 rounded-full hover:bg-neutral-100/80 transition-colors disabled:opacity-50"
        >
          <MdSkipNext className="size-6" />
        </button>
        <button
          type="button"
          disabled={!activeSong && !isPlaying}
          onClick={() => setIsRepeat(!isRepeat)}
          className={cn(
            "p-1 rounded-full hover:bg-neutral-100/80 transition-colors disabled:opacity-50",
            isRepeat && "[&_svg]:text-primary bg-neutral-100/80 hover:bg-neutral-100/80"
          )}
        >
          <IoRepeatOutline className="size-5" />
        </button>
      </div>
      {/* Progress */}
      <div className="w-full flex items-center gap-x-2">
        <span className="text-xs font-medium">{formatTime(currentTime)}</span>
        <Slider
          min={0}
          max={duration}
          defaultValue={[0]}
          value={[progress]}
          onPointerUp={() => setIsDragging(false)}
          onPointerDown={() => setIsDragging(true)}
          onValueCommit={([value]) => seek(value)}
          onValueChange={([value]) => setProgress(value)}
        />
        <span className="text-xs font-medium">{formatTime(duration)}</span>
      </div>
    </div>
  )
}
