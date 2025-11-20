type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface FetcherOptions extends RequestInit {
  method?: RequestMethod
  timeout?: number
}

export const fetcher = async <T>(url: string, options?: FetcherOptions): Promise<T> => {
  const { timeout = 60_000, ...fetchOptions } = options || {}

  // Handler timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        // "Content-Type": "application/json",
        ...(fetchOptions.headers || {})
      }
    })

    // Clear timeout if request completes in time
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out")
      }

      throw new Error(`Network error: ${error.message}`)
    }

    throw new Error("An unknown error occurred")
  }
}

export const withRetry = async <T>(fn: () => Promise<T>, retries: number = 3): Promise<T> => {
  return fn().catch((error) => retries > 0 ? withRetry(fn, retries - 1) : Promise.reject(error))
}
