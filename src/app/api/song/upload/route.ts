import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ensureTargetFolder } from "@/lib/mega"

export const runtime = "nodejs"

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await req.formData()
    const title = form.get("title") as string | null
    const artist = form.get("artist") as string | null
    const album = form.get("album") as string | null
    const lyrics = form.get("lyrics") as string | null
    const duration = Number(form.get("duration") || 0)

    const audio = form.get("audio") as File | null
    const image = form.get("image") as File | null

    if (!audio || !title || !artist || !duration) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // Upload image
    let imageNodeId: string | null = null

    if (image) {
      const imagesFolder = await ensureTargetFolder("images")
      const imageUploader = await imagesFolder.upload(
        { name: `${title}-${Date.now()}.${image.type.split("/").pop()}`, size: image.size },
        Buffer.from(await image.arrayBuffer())
      ).complete

      imageNodeId = imageUploader.nodeId
    }

    // Upload audio
    const audiosFolder = await ensureTargetFolder("audios")
    const audioExt = audio.type.includes("wav") ? "wav" : audio.type.includes("m4a") ? "m4a" : "mp3"
    const audioUploader = await audiosFolder.upload(
      { name: `${title}-${Date.now()}.${audioExt}`, size: audio.size },
      Buffer.from(await audio.arrayBuffer())
    ).complete

    // Save to database
    await prisma.song.create({
      data: {
        userId: session.user.id,
        title: title,
        artist: artist,
        album,
        duration,
        lyrics: lyrics ? {
          create: {
            text: lyrics
          }
        } : undefined,
        image: imageNodeId,
        audio: audioUploader.nodeId
      }
    })

    return NextResponse.json({ success: "OK" })
  } catch (error) {
    console.error("[UPLOAD_SONGS_ERROR]: ", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
