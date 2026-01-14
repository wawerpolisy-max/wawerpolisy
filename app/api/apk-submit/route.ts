import { NextResponse } from "next/server"
import { Resend } from "resend"

function safeString(v: unknown, max = 500) {
  if (v == null) return ""
  const s = String(v).trim()
  return s.length > max ? s.slice(0, max) : s
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({} as any))

    // --- dane wspólne / kontaktowe ---
    const selectedInsurance = safeString(
      (data as any).selectedInsurance ??
        (data as any).insuranceType ??
        (data as any).rodzajUbezpieczenia,
      60,
    )

    const fullName = safeString(
      (data as any).fullName ?? (data as any).name,
      120,
    )
    const phone = safeString((data as any).phone, 40)
    const email = safeString((data as any).email, 160)
    const contactPreference = safeString(
      (data as any).contactPreference,
      40,
    )

    const additionalInfo = safeString(
      (data as any).additionalInfo ?? (data as any).details,
      2000,
    )

    const prioritiesArr: string[] = Array.isArray((data as any).priorities)
      ? (data as any).priorities
      : []
    const priorities = safeString(prioritiesArr.join(", "), 300)

    const zgodaPrzetwarzanie = Boolean(
      (data as any).zgodaPrzetwarzanie ?? (data as any).consent,
    )
    const zgodaKlauzula = Boolean((data as any).zgodaKlauzula)

    // Walidacja minimalna – to, co masz w formularzu jako wymagane
    if (!fullName || !phone) {
      return NextResponse.json(
        {
          ok: false,
          error: "Uzupełnij wymagane pola: imię i nazwisko oraz telefon.",
        },
        { status: 400 },
      )
    }

    if (!selectedInsurance) {
      return NextResponse.json(
        { ok: false, error: "Wybierz rodzaj ubezpieczenia." },
        { status: 400 },
      )
    }

    if (!zgodaPrzetwarzanie || !zgodaKlauzula) {
      return NextResponse.json(
        {
          ok: false,
          error: "Zaznacz wymagane zgody RODO zgodnie z formularzem.",
        },
        { status: 400 },
      )
    }

    // --- konfiguracja Resend / ENV ---
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Brak RESEND_API_KEY w konfiguracji serwera." },
        { status: 500 },
      )
    }

    const toEmail =
      process.env.APK_TO_EMAIL ??
      process.env.CONTACT_TO ??
      process.env.CONTACT_TO_EMAIL ??
      "wawerpolisy@gmail.com"

    const fromEmail =
      process.env.APK_FROM_EMAIL ??
      process.env.CONTACT_FROM ??
      "WawerPolisy APK <onboarding@resend.dev>"

    const resend = new Resend(apiKey)

    // --- sekcje specyficzne dla rodzaju ubezpieczenia ---

    const lines: string[] = []

    // Nagłówek
    lines.push("NOWY FORMULARZ APK")
    lines.push("")
    lines.push(`Rodzaj ubezpieczenia: ${selectedInsurance}`)
    lines.push("")

    // Dane kontaktowe
    lines.push("DANE KONTAKTOWE:")
    lines.push(`Imię i nazwisko: ${fullName}`)
    lines.push(`Telefon: ${phone}`)
    if (email) lines.push(`E-mail: ${email}`)
    if (contactPreference)
      lines.push(`Preferowana forma kontaktu: ${contactPreference}`)
    if (priorities) lines.push(`Priorytety klienta: ${priorities}`)
    lines.push("")

    // DANE SZCZEGÓŁOWE WG TYPU
    const d = data as any

    if (selectedInsurance === "mieszkanie") {
      lines.push("MIESZKANIE / DOM:")
      lines.push(`Lokalizacja: ${safeString(d.mieszkanie_lokalizacja, 200)}`)
      lines.push(`Rodzaj: ${safeString(d.mieszkanie_rodzaj, 100)}`)
      lines.push(`Powierzchnia: ${safeString(d.mieszkanie_powierzchnia, 50)}`)
      lines.push(`Rok budowy: ${safeString(d.mieszkanie_rok, 20)}`)
      lines.push(`Wartość: ${safeString(d.mieszkanie_wartosc, 50)}`)
      lines.push(`Ryzyka: ${safeString(d.mieszkanie_ryzyka, 500)}`)
      lines.push("")
    }

    if (selectedInsurance === "samochod") {
      lines.push("SAMOCHÓD:")
      lines.push(`Zakres: ${safeString(d.samochod_zakres, 100)}`)
      lines.push(`Marka / model: ${safeString(d.samochod_marka, 200)}`)
      lines.push(`Rok produkcji: ${safeString(d.samochod_rok, 20)}`)
      lines.push(`Pojemność / moc: ${safeString(d.samochod_moc, 100)}`)
      lines.push(`Użytkowanie: ${safeString(d.samochod_uzytkowanie, 100)}`)
      lines.push(`Szkody: ${safeString(d.samochod_szkody, 100)}`)
      lines.push(`Uwagi: ${safeString(d.samochod_uwagi, 800)}`)
      lines.push("")
    }

    if (selectedInsurance === "podroze") {
      lines.push("PODRÓŻE:")
      lines.push(`Kierunek: ${safeString(d.podroze_kierunek, 200)}`)
      lines.push(`Termin: ${safeString(d.podroze_termin, 100)}`)
      lines.push(`Osoby: ${safeString(d.podroze_osoby, 200)}`)
      lines.push(`Sporty: ${safeString(d.podroze_sporty, 200)}`)
      lines.push(`Choroby przewlekłe: ${safeString(d.podroze_choroby, 100)}`)
      lines.push(`Uwagi: ${safeString(d.podroze_uwagi, 800)}`)
      lines.push("")
    }

    if (selectedInsurance === "firmowe") {
      lines.push("UBEZPIECZENIE FIRMOWE:")
      lines.push(`Nazwa / branża: ${safeString(d.firmowe_nazwa, 200)}`)
      lines.push(`NIP: ${safeString(d.firmowe_nip, 50)}`)
      lines.push(`Zakres: ${safeString(d.firmowe_zakres, 200)}`)
      lines.push(`Skala: ${safeString(d.firmowe_skala, 200)}`)
      lines.push(`Opis ryzyk / oczekiwań: ${safeString(d.firmowe_opis, 2000)}`)
      lines.push("")
    }

    if (selectedInsurance === "nnw") {
      lines.push("NNW:")
      lines.push(`Typ: ${safeString(d.nnw_typ, 100)}`)
      lines.push(`Dzieci (liczba + wiek): ${safeString(d.nnw_dzieci, 200)}`)
      lines.push(`Szkoła: ${safeString(d.nnw_szkola, 100)}`)
      lines.push(`Aktywność sportowa: ${safeString(d.nnw_sport, 200)}`)
      lines.push(`Zawód: ${safeString(d.nnw_zawod, 200)}`)
      lines.push(`Suma ubezpieczenia: ${safeString(d.nnw_suma, 100)}`)
      lines.push(
        `Sport zawodowy: ${safeString(d.nnw_sport_zawodowy, 100)}`,
      )
      lines.push(`Uwagi: ${safeString(d.nnw_uwagi, 800)}`)
      lines.push("")
    }

    // Dodatkowe informacje z kroku 4
    if (additionalInfo) {
      lines.push("DODATKOWE INFORMACJE KLIENTA:")
      lines.push(additionalInfo)
      lines.push("")
    }

    // Zgody
    lines.push(
      `Zgoda na przetwarzanie danych: ${zgodaPrzetwarzanie ? "TAK" : "NIE"}`,
    )
    lines.push(`Zgoda na klauzulę informacyjną: ${zgodaKlauzula ? "TAK" : "NIE"}`)

    const subject = `APK / Wycena: ${selectedInsurance} – ${fullName}`

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text: lines.join("\n"),
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const msg = safeString(err?.message || "Błąd serwera podczas wysyłki APK.", 500)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
Fix APK API to use fullName & zgodaPrzetwarzanie
