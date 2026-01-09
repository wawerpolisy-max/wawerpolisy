import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { getClientIp, isRateLimited } from "@/lib/antiSpam"
import { isEmail, normalizePhone, safeString } from "@/lib/validation"

const APK_TO_EMAIL = process.env.APK_TO_EMAIL || "wawerpolisy@gmail.com"
const APK_FROM_EMAIL = process.env.APK_FROM_EMAIL || "WawerPolisy APK <noreply@wawerpolisy.pl>"

type AnyRecord = Record<string, unknown>

function titleCase(s: string) {
  return s
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (m) => m.toUpperCase())
}

function line(label: string, value: unknown, max = 400) {
  const v = safeString(typeof value === "string" ? value : String(value ?? ""), max)
  return `${label}: ${v || "—"}`
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited({ bucket: "apk", id: ip, windowMs: 60_000, max: 6 })) {
      return NextResponse.json({ error: "Rate limit" }, { status: 429 })
    }

    const data = (await request.json()) as AnyRecord

    if (typeof data?.website === "string" && String(data.website).trim().length > 0) {
      return NextResponse.json({ success: true })
    }

    const selectedInsurance = safeString(data.selectedInsurance, 40)
    const fullName = safeString(data.fullName, 120)
    const email = safeString(data.email, 200)
    const phone = normalizePhone(data.phone)
    const contactPreference = safeString(data.contactPreference, 40)
    const priorities = Array.isArray(data.priorities) ? (data.priorities as unknown[]).map(String) : []
    const additionalInfo = safeString(data.additionalInfo, 6000)

    const zgodaPrzetwarzanie = Boolean(data.zgodaPrzetwarzanie)
    const zgodaKlauzula = Boolean(data.zgodaKlauzula)

    if (!selectedInsurance) return NextResponse.json({ error: "Missing selectedInsurance" }, { status: 400 })
    if (!fullName || fullName.length < 2) return NextResponse.json({ error: "Invalid fullName" }, { status: 400 })

    const hasEmail = isEmail(email)
    const hasPhone = phone.length >= 7
    if (!hasEmail && !hasPhone) return NextResponse.json({ error: "Provide phone or email" }, { status: 400 })

    if (!zgodaPrzetwarzanie || !zgodaKlauzula) {
      return NextResponse.json({ error: "Consents required" }, { status: 400 })
    }

    const apkNumber = `APK-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`
    const currentDate = new Date().toLocaleDateString("pl-PL")

    const typeLabelMap: Record<string, string> = {
      mieszkanie: "Ubezpieczenie mieszkaniowe",
      samochod: "Ubezpieczenie komunikacyjne (OC/AC)",
      podroze: "Ubezpieczenie turystyczne",
      firmowe: "Ubezpieczenia firmowe",
      nnw: "Ubezpieczenie NNW",
    }

    const insuranceTypeLabel = typeLabelMap[selectedInsurance] || `Ubezpieczenie – ${selectedInsurance}`

    // Per-type details (read from known fields)
    const sections: string[] = []

    if (selectedInsurance === "mieszkanie") {
      sections.push(
        "=== MIESZKANIE / DOM ===",
        line("Lokalizacja", data.mieszkanie_lokalizacja),
        line("Rodzaj", data.mieszkanie_rodzaj),
        line("Powierzchnia", data.mieszkanie_powierzchnia),
        line("Rok budowy", data.mieszkanie_rok),
        line("Wartość mienia", data.mieszkanie_wartosc),
        line("Ryzyka / potrzeby", data.mieszkanie_ryzyka, 800),
      )
    }

    if (selectedInsurance === "samochod") {
      sections.push(
        "=== SAMOCHÓD ===",
        line("Zakres", data.samochod_zakres),
        line("Marka / model", data.samochod_marka),
        line("Rok", data.samochod_rok),
        line("Moc", data.samochod_moc),
        line("Użytkowanie", data.samochod_uzytkowanie),
        line("Szkody", data.samochod_szkody),
        line("Uwagi", data.samochod_uwagi, 800),
      )
    }

    if (selectedInsurance === "podroze") {
      sections.push(
        "=== PODRÓŻE ===",
        line("Kierunek", data.podroze_kierunek),
        line("Termin", data.podroze_termin),
        line("Liczba osób", data.podroze_osoby),
        line("Sport / aktywność", data.podroze_sport),
        line("Choroby przewlekłe", data.podroze_choroby),
        line("Uwagi", data.podroze_uwagi, 800),
      )
    }

    if (selectedInsurance === "firmowe") {
      sections.push(
        "=== FIRMA ===",
        line("Nazwa firmy", data.firmowe_nazwa),
        line("NIP", data.firmowe_nip),
        line("Zakres", data.firmowe_zakres),
        line("Skala działalności", data.firmowe_skala),
        line("Opis / potrzeby", data.firmowe_opis, 1200),
      )
    }

    if (selectedInsurance === "nnw") {
      sections.push(
        "=== NNW ===",
        line("Typ", data.nnw_typ),
        line("Dzieci", data.nnw_dzieci),
        line("Szkoła", data.nnw_szkola),
        line("Sport", data.nnw_sport),
        line("Zawód", data.nnw_zawod),
        line("Suma ubezpieczenia", data.nnw_suma),
        line("Sport zawodowy", data.nnw_sport_zawodowy),
        line("Uwagi", data.nnw_uwagi, 1200),
      )
    }

    const text = [
      "NOWY WNIOSEK APK (wawerpolisy.pl)",
      "",
      `Nr APK: ${apkNumber}`,
      `Data: ${currentDate}`,
      `Rodzaj: ${insuranceTypeLabel}`,
      "",
      "=== DANE KONTAKTOWE ===",
      line("Imię i nazwisko", fullName),
      line("Telefon", hasPhone ? phone : "—"),
      line("Email", hasEmail ? email : "—"),
      line("Preferowany kontakt", contactPreference),
      priorities.length ? `Priorytety: ${priorities.join(", ")}` : "Priorytety: —",
      "",
      "=== DODATKOWE INFORMACJE ===",
      additionalInfo || "—",
      "",
      ...sections,
      "",
      "=== ZGODY ===",
      `Zgoda na przetwarzanie danych: ${zgodaPrzetwarzanie ? "TAK" : "NIE"}`,
      `Potwierdzenie klauzuli informacyjnej: ${zgodaKlauzula ? "TAK" : "NIE"}`,
      "",
      `IP: ${ip}`,
      `UA: ${request.headers.get("user-agent") || "-"}`,
      `Czas: ${new Date().toISOString()}`,
    ].join("\n")

    const subject = `APK ${apkNumber} – ${fullName} – ${titleCase(selectedInsurance)} – ${currentDate}`

    const sendResult = await resend.emails.send({
      from: APK_FROM_EMAIL,
      to: [APK_TO_EMAIL], // requested: APK always goes to wawerpolisy@gmail.com
      subject,
      text,
      replyTo: hasEmail ? email : undefined,
    })

    if (sendResult.error) {
      console.error("[apk-submit] Resend error:", sendResult.error)
      return NextResponse.json({ error: "Failed to send APK" }, { status: 502 })
    }

    return NextResponse.json({ success: true, apkNumber })
  } catch (error) {
    console.error("[apk-submit] Error:", error)
    return NextResponse.json({ error: "Failed to send APK" }, { status: 500 })
  }
}
