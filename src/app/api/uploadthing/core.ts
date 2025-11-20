import { headers } from "next/headers"
import { UploadThingError } from "uploadthing/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"

import { auth } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) {
        throw new UploadThingError("Unauthorized")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        url: file.ufsUrl,
        uploadedBy: metadata.userId
      }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
