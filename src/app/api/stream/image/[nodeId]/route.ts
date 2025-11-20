import { Readable } from "node:stream"
import { NextResponse } from "next/server"

import { getMegaStorage } from "@/lib/mega"

interface IParams {
  params: Promise<{
    nodeId: string
  }>
}

export const dynamic = "force-dynamic"

export const GET = async (req: Request, { params }: IParams) => {
  try {
    const nodeId = (await params).nodeId
    const range = req.headers.get("range") ?? "bytes=0-"

    const storage = await getMegaStorage()
    const file = storage.files[nodeId]

    if (!file) {
      return new NextResponse("File not found", { status: 404 })
    }

    const [startStr, endStr] = range.replace(/bytes=/, "").split("-")
    const size = file.size ?? 0
    const start = parseInt(startStr, 10)
    const end = endStr ? parseInt(endStr, 10) : size - 1
    const chunkSize = end - start + 1

    const name = file.name || ""
    const lower = name.toLowerCase()
    const contentType = name.toLowerCase().endsWith(".png")
      ? "image/png"
      : lower.endsWith(".gif")
        ? "image/gif"
        : "image/jpeg"

    const resHeaders = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(chunkSize),
      "Content-Type": contentType
    }

    const downloadStream = file.download({ start, end })
    const webStream = Readable.toWeb(downloadStream)

    return new NextResponse(webStream as BodyInit, { status: 206, headers: resHeaders })
  } catch (error) {
    console.error("[STREAM_IMAGE_ERROR]: ", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
