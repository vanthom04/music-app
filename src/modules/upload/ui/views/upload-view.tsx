"use client"

import { useState } from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { FileUpload } from "../components/file-upload"
import { LinkUpload } from "../components/link-upload"

type TabsVariant = "file-upload" | "link-upload"

export const UploadView = () => {
  const [tab, setTab] = useState<TabsVariant>("file-upload")

  return (
    <div className="h-full px-4 py-3 space-y-4 overflow-y-auto">
      <h3 className="text-2xl font-semibold">Upload songs</h3>
      <Tabs value={tab} className="gap-y-4" onValueChange={(value) => setTab(value as TabsVariant)}>
        <TabsList className="h-auto p-0">
          <TabsTrigger
            value="file-upload"
            className="py-1.5 hover:bg-accent hover:text-accent-foreground"
          >
            File upload
          </TabsTrigger>
          <TabsTrigger
            value="link-upload"
            className="py-1.5 hover:bg-accent hover:text-accent-foreground"
          >
            Link upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file-upload">
          <FileUpload />
        </TabsContent>
        <TabsContent value="link-upload">
          <LinkUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
