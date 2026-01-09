import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { getClientIp, isRateLimited } from "@/lib/antiSpam"
import { isEmail, normalizePhone, safeString } from "@/lib/validation"

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "wawerpolisy@gmail.com"
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "WawerPolisy <noreply@wawerpolisy.pl>"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited({ bucket: "contact", id: ip, windowMs: 60_000, max: 6 })) {
      return NextResponse.json({ error: "Rate limit" }, { status: 429 })
    }

    const data = await request.json()

    // Honeypot: bots usually fill hidden fields.
    if (typeof data?.website === "string" && data.website.trim().length > 0) {
      return NextResponse.json({ success: true })
    }

    const fullName = safeString(data?.fullName, 120)
    const email = safeString(data?.email, 200)
    const phone = normalizePhone(data?.phone)
    const topic = safeString(data?.topic, 120)
    const message = safeString(data?.message, 5000)
    const consent = Boolean(data?.consent)

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Invalid fullName" }, { status: 400 })
    }

    const hasEmail = isEmail(email)
    const hasPhone = phone.length >= 7
    if (!hasEmail && !hasPhone) {
      return NextResponse.json({ error: "Provide phone or email" }, { status: 400 })
    }

    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Message too short" }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 })
    }

    const subject = `Kontakt – ${topic || "zapytanie"} – ${fullName}`
    const text = [
      "Nowa wiadomość z formularza kontaktowego (wawerpolisy.pl)",
      "",
      `Imię i nazwisko: ${fullName}`,
      `Telefon: ${hasPhone ? phone : "-"}`,
      `Email: ${hasEmail ? email : "-"}`,
      `Temat: ${topic || "-"}`,
      `Zgoda RODO: ${consent ? "TAK" : "NIE"}`,
      "",
      "Wiadomość:",
      message,
      "",
      `IP: ${ip}`,
      `UA: ${request.headers.get("user-agent") || "-"}`,
      `Czas: ${new Date().toISOString()}`,
    ].join("\n")

    const sendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      text,
      replyTo: hasEmail ? email : undefined,
    })

    if (sendResult.error) {
      console.error("[contact-submit] Resend error:", sendResult.error)
      return NextResponse.json({ error: "Failed to send" }, { status: 502 })
    }

    // Optional autoresponder to user (only if email provided)
    if (hasEmail) {
      const autoText = [
        `Cześć ${fullName},`,
        "",
        "Dzięki za wiadomość. Odpowiem najszybciej jak to możliwe.",
        "",
        "Jeśli temat jest pilny, możesz też zadzwonić — numer jest na stronie.",
        "",
        "Pozdrawiam,",
        "Mateusz Pawelec",
        "wawerpolisy.pl",
      ].join("\n")

      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Potwierdzenie kontaktu – wawerpolisy.pl",
        text: autoText,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[contact-submit] Error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
