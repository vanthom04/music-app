import { join } from "path"
import { tmpdir } from "os"
import { Readable } from "stream"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createWriteStream, statSync, unlinkSync, createReadStream } from "fs"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ensureTargetFolder, uploadStreamToMega } from "@/lib/mega"

export const runtime = "nodejs"

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, title, artist, album, lyrics, duration, image } = await req.json()

    if (!url || !title || !artist || !duration) {
      return NextResponse.json({ error: "No song info" }, { status: 400 })
    }

    const res = await fetch(url)

    if (!res.ok) {
      return NextResponse.json({ error: `Fetch failed - ${res.statusText}` }, { status: 500 })
    }

    if (!res.body) {
      return NextResponse.json({ error: "No response song body" }, { status: 404 })
    }

    let audioNodeId: string
    let imageNodeId: string | null = null

    const contentLength = res.headers.get("content-length")
    const audioMime = res.headers.get("content-type") || "audio/mpeg"
    const audioExt = audioMime.includes("wav") ? "wav" : audioMime.includes("m4a") ? "m4a" : "mp3"
    const audioFilename = `${title}-${Date.now()}.${audioExt}`

    // Upload image
    if (image) {
      const imagesFolder = await ensureTargetFolder("images")
      const imageExt = image.mime.split("/").pop()
      const imageFilename = `${title}-${Date.now()}.${imageExt}`
      const imageB64 = image.data.includes("base64,") ? image.data.split("base64,")[1] : image.data
      const imageBuffer = Buffer.from(imageB64, "base64")

      const { nodeId } = await imagesFolder.upload(
        { name: imageFilename, size: imageBuffer.length },
        imageBuffer
      ).complete

      imageNodeId = nodeId
    }

    if (contentLength) {
      const audioSize = Number(contentLength)
      const uploadReadable = Readable.fromWeb(res.body as any)

      // Upload audio
      const { nodeId } = await uploadStreamToMega({
        folder: "audios",
        name: audioFilename,
        size: audioSize,
        stream: uploadReadable
      })

      audioNodeId = nodeId
    } else {
      const tmpPath = join(
        tmpdir(),
        `${title}-${Math.random().toString(36).slice(2)}-${Date.now()}.${audioExt}`
      )

      await new Promise<void>((resolve, reject) => {
        Readable.fromWeb(res.body as any)
          .pipe(createWriteStream(tmpPath))
          .on("finish", resolve)
          .on("error", reject)
      })

      // Upload audio
      const { nodeId } = await uploadStreamToMega({
        folder: "audios",
        name: audioFilename,
        size: statSync(tmpPath).size,
        stream: createReadStream(tmpPath)
      })

      audioNodeId = nodeId

      // Clear tmp
      try { unlinkSync(tmpPath) } catch {}
    }

    // Save to database
    await prisma.song.create({
      data: {
        userId: session.user.id,
        title,
        artist,
        album,
        duration,
        lyrics: lyrics ? {
          create: {
            text: lyrics
          }
        } : undefined,
        image: imageNodeId,
        audio: audioNodeId
      }
    })

    return NextResponse.json({ success: "OK" })
  } catch (error) {
    console.error("[SONG_UPLOAD_BY_URL_ERROR]: ", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
