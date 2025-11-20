import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getMegaStorage } from "@/lib/mega"

export const runtime = "nodejs"

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const songId = searchParams.get("songId")

    if (!songId) {
      return new NextResponse("songId not found", { status: 400 })
    }

    // Get song by ID
    const song = await prisma.song.findUnique({
      where: {
        id: songId
      }
    })

    if (!song) {
      return new NextResponse("Song not found", { status: 404 })
    }

    const storage = await getMegaStorage()
    const audioFile = storage.files[song.audio]

    if (!audioFile) {
      return new NextResponse("Audio file not found", { status: 404 })
    }

    const audioDownload = audioFile.download({})
    const name = `${song.title} - ${song.artist}.mp3`

    return new NextResponse(audioDownload, {
      headers: {
        "Content-Type": "audio/mpeg",
        ...(audioFile.size ? { "Content-Length": String(audioFile.size) } : {}),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(name)}"`,
        "Cache-Control": "private, max-age=0, must-revalidate"
      }
    })
  } catch (error) {
    console.error("[DOWNLOAD_ERROR]: ", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
