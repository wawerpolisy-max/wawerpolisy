import { Resend } from "resend"

/**
 * Resend client (server-side).
 * Set RESEND_API_KEY in environment variables.
 *
 * IMPORTANT:
 * - The "from" address must be on a domain verified in Resend.
 * - Destination (to) can be any email (e.g., Gmail).
 */
export const resend = new Resend(process.env.RESEND_API_KEY)
