import { TbPlaylist } from "react-icons/tb"
import { useRouter, usePathname } from "next/navigation"
import { PiMicrophoneStageDuotone } from "react-icons/pi"

import { FaVolumeXmark, FaVolumeLow, FaVolumeHigh } from "react-icons/fa6"

import { useShowPlaylist } from "@/modules/home/store/use-show-playlist"

import { cn } from "@/lib/utils"
import { usePlayer } from "@/hooks/use-player"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export const Extras = () => {
  const router = useRouter()
  const pathname = usePathname()
  const showPlaylist = useShowPlaylist()

  const { songs, activeSong, volume, setVolume } = usePlayer()

  const VolumeIcon = volume === 0 ? FaVolumeXmark : volume > 50 ? FaVolumeHigh : FaVolumeLow

  return (
    <div className="items-center justify-end h-full hidden md:flex w-full md:w-1/3 space-x-3">
      <button
        type="button"
        disabled={!activeSong}
        onClick={() => router.push("/lyrics")}
        className={cn(
          "p-1.5 rounded-full hover:bg-neutral-100/80 transition-colors disabled:opacity-50",
          pathname === "/lyrics" && "bg-accent text-primary"
        )}
      >
        <PiMicrophoneStageDuotone className="size-4" />
      </button>

      {/* Volume */}
      <div className="w-[120px] flex items-center gap-x-1">
        <button
          type="button"
          onClick={() => {}}
          className="p-1 rounded-full hover:bg-neutral-100/80 transition-colors"
        >
          <VolumeIcon className="size-4" />
        </button>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[volume]}
          defaultValue={[0.5]}
          onValueChange={([value]) => setVolume(value)}
        />
      </div>

      {/* Separator */}
      <div className="h-[60%] w-px bg-neutral-400" />

      {/* Button show playlist */}
      <Button
        size="icon"
        variant="ghost"
        onClick={showPlaylist.toggle}
        disabled={songs.length === 0}
        className={cn(showPlaylist.open && "bg-accent text-accent-foreground")}
      >
        <TbPlaylist className="size-4" />
      </Button>
    </div>
  )
}
