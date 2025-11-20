import { Trash2Icon } from "lucide-react"

import { formatTime } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { LocalSongItem } from "../../types"

interface Props {
  data: LocalSongItem
  disabled?: boolean
  onRemove: (id: string) => void
  onUpdate: (id: string, data: Partial<LocalSongItem>) => void
}

export const SongPreviewItem = ({ data, disabled, onUpdate, onRemove }: Props) => {
  return (
    <Card className="relative">
      <Button
        size="icon"
        variant="ghost"
        disabled={disabled}
        onClick={() => onRemove(data.id)}
        className="size-8 absolute top-2 right-2 hover:text-rose-500"
      >
        <Trash2Icon />
      </Button>
      <CardContent className="flex flex-col gap-2.5">
        <div className="space-y-1">
          <Label htmlFor={`title-${data.id}`}>Title</Label>
          <Input
            value={data.title}
            disabled={disabled}
            id={`title-${data.id}`}
            placeholder="Enter your song title"
            onChange={(e) => onUpdate(data.id, { title: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`artist-${data.id}`}>Artist</Label>
          <Input
            value={data.artist}
            disabled={disabled}
            id={`artist-${data.id}`}
            placeholder="Enter your song artist"
            onChange={(e) => onUpdate(data.id, { artist: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`album-${data.id}`}>Album</Label>
          <Input
            value={data.album}
            disabled={disabled}
            id={`album-${data.id}`}
            placeholder="Enter your song album"
            onChange={(e) => onUpdate(data.id, { album: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`duration-${data.id}`}>
            Duration ({formatTime(data.duration)})
          </Label>
          <Input
            disabled
            type="number"
            value={data.duration}
            id={`duration-${data.id}`}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <audio controls className="w-full">
              <source src={data.audioPreview} type="audio/mpeg" />
            </audio>
          </div>
          <div className="size-20 relative border flex items-center justify-center rounded-md overflow-hidden">
            {data.image ? (
              <img
                alt={data.title}
                src={data.imagePreview}
                className="size-20 object-cover"
              />
            ) : (
              <span className="text-sm text-muted-foreground">No image</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
