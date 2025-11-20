import { UTApi } from "uploadthing/server"
import { createRouteHandler } from "uploadthing/next"
import { NextRequest, NextResponse } from "next/server"

import { ourFileRouter } from "./core"

const utApi = new UTApi()

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter
})

export const DELETE = async (req: NextRequest) => {
  try {
    const fileId = new URL(req.url).searchParams.get("fileId")

    if (!fileId) {
      return new NextResponse("File ID not found", { status: 404 })
    }

    await utApi.deleteFiles([fileId])

    return NextResponse.json({ success: "OK" })
  } catch (error) {
    console.error("[UPLOADTHING_DELETE_ERROR]: ", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
