export function getClientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for")
  if (xf) return xf.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") || "unknown"
}

type RateState = { n: number; t: number }

function getMap(key: string): Map<string, RateState> {
  const g = globalThis as unknown as Record<string, unknown>
  if (!g[key]) g[key] = new Map<string, RateState>()
  return g[key] as Map<string, RateState>
}

/**
 * Best-effort, in-memory rate limit (works on single instance; resets on deploy/restart).
 * Good enough to reduce obvious spam; for production add edge middleware or Redis-based limiter.
 */
export function isRateLimited(opts: {
  bucket: string
  id: string
  windowMs: number
  max: number
}): boolean {
  const map = getMap(`__rate_${opts.bucket}`)
  const now = Date.now()
  const key = `${opts.bucket}:${opts.id}`
  const prev = map.get(key)

  if (!prev || now - prev.t > opts.windowMs) {
    map.set(key, { n: 1, t: now })
    return false
  }

  prev.n += 1
  map.set(key, prev)
  return prev.n > opts.max
}
