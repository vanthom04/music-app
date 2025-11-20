"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Props {
  title: string
  image?: string
  description?: string
  actionLabel?: string
  className?: string
  onAction?: () => void
}

export const EmptyState = ({
  title,
  actionLabel,
  className,
  description,
  image,
  onAction
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-muted",
        className
      )}
    >
      {image && (
        <div className="mb-2 size-[100px] relative aspect-square">
          <Image fill sizes="100%" src={image} alt="Empty State" />
        </div>
      )}
      <h3 className="text-[16px] font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
