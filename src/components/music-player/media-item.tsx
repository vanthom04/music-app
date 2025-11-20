import Image from "next/image"

import { usePlayer } from "@/hooks/use-player"

export const MediaItem = () => {
  const { activeSong } = usePlayer()

  // const HeartIcon = isLiked ? IoHeart : IoHeartOutline

  return (
    <div className="flex items-center md:w-1/3">
      {activeSong && (
        <>
          <div className="relative size-12 aspect-square rounded-md overflow-hidden">
            {activeSong.image ? (
              <Image
                fill
                sizes="100%"
                className="object-cover"
                src={`/api/stream/image/${activeSong.image}`}
                alt={activeSong.title}
              />
            ) : (
              <div className="size-full flex items-center justify-center border rounded-md bg-slate-100">
                <Image
                  width={20}
                  height={20}
                  className="object-cover"
                  src="/images/no-image.png"
                  alt="No image"
                />
              </div>
            )}
          </div>
          <div className="flex-1 ml-2">
            <h3 className="text-[15px] font-medium line-clamp-1">{activeSong.title}</h3>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
              {activeSong.artist}
            </p>
          </div>
          {/* <div className="ml-2 flex items-center gap-x-3">
            <button
              type="button"
              onClick={() => {}}
              className="p-1 rounded-full hover:bg-neutral-100/80 transition-colors"
            >
              <HeartIcon className="size-5" />
            </button>
          </div> */}
        </>
      )}
    </div>
  )
}
