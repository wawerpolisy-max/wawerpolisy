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

    // Helper functions for formatting
    const getInsuranceLabel = (type: string) => {
      const labels: Record<string, string> = {
        mieszkanie: "🏠 Ubezpieczenie mieszkaniowe",
        samochod: "🚗 Ubezpieczenie komunikacyjne",
        podroze: "✈️ Ubezpieczenie turystyczne",
        firmowe: "🏢 Ubezpieczenie firmowe",
        nnw: "🩺 Ubezpieczenie NNW",
        zdrowotne: "❤️ Ubezpieczenie zdrowotne",
        zyciowe: "🛡️ Ubezpieczenie na życie",
      }
      return labels[type] || type
    }

    const getContactIcon = (pref: string) => {
      if (pref === "email") return "📧"
      if (pref === "telefon") return "📞"
      return "💬"
    }

    const formatDate = (date: string) => {
      if (!date) return ""
      const d = new Date(date)
      return d.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }

    // Build HTML email
    const insuranceLabel = getInsuranceLabel(selectedInsurance)
    const contactIcon = getContactIcon(contactPreference)

    let sectionsHTML = ""

    // Section: Contact Info
    sectionsHTML += `
      <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">👤 Dane kontaktowe</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 220px;">Imię i nazwisko:</td>
            <td style="padding: 8px;">${fullName}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px;">${phone}</td>
          </tr>
          ${email ? `<tr><td style="padding: 8px; font-weight: bold;">E-mail:</td><td style="padding: 8px;">${email}</td></tr>` : ""}
          ${contactPreference ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Preferowana forma kontaktu:</td><td style="padding: 8px;">${contactIcon} ${contactPreference}</td></tr>` : ""}
        </table>
      </div>
    `

    // Section: Insurance-specific details
    if (selectedInsurance === "mieszkanie") {
      sectionsHTML += `
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">🏠 Szczegóły nieruchomości</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.mieszkanie_lokalizacja ? `<tr><td style="padding: 8px; font-weight: bold; width: 220px;">Lokalizacja:</td><td style="padding: 8px;">${body.mieszkanie_lokalizacja}</td></tr>` : ""}
            ${body.mieszkanie_rodzaj ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Rodzaj:</td><td style="padding: 8px;">${body.mieszkanie_rodzaj}</td></tr>` : ""}
            ${body.mieszkanie_pietro ? `<tr><td style="padding: 8px; font-weight: bold;">Piętro:</td><td style="padding: 8px;">${body.mieszkanie_pietro}</td></tr>` : ""}
            ${body.mieszkanie_powierzchnia ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Powierzchnia:</td><td style="padding: 8px;">${body.mieszkanie_powierzchnia} m²</td></tr>` : ""}
            ${body.mieszkanie_rok ? `<tr><td style="padding: 8px; font-weight: bold;">Rok budowy:</td><td style="padding: 8px;">${body.mieszkanie_rok}</td></tr>` : ""}
            ${body.mieszkanie_wartosc ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Szacowana wartość:</td><td style="padding: 8px;">${body.mieszkanie_wartosc} PLN</td></tr>` : ""}
            ${body.mieszkanie_ryzyka ? `<tr><td style="padding: 8px; font-weight: bold;">Kluczowe ryzyka:</td><td style="padding: 8px;">${body.mieszkanie_ryzyka}</td></tr>` : ""}
          </table>
        </div>
      `
    } else if (selectedInsurance === "samochod") {
      sectionsHTML += `
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">🚗 Szczegóły pojazdu</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.samochod_zakres ? `<tr><td style="padding: 8px; font-weight: bold; width: 220px;">Zakres ochrony:</td><td style="padding: 8px;"><strong style="color: #0369a1;">${body.samochod_zakres}</strong></td></tr>` : ""}
            ${body.samochod_marka ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Marka:</td><td style="padding: 8px;">${body.samochod_marka}</td></tr>` : ""}
            ${body.samochod_model ? `<tr><td style="padding: 8px; font-weight: bold;">Model:</td><td style="padding: 8px;">${body.samochod_model}</td></tr>` : ""}
            ${body.samochod_rok ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Rok produkcji:</td><td style="padding: 8px;">${body.samochod_rok}</td></tr>` : ""}
            ${body.samochod_data_rejestracji ? `<tr><td style="padding: 8px; font-weight: bold;">Data pierwszej rejestracji:</td><td style="padding: 8px;">${formatDate(body.samochod_data_rejestracji)}</td></tr>` : ""}
            ${body.samochod_data_prawa_jazdy ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Data uzyskania prawa jazdy:</td><td style="padding: 8px;">${formatDate(body.samochod_data_prawa_jazdy)}</td></tr>` : ""}
            ${body.samochod_pojemnosc ? `<tr><td style="padding: 8px; font-weight: bold;">Pojemność silnika:</td><td style="padding: 8px;">${body.samochod_pojemnosc} cm³</td></tr>` : ""}
            ${body.samochod_moc ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Moc silnika:</td><td style="padding: 8px;">${body.samochod_moc} KM</td></tr>` : ""}
            ${body.samochod_wartosc_ac ? `<tr><td style="padding: 8px; font-weight: bold;">Szacowana wartość (dla AC):</td><td style="padding: 8px;">${body.samochod_wartosc_ac} PLN</td></tr>` : ""}
            ${body.samochod_uzytkowanie ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Sposób użytkowania:</td><td style="padding: 8px;">${body.samochod_uzytkowanie}</td></tr>` : ""}
            ${body.samochod_szkody ? `<tr><td style="padding: 8px; font-weight: bold;">Szkody w ostatnich latach:</td><td style="padding: 8px;">${body.samochod_szkody}</td></tr>` : ""}
            ${body.samochod_uwagi ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Uwagi:</td><td style="padding: 8px;">${body.samochod_uwagi}</td></tr>` : ""}
          </table>
        </div>
      `
    } else if (selectedInsurance === "podroze") {
      sectionsHTML += `
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">✈️ Szczegóły podróży</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.podroze_kierunek ? `<tr><td style="padding: 8px; font-weight: bold; width: 220px;">Kierunek:</td><td style="padding: 8px;">${body.podroze_kierunek}</td></tr>` : ""}
            ${body.podroze_termin ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Termin wyjazdu:</td><td style="padding: 8px;">${formatDate(body.podroze_termin)}</td></tr>` : ""}
            ${body.podroze_termin_powrot ? `<tr><td style="padding: 8px; font-weight: bold;">Data powrotu:</td><td style="padding: 8px;">${formatDate(body.podroze_termin_powrot)}</td></tr>` : ""}
            ${body.podroze_dorosli_ilosc ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Dorośli (ilość):</td><td style="padding: 8px;">${body.podroze_dorosli_ilosc} ${parseInt(body.podroze_dorosli_ilosc) === 1 ? "osoba" : "osoby"}</td></tr>` : ""}
            ${body.podroze_dorosli_wiek ? `<tr><td style="padding: 8px; font-weight: bold;">Wiek dorosłych:</td><td style="padding: 8px;">${body.podroze_dorosli_wiek} lat</td></tr>` : ""}
            ${body.podroze_dzieci_ilosc ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Dzieci (ilość):</td><td style="padding: 8px;">${body.podroze_dzieci_ilosc}</td></tr>` : ""}
            ${body.podroze_dzieci_wiek && body.podroze_dzieci_ilosc !== "0" ? `<tr><td style="padding: 8px; font-weight: bold;">Wiek dzieci:</td><td style="padding: 8px;">${body.podroze_dzieci_wiek} lat</td></tr>` : ""}
            ${body.podroze_sporty ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Sporty ekstremalne:</td><td style="padding: 8px;">${body.podroze_sporty}</td></tr>` : ""}
            ${body.podroze_choroby ? `<tr><td style="padding: 8px; font-weight: bold;">Choroby przewlekłe:</td><td style="padding: 8px;">${body.podroze_choroby}</td></tr>` : ""}
            ${body.podroze_uwagi ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Uwagi:</td><td style="padding: 8px;">${body.podroze_uwagi}</td></tr>` : ""}
          </table>
        </div>
      `
    } else if (selectedInsurance === "firmowe") {
      sectionsHTML += `
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">🏢 Szczegóły firmy</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.firmowe_nazwa ? `<tr><td style="padding: 8px; font-weight: bold; width: 220px;">Nazwa firmy:</td><td style="padding: 8px;">${body.firmowe_nazwa}</td></tr>` : ""}
            ${body.firmowe_nip ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">NIP:</td><td style="padding: 8px;">${body.firmowe_nip}</td></tr>` : ""}
            ${body.firmowe_zakres ? `<tr><td style="padding: 8px; font-weight: bold;">Zakres ochrony:</td><td style="padding: 8px;">${body.firmowe_zakres}</td></tr>` : ""}
            ${body.firmowe_skala ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Skala działalności:</td><td style="padding: 8px;">${body.firmowe_skala}</td></tr>` : ""}
            ${body.firmowe_opis ? `<tr><td style="padding: 8px; font-weight: bold;">Opis działalności:</td><td style="padding: 8px;">${body.firmowe_opis}</td></tr>` : ""}
          </table>
        </div>
      `
    } else if (selectedInsurance === "nnw") {
      sectionsHTML += `
        <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">🩺 Szczegóły ubezpieczenia NNW</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.nnw_typ ? `<tr><td style="padding: 8px; font-weight: bold; width: 220px;">Typ:</td><td style="padding: 8px;">${body.nnw_typ}</td></tr>` : ""}
            ${body.nnw_zawod ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Zawód:</td><td style="padding: 8px;">${body.nnw_zawod}</td></tr>` : ""}
            ${body.nnw_suma ? `<tr><td style="padding: 8px; font-weight: bold;">Suma ubezpieczenia:</td><td style="padding: 8px;">${body.nnw_suma} PLN</td></tr>` : ""}
            ${body.nnw_sport ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Sport:</td><td style="padding: 8px;">${body.nnw_sport}</td></tr>` : ""}
            ${body.nnw_sport_zawodowy ? `<tr><td style="padding: 8px; font-weight: bold;">Sport zawodowy:</td><td style="padding: 8px;">${body.nnw_sport_zawodowy}</td></tr>` : ""}
            ${body.nnw_dzieci ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Dzieci:</td><td style="padding: 8px;">${body.nnw_dzieci}</td></tr>` : ""}
            ${body.nnw_szkola ? `<tr><td style="padding: 8px; font-weight: bold;">Szkoła:</td><td style="padding: 8px;">${body.nnw_szkola}</td></tr>` : ""}
            ${body.nnw_uwagi ? `<tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Uwagi:</td><td style="padding: 8px;">${body.nnw_uwagi}</td></tr>` : ""}
          </table>
        </div>
      `
    }

    // Section: Priorities
    if (priorities) {
      const priorityList = priorities
        .split(", ")
        .map((p) => `<li style="margin: 5px 0;">${p}</li>`)
        .join("")
      sectionsHTML += `
        <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #92400e; margin-top: 0;">🎯 Priorytety klienta</h2>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${priorityList}
          </ul>
        </div>
      `
    }

    // Section: Additional notes
    if (additionalInfo) {
      sectionsHTML += `
        <div style="background: #eff6ff; border: 1px solid #93c5fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">💬 Dodatkowe uwagi</h2>
          <p style="margin: 0; line-height: 1.6;">${additionalInfo}</p>
        </div>
      `
    }

    // Build complete HTML
    const htmlEmail = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APK - ${fullName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎯 Nowy formularz APK</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Analiza Potrzeb Klienta - wawerpolisy.pl</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 20px;">
      
      <!-- Insurance Type Badge -->
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Rodzaj ubezpieczenia</p>
        <p style="margin: 10px 0 0 0; font-size: 22px; font-weight: bold; color: #1e40af;">${insuranceLabel}</p>
      </div>

      ${sectionsHTML}

    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Wiadomość wysłana automatycznie z formularza APK | 
        <a href="https://www.wawerpolisy.pl" style="color: #3b82f6; text-decoration: none;">wawerpolisy.pl</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
        © ${new Date().getFullYear()} WawerPolisy - Mateusz Pawelec
      </p>
    </div>

  </div>

  <!-- JSON Data for n8n automation -->
  <script type="application/json" id="apk-data">
${JSON.stringify(body, null, 2)}
  </script>

</body>
</html>
    `

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html: htmlEmail,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const msg = s(err?.message || "Nieznany błąd po stronie serwera APK.", 500)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
