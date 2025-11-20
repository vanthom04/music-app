import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="size-[160px] md:size-[230px] relative overflow-hidden">
        <Image fill sizes="100%" src="/illustrations/not-found.svg" alt="Not found" />
      </div>
      <h3 className="text-2xl font-bold">404 - PAGE NOT FOUND</h3>
      <p className="text-sm text-muted-foreground mt-1.5">
        We can&apos;t seem to find the page you&apos;re looking for.
      </p>
      <Button size="sm" variant="outline" className="px-5 rounded-full mt-4" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
