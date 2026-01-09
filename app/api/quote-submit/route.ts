import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { getClientIp, isRateLimited } from "@/lib/antiSpam"
import { isEmail, normalizePhone, safeString } from "@/lib/validation"

const TO_EMAIL = process.env.QUOTE_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "wawerpolisy@gmail.com"
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "WawerPolisy Wycena <noreply@wawerpolisy.pl>"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited({ bucket: "quote", id: ip, windowMs: 60_000, max: 8 })) {
      return NextResponse.json({ error: "Rate limit" }, { status: 429 })
    }

    const data = await request.json()

    if (typeof data?.website === "string" && data.website.trim().length > 0) {
      return NextResponse.json({ success: true })
    }

    const insuranceType = safeString(data?.insuranceType, 80)
    const fullName = safeString(data?.fullName, 120)
    const email = safeString(data?.email, 200)
    const phone = normalizePhone(data?.phone)
    const preferredContact = safeString(data?.preferredContact, 40)
    const message = safeString(data?.message, 4000)
    const details = safeString(data?.details, 6000)
    const consent = Boolean(data?.consent)

    if (!insuranceType) return NextResponse.json({ error: "Missing insuranceType" }, { status: 400 })
    if (!fullName || fullName.length < 2) return NextResponse.json({ error: "Invalid fullName" }, { status: 400 })

    const hasEmail = isEmail(email)
    const hasPhone = phone.length >= 7
    if (!hasEmail && !hasPhone) return NextResponse.json({ error: "Provide phone or email" }, { status: 400 })

    if (!consent) return NextResponse.json({ error: "Consent required" }, { status: 400 })

    const text = [
      "Nowa prośba o wycenę (wawerpolisy.pl)",
      "",
      `Rodzaj ubezpieczenia: ${insuranceType}`,
      `Imię i nazwisko: ${fullName}`,
      `Telefon: ${hasPhone ? phone : "-"}`,
      `Email: ${hasEmail ? email : "-"}`,
      `Preferowany kontakt: ${preferredContact || "-"}`,
      `Zgoda RODO: ${consent ? "TAK" : "NIE"}`,
      "",
      "Wiadomość:",
      message || "-",
      "",
      "Szczegóły (opcjonalnie):",
      details || "-",
      "",
      `IP: ${ip}`,
      `UA: ${request.headers.get("user-agent") || "-"}`,
      `Czas: ${new Date().toISOString()}`,
    ].join("\n")

    const sendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Wycena – ${insuranceType} – ${fullName}`,
      text,
      replyTo: hasEmail ? email : undefined,
    })

    if (sendResult.error) {
      console.error("[quote-submit] Resend error:", sendResult.error)
      return NextResponse.json({ error: "Failed to send" }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[quote-submit] Error:", error)
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 })
  }
}
