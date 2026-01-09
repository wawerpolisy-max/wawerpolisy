export function isEmail(value: unknown): value is string {
  if (typeof value !== "string") return false
  const v = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function normalizePhone(value: unknown): string {
  if (typeof value !== "string") return ""
  // keep + and digits
  return value.replace(/(?!^\+)\D/g, "").trim()
}

export function safeString(value: unknown, max = 2000): string {
  if (typeof value !== "string") return ""
  const v = value.trim()
  return v.length > max ? v.slice(0, max) : v
}
