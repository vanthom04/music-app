import { useMemo } from "react"
import { InfoIcon } from "lucide-react"

interface Props {
  text: string
}

export const PlainLyrics = ({ text }: Props) => {
  const parts = useMemo(
    () =>
      text
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim()),
    [text]
  )

  if (!parts.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <InfoIcon className="size-5" />
        <p className="text-sm">Lyrics is empty</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-y-auto rounded-2xl border p-4">
      {parts.map((line, index) => (
        <p key={index} className="leading-relaxed text-base opacity-90">
          {line || <span className="select-none">&nbsp;</span>}
        </p>
      ))}
    </div>
  )
}
