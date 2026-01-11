import { NextResponse } from "next/server"
import { Resend } from "resend"

function safeString(value: unknown, maxLen = 2000) {
  if (typeof value !== "string") return ""
  const v = value.trim()
  if (!v) return ""
  return v.length > maxLen ? v.slice(0, maxLen) : v
}

function titleCase(s: string) {
  return s
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Compatibility: accept `insuranceType` as an alias for `selectedInsurance`.
    const selectedInsurance = safeString(data.selectedInsurance ?? (data as any).insuranceType, 40)
    const phone = safeString(data.phone, 40)
    const name = safeString(data.name, 120)
    const email = safeString(data.email, 120)

    const consent1 = Boolean(data.consent1)
    const consent2 = Boolean(data.consent2)

    const mieszkanie = data.mieszkanie || {}
    const samochod = data.samochod || {}
    const podroze = data.podroze || {}
    const firmowe = data.firmowe || {}
    const nnw = data.nnw || {}

    if (!selectedInsurance) return NextResponse.json({ error: "Missing selectedInsurance" }, { status: 400 })
    if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 })
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 })
    if (!consent1 || !consent2) return NextResponse.json({ error: "Consents required" }, { status: 400 })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 })

    const to = process.env.APK_TO_EMAIL || process.env.TO_EMAIL
    if (!to) return NextResponse.json({ error: "Missing recipient email (APK_TO_EMAIL/TO_EMAIL)" }, { status: 500 })

    const from = process.env.FROM_EMAIL || "onboarding@resend.dev"

    const typeLabelMap: Record<string, string> = {
      mieszkanie: "Ubezpieczenie mieszkania / domu",
      samochod: "Ubezpieczenie samochodu (OC/AC)",
      podroze: "Ubezpieczenie podróży",
      firmowe: "Ubezpieczenie firmowe",
      nnw: "Ubezpieczenie NNW",
    }

    const typeLabel = typeLabelMap[selectedInsurance] || `Ubezpieczenie: ${titleCase(selectedInsurance)}`
    const subject = `[APK] ${typeLabel} — ${name} (${phone})`

    const lines: string[] = []
    lines.push("Nowe zgłoszenie APK (formularz):")
    lines.push("")
    lines.push(`Rodzaj: ${typeLabel}`)
    lines.push(`Imię i nazwisko: ${name}`)
    lines.push(`Telefon: ${phone}`)
    if (email) lines.push(`E-mail: ${email}`)
    lines.push("")

    const addSection = (title: string, fields: Record<string, unknown>) => {
      const entries = Object.entries(fields)
        .map(([k, v]) => [k, safeString(v, 500)])
        .filter(([, v]) => Boolean(v))

      if (!entries.length) return
      lines.push(title)
      for (const [k, v] of entries) lines.push(`- ${k}: ${v}`)
      lines.push("")
    }

    if (selectedInsurance === "mieszkanie") {
      addSection("Dane mieszkania/domu:", {
        "Rodzaj nieruchomości": mieszkanie.propertyType,
        "Miasto": mieszkanie.city,
        "Metraż (m²)": mieszkanie.area,
        "Rok budowy": mieszkanie.yearBuilt,
        "Zakres": mieszkanie.coverage,
        "Suma ubezpieczenia": mieszkanie.sumInsured,
        "Uwagi": mieszkanie.notes,
      })
    }

    if (selectedInsurance === "samochod") {
      addSection("Dane samochodu:", {
        "Marka i model": samochod.makeModel,
        "Rok": samochod.year,
        "Wartość": samochod.value,
        "Rodzaj ochrony": samochod.coverage,
        "Zniżki / szkody": samochod.claims,
        "Uwagi": samochod.notes,
      })
    }

    if (selectedInsurance === "podroze") {
      addSection("Dane podróży:", {
        "Kraj/region": podroze.destination,
        "Termin": podroze.dates,
        "Liczba osób": podroze.people,
        "Sporty/ryzyka": podroze.risks,
        "Uwagi": podroze.notes,
      })
    }

    if (selectedInsurance === "firmowe") {
      addSection("Dane firmy:", {
        "Branża": firmowe.industry,
        "Zakres": firmowe.coverage,
        "Liczba pracowników": firmowe.employees,
        "Uwagi": firmowe.notes,
      })
    }

    if (selectedInsurance === "nnw") {
      addSection("Dane NNW:", {
        "Kogo dotyczy": nnw.person,
        "Zakres": nnw.coverage,
        "Suma": nnw.sumInsured,
        "Uwagi": nnw.notes,
      })
    }

    lines.push("Zgody: TAK (consent1 + consent2)")
    const text = lines.join("\n")

    const resend = new Resend(resendKey)
    await resend.emails.send({
      from,
      to,
      subject,
      text,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
