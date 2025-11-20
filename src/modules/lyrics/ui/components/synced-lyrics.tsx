import { InfoIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"

import { parseLrcToLineCues, getActiveLineIndex, getActiveWordIndex, LineCue } from "../../utils"

interface Props {
  lrcText: string
  currentTime: number
  autoScroll?: boolean
  height?: number
}

export const SyncedLyrics = ({ lrcText, currentTime, autoScroll, height }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeLineRef = useRef<HTMLDivElement | null>(null)

  const cues: LineCue[] = useMemo(() => parseLrcToLineCues(lrcText), [lrcText])
  const activeIndex = useMemo(() => getActiveLineIndex(cues, currentTime), [cues, currentTime])
  const activeWords = cues[activeIndex]?.words
  const activeWordIndex = useMemo(
    () => getActiveWordIndex(activeWords, currentTime),
    [activeWords, currentTime]
  )

  useEffect(() => {
    if (!autoScroll) return
    const container = containerRef.current
    const activeEl = activeLineRef.current
    if (!container || !activeEl) return

    const cRect = container.getBoundingClientRect()
    const aRect = activeEl.getBoundingClientRect()
    const top = aRect.top - cRect.top + container.scrollTop - cRect.height / 2 + aRect.height / 2

    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
  }, [activeIndex, autoScroll])

  if (!cues.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <InfoIcon className="size-5" />
        <p className="text-sm">Invalid/empty LRC</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-y-auto rounded-2xl border p-4"
    >
      <div className="space-y-2.5">
        {cues.map((cue, i) => {
          const isActive = i === activeIndex
          const ref = isActive ? activeLineRef : undefined

          // Nếu không có từ-level → highlight cả dòng
          if (!cue.words || cue.words.length === 0) {
            return (
              <div
                key={`${cue.start}-${i}`}
                ref={ref as any}
                className={`rounded-xl px-3 py-2 text-lg md:text-xl lg:text-2xl leading-relaxed transition-colors ${
                  isActive ? "bg-black/5 font-semibold text-primary dark:bg-white/10" : "opacity-75"
                }`}
              >
                {cue.text || "..."}
              </div>
            )
          }

          // Có từ-level → highlight từng từ
          return (
            <div
              key={`${cue.start}-${i}`}
              ref={ref as any}
              className={`rounded-xl px-3 py-2 text-lg md:text-xl lg:text-2xl leading-relaxed transition-colors ${
                isActive ? "bg-black/5 font-semibold text-primary dark:bg-white/10" : "opacity-75"
              }`}
            >
              {cue.words.map((w, wi) => {
                const isWordActive = wi === activeWordIndex
                return (
                  <span
                    key={`${w.start}-${wi}`}
                    className={isWordActive ? "underline decoration-2" : ""}
                    style={{ opacity: isWordActive ? 1 : 0.65, marginRight: 6 }}
                  >
                    {w.text || "..."}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
