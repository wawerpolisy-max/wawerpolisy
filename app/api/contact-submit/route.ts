// app/api/contact-submit/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const Schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  topic: z.string().min(2),
  message: z.string().min(10),
  consent: z.boolean(),
  website: z.string().optional().default(""), // honeypot
})

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null)
    const parsed = Schema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: "Uzupełnij wymagane pola." }, { status: 400 })
    }

    const data = parsed.data

    // Honeypot: jeśli bot wypełnił ukryte pole -> udaj sukces i nie wysyłaj maila
    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const hasAnyContact =
      (data.phone && data.phone.trim().length >= 7) || (data.email && data.email.includes("@"))

    if (!hasAnyContact) {
      return NextResponse.json({ error: "Podaj telefon lub e-mail." }, { status: 400 })
    }

    if (!data.consent) {
      return NextResponse.json({ error: "Zaznacz zgodę na przetwarzanie danych." }, { status: 400 })
    }

    const to = process.env.CONTACT_TO
    const from = process.env.CONTACT_FROM

    if (!to || !from || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Brak konfiguracji wysyłki (ENV) po stronie serwera." },
        { status: 500 }
      )
    }

    const subject = `[Kontakt] ${data.topic} — ${data.fullName}`
    const text = [
      `Imię i nazwisko: ${data.fullName}`,
      `Telefon: ${data.phone || "-"}`,
      `E-mail: ${data.email || "-"}`,
      `Temat: ${data.topic}`,
      "",
      "Wiadomość:",
      data.message,
      "",
      `Zgoda: ${data.consent ? "TAK" : "NIE"}`,
    ].join("\n")

    await resend.emails.send({
      from,
      to,
      subject,
      text,
      replyTo: data.email && data.email.includes("@") ? data.email : undefined,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Błąd serwera podczas wysyłki." }, { status: 500 })
  }
}
