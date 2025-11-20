import qs from "query-string"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, XCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export const SearchInput = () => {
  const router = useRouter()

  const [value, setValue] = useState("")

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          q: value
        }
      },
      { skipNull: true }
    )

    router.push(url)
  }

  return (
    <form className="relative" onSubmit={onSubmit}>
      <SearchIcon className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        name="search"
        value={value}
        spellCheck="false"
        autoComplete="off"
        placeholder="Search songs..."
        className="min-w-[320px] h-8 shadow-none px-8"
        onChange={(e) => setValue(e.target.value)}
      />
      <XCircleIcon
        onClick={() => setValue("")}
        className={cn(
          "size-4 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hidden",
          value && "block"
        )}
      />
    </form>
  )
}

export const SearchInputLoading = () => {
  return <Skeleton className="w-[280px] h-8" />
}
