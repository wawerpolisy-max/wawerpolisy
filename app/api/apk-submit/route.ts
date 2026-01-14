import { NextResponse } from "next/server"
import { Resend } from "resend"

function s(v: unknown, max = 500) {
  if (v == null) return ""
  const str = String(v).trim()
  return str.length > max ? str.slice(0, max) : str
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))

    // NAZWY PÓL – dokładnie takie jak w APKForm:
    const selectedInsurance = s(body.selectedInsurance, 60)
    const fullName = s(body.fullName, 120)
    const phone = s(body.phone, 40)
    const email = s(body.email, 160)
    const contactPreference = s(body.contactPreference, 40)
    const additionalInfo = s(body.additionalInfo, 2000)

    const priorities = Array.isArray(body.priorities)
      ? body.priorities.map((p: any) => s(p, 100)).join(", ")
      : ""

    const zgodaPrzetwarzanie = Boolean(body.zgodaPrzetwarzanie)
    const zgodaKlauzula = Boolean(body.zgodaKlauzula)

    // --- walidacja minimalna, spójna z formularzem ---
    if (!fullName || !phone) {
      return NextResponse.json(
        {
          ok: false,
          error: "Brak wymaganych pól: imię i nazwisko oraz telefon.",
        },
        { status: 400 },
      )
    }

    if (!selectedInsurance) {
      return NextResponse.json(
        { ok: false, error: "Brak wybranego rodzaju ubezpieczenia." },
        { status: 400 },
      )
    }

    if (!zgodaPrzetwarzanie || !zgodaKlauzula) {
      return NextResponse.json(
        {
          ok: false,
          error: "Zaznacz obie wymagane zgody RODO.",
        },
        { status: 400 },
      )
    }

    // --- ENV + Resend ---
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Brak RESEND_API_KEY po stronie serwera." },
        { status: 500 },
      )
    }

    // Proste, bez kombinacji – jeśli nie ma APK_TO_EMAIL, idzie na wawerpolisy@gmail.com
    const toEmail =
      process.env.APK_TO_EMAIL ??
      process.env.CONTACT_TO ??
      "wawerpolisy@gmail.com"

    // UWAGA: tutaj MUSI być nadawca z domeny zweryfikowanej w Resend.
    // Dopóki nie masz własnej zweryfikowanej domeny – trzymaj się resend.dev.
    const fromEmail =
      process.env.APK_FROM_EMAIL ??
      "WawerPolisy APK <onboarding@resend.dev>"

    const resend = new Resend(apiKey)

    const subject = `APK: ${selectedInsurance} – ${fullName}`

    const lines: string[] = []

    lines.push("NOWY FORMULARZ APK")
    lines.push("")
    lines.push("DANE KONTAKTOWE:")
    lines.push(`Imię i nazwisko: ${fullName}`)
    lines.push(`Telefon: ${phone}`)
    if (email) lines.push(`E-mail: ${email}`)
    if (contactPreference)
      lines.push(`Preferowana forma kontaktu: ${contactPreference}`)
    if (priorities) lines.push(`Priorytety klienta: ${priorities}`)
    lines.push("")
    if (additionalInfo) {
      lines.push("Dodatkowe informacje (z kroku 4):")
      lines.push(additionalInfo)
      lines.push("")
    }

    // Na koniec – CAŁY surowy payload, żebyś widział wszystko:
    lines.push("=== RAW JSON FORM DATA ===")
    lines.push(JSON.stringify(body, null, 2))

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text: lines.join("\n"),
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const msg = s(err?.message || "Nieznany błąd po stronie serwera APK.", 500)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
