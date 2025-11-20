"use client"

import { useState, useEffect, useMemo } from "react"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs"

import { usePreviewLyricsModal } from "../../store/use-preview-lyrics-modal"

type TabVariant = "synced" | "plain"

export const PreviewLyricsModal = () => {
  const { lyrics, open, onClose } = usePreviewLyricsModal()

  const [tab, setTab] = useState<TabVariant>("plain")

  useEffect(() => {
    if (lyrics.synced) {
      setTab("synced")
    }
  }, [lyrics.synced])

  const syncedParts = useMemo(
    () =>
      (lyrics.synced ?? "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim()),
    [lyrics.synced]
  )

  const plainParts = useMemo(
    () =>
      lyrics.plain
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim()),
    [lyrics.plain]
  )

  return (
    <ResponsiveDialog open={open} onOpenChange={onClose} title="Preview" className="max-w-[600px]!">
      <Tabs defaultValue={tab}>
        <div className="flex items-center justify-center">
          <TabsList>
            {lyrics.synced && <TabsTrigger value="synced">Synced lyrics</TabsTrigger>}
            <TabsTrigger value="plain">Plain lyrics</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="synced" className="h-[500px]">
          <div className="h-[420px] rounded-lg bg-slate-200 p-4 overflow-y-auto">
            {syncedParts.map((line, index) => (
              <p key={index} className="leading-relaxed text-base opacity-90">
                {line || <span className="select-none">&nbsp;</span>}
              </p>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="plain" className="h-[500px]">
          <div className="h-[420px] rounded-lg bg-slate-200 p-4 overflow-y-auto">
            {plainParts.map((line, index) => (
              <p key={index} className="leading-relaxed text-base opacity-90">
                {line || <span className="select-none">&nbsp;</span>}
              </p>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveDialog>
  )
}
