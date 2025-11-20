import { useMemo } from "react"
import { PlusCircle, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useUpdateSongLyricsModal } from "../../store/use-update-song-lyrics-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
  songId: string
  lyrics: {
    id: string
    text: string
    syncText: string | null
  } | null
}

export const Lyrics = ({ songId, lyrics }: Props) => {
  const { onOpen } = useUpdateSongLyricsModal()

  const syncedParts = useMemo(
    () =>
      (lyrics?.syncText ?? "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim()),
    [lyrics?.syncText]
  )

  const plainParts = useMemo(
    () =>
      (lyrics?.text ?? "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim()),
    [lyrics?.text]
  )

  return (
    <div className="w-1/2 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium">Lyrics</h5>
        <Button className="size-6" onClick={() => onOpen(songId)}>
          <PlusIcon />
        </Button>
      </div>
      <div className="h-full overflow-y-auto">
        {lyrics && (
          <Tabs defaultValue={lyrics?.syncText ? "synced" : "plain"}>
            <div className="flex items-center justify-center">
              <TabsList>
                {lyrics?.syncText && <TabsTrigger value="synced">Synced lyrics</TabsTrigger>}
                <TabsTrigger value="plain">Plain lyrics</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="synced" className="h-[500px]">
              <div className="h-[420px] rounded-lg bg-slate-100 p-4 overflow-y-auto">
                {syncedParts.map((line, index) => (
                  <p key={index} className="leading-relaxed text-base opacity-90">
                    {line || <span className="select-none">&nbsp;</span>}
                  </p>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="plain" className="h-[500px]">
              <div className="h-[420px] rounded-lg bg-slate-100 p-4 overflow-y-auto">
                {plainParts.map((line, index) => (
                  <p key={index} className="leading-relaxed text-base opacity-90">
                    {line || <span className="select-none">&nbsp;</span>}
                  </p>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
        {!lyrics && (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground">Lyrics not found</p>
            <Button size="sm" onClick={() => onOpen(songId)}>
              <PlusCircle />
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
