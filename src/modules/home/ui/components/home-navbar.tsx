import { Suspense } from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"

import { UserButton } from "@/modules/auth/ui/components/user-button"

import { SearchInput, SearchInputLoading } from "./search-input"

export const HomeNavbar = () => {
  return (
    <nav className="h-[4rem] border-b sticky top-0 flex items-center px-4 bg-background z-10">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger className="size-8 md:hidden" />
          <Suspense fallback={<SearchInputLoading />}>
            <SearchInput />
          </Suspense>
        </div>
        <UserButton />
      </div>
    </nav>
  )
}
