export type WordCue = {
  start: number
  end: number
  text: string
}

export type LineCue = {
  start: number
  end: number
  text: string
  words?: WordCue[]
}

/**
 * Chuyển "mm:ss", "mm:ss.s", "mm:ss.ss", "mm:ss.xxx" → số giây.
 * Trả về NaN nếu không đúng định dạng.
 */
export const timeStringToSeconds = (timeString: string): number => {
  const match = timeString.match(/^(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?$/)
  if (!match) return NaN

  const minutes = Number(match[1])
  const seconds = Number(match[2])

  // 1–2 chữ số coi là phần trăm giây; 3 chữ số coi là milliseconds
  const fractionStr = match[3]
  const fraction =
    fractionStr != null ? Number(fractionStr) / (fractionStr.length === 3 ? 1000 : 100) : 0

  return minutes * 60 + seconds + fraction
}

/**
 * Parse một LRC text thành danh sách LineCue (kèm WordCue nếu có).
 * Hỗ trợ:
 *  - Dòng-level: [mm:ss.xx] lyric
 *  - Từ-level:  <mm:ss.xx>word (thời gian tuyệt đối)
 */
export const parseLrcToLineCues = (rawLrc: string): LineCue[] => {
  const lines = rawLrc.split(/\r?\n/).filter((line) => line.trim().length > 0)
  const lineCues: LineCue[] = []

  for (const line of lines) {
    // 1) Bắt tất cả timestamp dòng-level
    const timestampMatches = [...line.matchAll(/\[(\d{1,2}:\d{1,2}(?:[.:]\d{1,3})?)\]/g)]
    if (timestampMatches.length === 0) continue

    // 2) Loại bỏ timestamp khỏi text để lấy lyric thuần
    const textWithoutTimestamps = line.replace(/\[(\d{1,2}:\d{1,2}(?:[.:]\d{1,3})?)\]/g, "").trim()

    // 3) Bắt token từ-level (nếu có): <mm:ss.xx>word
    const wordTokens = [
      ...textWithoutTimestamps.matchAll(/<(\d{1,2}:\d{1,2}(?:[.:]\d{1,3})?)>(\S+)/g)
    ]
    const words: WordCue[] = []
    let displayText = textWithoutTimestamps

    if (wordTokens.length > 0) {
      for (let i = 0; i < wordTokens.length; i++) {
        const currentTs = timeStringToSeconds(wordTokens[i][1])
        const currentWord = wordTokens[i][2]
        const nextTs = i < wordTokens.length - 1 ? timeStringToSeconds(wordTokens[i + 1][1]) : NaN

        words.push({
          start: currentTs,
          end: Number.isNaN(nextTs) ? currentTs + 1 : nextTs, // tạm thời, sẽ tinh chỉnh bên dưới
          text: currentWord
        })
      }

      // Xóa markup <ts> khỏi text hiển thị
      displayText = textWithoutTimestamps.replace(/<(\d{1,2}:\d{1,2}(?:[.:]\d{1,3})?)>/g, "")
    }

    // 4) Mỗi timestamp trên 1 dòng → tạo 1 LineCue tương ứng (cùng text/words)
    for (const match of timestampMatches) {
      const startSec = timeStringToSeconds(match[1])
      lineCues.push({
        start: startSec,
        end: startSec + 3, // sẽ chỉnh lại sau khi sắp xếp
        text: displayText,
        words: words.length > 0 ? [...words] : undefined
      })
    }
  }

  // 5) Sắp xếp theo thời gian bắt đầu
  lineCues.sort((a, b) => a.start - b.start)

  // 6) Tính end của dòng = start của dòng kế tiếp - epsilon (nếu có)
  const LINE_EPSILON = 0.02
  for (let i = 0; i < lineCues.length; i++) {
    const currentLine = lineCues[i]
    const nextLine = lineCues[i + 1]

    if (nextLine) {
      currentLine.end = Math.max(currentLine.start, nextLine.start - LINE_EPSILON)
    } else {
      // Dòng cuối — fallback
      currentLine.end = currentLine.start + 5
    }

    // 7) Điều chỉnh end cho từng từ trong dòng (nếu có)
    if (currentLine.words && currentLine.words.length > 0) {
      const words = currentLine.words
      for (let j = 0; j < words.length; j++) {
        const currentWord = words[j]
        const nextWord = words[j + 1]
        if (nextWord) {
          currentWord.end = Math.max(currentWord.start, nextWord.start - LINE_EPSILON)
        } else {
          // Từ cuối cùng khớp tới hết dòng, nhưng giới hạn tối đa 1.5s để tránh kéo quá dài
          currentWord.end = Math.min(currentWord.start + 1.5, currentLine.end)
        }
      }
    }
  }

  return lineCues
}

/**
 * Tìm chỉ số dòng (LineCue) đang active tại thời điểm currentSeconds.
 * Trả về -1 nếu không có dòng nào khớp (ví dụ giữa 2 dòng).
 */
export const getActiveLineIndex = (cues: LineCue[], currentSeconds: number): number => {
  let left = 0
  let right = cues.length - 1
  let candidate = -1

  while (left <= right) {
    const mid = (left + right) >> 1
    if (currentSeconds >= cues[mid].start) {
      candidate = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  if (candidate >= 0 && currentSeconds <= cues[candidate].end + 0.001) {
    return candidate
  }
  return -1
}

/**
 * Tìm chỉ số từ (WordCue) đang active trong một dòng tại thời điểm currentSeconds.
 * Trả về -1 nếu không có từ nào khớp hoặc không có words.
 */
export const getActiveWordIndex = (words: WordCue[] | undefined, currentSeconds: number): number => {
  if (!words || words.length === 0) return -1

  let left = 0
  let right = words.length - 1
  let candidate = -1

  while (left <= right) {
    const mid = (left + right) >> 1
    if (currentSeconds >= words[mid].start) {
      candidate = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  if (candidate >= 0 && currentSeconds <= words[candidate].end + 0.001) {
    return candidate
  }
  return -1
}
