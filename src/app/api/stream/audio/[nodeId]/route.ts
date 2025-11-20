import { headers } from "next/headers"
import { Readable } from "node:stream"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { getMegaStorage } from "@/lib/mega"

export const dynamic = "force-dynamic"

interface IParams {
  params: Promise<{ nodeId: string }>
}

function parseRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader) return null
  const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader)
  if (!m) return null

  let start = m[1] ? parseInt(m[1], 10) : NaN
  let end = m[2] ? parseInt(m[2], 10) : NaN

  if (Number.isNaN(start) && Number.isNaN(end)) return null

  // bytes=-500  (last 500 bytes)
  if (Number.isNaN(start) && !Number.isNaN(end)) {
    const last = Math.min(end, size)
    start = Math.max(0, size - last)
    end = size - 1
  }
  // bytes=500-  (from 500 to end)
  if (!Number.isNaN(start) && Number.isNaN(end)) {
    end = size - 1
  }

  if (start! > end! || start! < 0 || end! >= size) return "invalid"
  return { start: start!, end: end! }
}

// Retry + backoff + jitter cho chunk download
async function downloadWithRetry(
  file: any,
  range: { start?: number; end?: number } | null,
  signal?: AbortSignal,
  maxRetries = 3
) {
  let attempt = 0
  const baseOpts = range ?? {}
  while (true) {
    try {
      if (signal?.aborted) {
        throw new Error("Client aborted")
      }
      const stream = file.download({ ...baseOpts, maxConnections: attempt > 0 ? 1 : undefined })
      return stream
    } catch (err: any) {
      const message = `${err?.message || err}`
      const isRateLimit = /rate limit|Bandwidth limit exceeded|too many requests|429/i.test(message)
      const isNetLike = /ECONNRESET|EPIPE|ETIMEDOUT|network|invalid response/i.test(message)

      if ((isRateLimit || isNetLike) && attempt < maxRetries) {
        attempt++
        const backoff = 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 400) // 1s,2s,4s + jitter
        console.warn(`[MEGA] retry #${attempt} in ${backoff}ms → reason: ${message}`)
        await new Promise((r) => setTimeout(r, backoff))
        continue
      }
      throw err
    }
  }
}

function commonHeaders(extra?: Record<string, string>) {
  return {
    "Cache-Control": "private, max-age=0, must-revalidate",
    "Accept-Ranges": "bytes",
    "X-Accel-Buffering": "no",
    ...extra
  }
}

/** ---- HEAD ---- */
export async function HEAD(_req: Request, { params }: IParams) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const nodeId = (await params).nodeId
  const storage = await getMegaStorage()
  const file = storage.files[nodeId]
  if (!file || !file.size) return new NextResponse("Not Found", { status: 404 })

  return new NextResponse(null, {
    status: 200,
    headers: commonHeaders({
      "Content-Length": `${file.size}`,
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.name || nodeId)}"`
    })
  })
}

export async function GET(req: Request, { params }: IParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const nodeId = (await params).nodeId
    const storage = await getMegaStorage()
    const file = storage.files[nodeId]
    if (!file) return new NextResponse("File not found", { status: 404 })

    const size = file.size ?? 0
    if (!size) return new NextResponse("Unknown file size", { status: 502 })

    const rangeHeader = req.headers.get("range")
    const parsed = parseRange(rangeHeader, size)

    // Cho phép abort khi client đóng kết nối
    const controller = new AbortController()
    const onAbort = () => controller.abort()
    req.signal?.addEventListener?.("abort", onAbort, { once: true })

    if (parsed === "invalid") {
      return new NextResponse(null, {
        status: 416,
        headers: commonHeaders({
          "Content-Range": `bytes */${size}`
        })
      })
    }

    // Nếu có Range → 206 Partial Content
    if (parsed) {
      const { start, end } = parsed
      const chunkSize = end - start + 1

      const nodeStream = await downloadWithRetry(file, { start, end }, controller.signal)
      const webStream = Readable.toWeb(nodeStream as Readable) as unknown as ReadableStream

      return new NextResponse(webStream, {
        status: 206,
        headers: commonHeaders({
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Content-Length": `${chunkSize}`,
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `inline; filename="${encodeURIComponent(file.name || nodeId)}"`
        })
      })
    }

    // Không có Range → trả 200 toàn bộ
    const nodeStream = await downloadWithRetry(file, null, controller.signal)
    const webStream = Readable.toWeb(nodeStream as Readable) as unknown as ReadableStream

    return new NextResponse(webStream, {
      status: 200,
      headers: commonHeaders({
        "Content-Length": `${size}`,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.name || nodeId)}"`
      })
    })
  } catch (err: any) {
    const msg = String(err?.message || err)
    console.error("[STREAM_AUDIO_ERROR]:", msg)

    if (/rate limit|Bandwidth limit exceeded|429/i.test(msg)) {
      // Gợi ý client retry sau
      return new NextResponse("MEGA rate limited — try again later", {
        status: 429,
        headers: { "Retry-After": "10" }
      })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
