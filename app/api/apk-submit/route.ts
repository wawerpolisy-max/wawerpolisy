import { NextResponse } from "next/server";
import { Resend } from "resend";

function safeString(v: unknown, max = 500) {
  if (v == null) return "";
  const s = String(v).trim();
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));

    // mapowanie z Twojego formularza APK
    const name = safeString(data.fullName ?? data.name, 120);
    const phone = safeString(data.phone, 40);
    const email = safeString(data.email, 160);

    const selectedInsurance = safeString(
      data.selectedInsurance ??
        data.insuranceType ??
        data.rodzajUbezpieczenia,
      60
    );

    const contactPreference = safeString(data.contactPreference, 40);

    const priorities: string[] = Array.isArray(data.priorities)
      ? data.priorities.map((p: unknown) => safeString(p, 80)).filter(Boolean)
      : [];

    // zgody – akceptuj różne nazwy
    const consent =
      Boolean(data.consent) ||
      Boolean(data.zgodaPrzetwarzanie) ||
      Boolean(data.zgodaKlauzula);

    const additionalInfo = safeString(
      data.additionalInfo ?? data.details,
      2000
    );

    if (!name || !phone || !consent) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Uzupełnij wymagane pola (imię i nazwisko, telefon) i zaznacz wymagane zgody.",
        },
        { status: 400 }
      );
    }

    if (!selectedInsurance) {
      return NextResponse.json(
        { ok: false, error: "Wybierz rodzaj ubezpieczenia." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Brak konfiguracji wysyłki e-mail (RESEND_API_KEY).",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // używamy tych samych ENV co kontakt
    const to =
      process.env.CONTACT_TO ||
      process.env.APK_TO_EMAIL || // opcjonalnie, jakbyś kiedyś dodał
      "wawerpolisy@gmail.com";

    const from =
      process.env.CONTACT_FROM || "Wawerpolisy <onboarding@resend.dev>";

    const lines: string[] = [];

    lines.push("Nowy formularz APK (wielokrokowy)", "");
    lines.push("Dane kontaktowe:");
    lines.push(`Imię i nazwisko: ${name}`);
    lines.push(`Telefon: ${phone}`);
    if (email) lines.push(`E-mail: ${email}`);
    if (contactPreference)
      lines.push(`Preferowana forma kontaktu: ${contactPreference}`);
    lines.push("");

    lines.push(`Wybrana ochrona: ${selectedInsurance}`);
    if (priorities.length) {
      lines.push(`Priorytety klienta: ${priorities.join(", ")}`);
    }
    lines.push("");

    // szczegółowe sekcje wg typu
    if (selectedInsurance === "mieszkanie") {
      lines.push("--- Mieszkanie / Dom ---");
      lines.push(
        `Lokalizacja: ${safeString(data.mieszkanie_lokalizacja, 200)}`
      );
      lines.push(`Rodzaj: ${safeString(data.mieszkanie_rodzaj, 100)}`);
      lines.push(
        `Powierzchnia: ${safeString(data.mieszkanie_powierzchnia, 50)}`
      );
      lines.push(`Rok budowy: ${safeString(data.mieszkanie_rok, 10)}`);
      lines.push(
        `Szacowana wartość: ${safeString(data.mieszkanie_wartosc, 50)}`
      );
      lines.push(
        `Ryzyka / co chronić: ${safeString(data.mieszkanie_ryzyka, 500)}`
      );
      lines.push("");
    }

    if (selectedInsurance === "samochod") {
      lines.push("--- Samochód ---");
      lines.push(`Zakres: ${safeString(data.samochod_zakres, 100)}`);
      lines.push(`Marka / model: ${safeString(data.samochod_marka, 200)}`);
      lines.push(`Rok produkcji: ${safeString(data.samochod_rok, 10)}`);
      lines.push(`Pojemność / moc: ${safeString(data.samochod_moc, 100)}`);
      lines.push(
        `Sposób użytkowania: ${safeString(data.samochod_uzytkowanie, 100)}`
      );
      lines.push(`Szkody: ${safeString(data.samochod_szkody, 50)}`);
      lines.push(`Uwagi: ${safeString(data.samochod_uwagi, 500)}`);
      lines.push("");
    }

    if (selectedInsurance === "podroze") {
      lines.push("--- Podróże ---");
      lines.push(`Kierunek: ${safeString(data.podroze_kierunek, 200)}`);
      lines.push(`Termin: ${safeString(data.podroze_termin, 50)}`);
      lines.push(`Liczba osób + wiek: ${safeString(data.podroze_osoby, 200)}`);
      lines.push(`Sporty: ${safeString(data.podroze_sporty, 200)}`);
      lines.push(`Choroby przewlekłe: ${safeString(data.podroze_choroby, 50)}`);
      lines.push(`Uwagi: ${safeString(data.podroze_uwagi, 500)}`);
      lines.push("");
    }

    if (selectedInsurance === "firmowe") {
      lines.push("--- Ubezpieczenie firmy ---");
      lines.push(`Nazwa / branża: ${safeString(data.firmowe_nazwa, 200)}`);
      lines.push(`NIP: ${safeString(data.firmowe_nip, 50)}`);
      lines.push(`Zakres: ${safeString(data.firmowe_zakres, 200)}`);
      lines.push(`Skala: ${safeString(data.firmowe_skala, 200)}`);
      lines.push(`Opis ryzyk / oczekiwań: ${safeString(data.firmowe_opis, 800)}`);
      lines.push("");
    }

    if (selectedInsurance === "nnw") {
      lines.push("--- NNW ---");
      lines.push(`Typ: ${safeString(data.nnw_typ, 50)}`);
      lines.push(`Dzieci (liczba + wiek): ${safeString(data.nnw_dzieci, 200)}`);
      lines.push(`Szkoła: ${safeString(data.nnw_szkola, 100)}`);
      lines.push(`Aktywność sportowa: ${safeString(data.nnw_sport, 100)}`);
      lines.push(`Zawód: ${safeString(data.nnw_zawod, 200)}`);
      lines.push(
        `Suma ubezpieczenia: ${safeString(data.nnw_suma, 50)}`
      );
      lines.push(
        `Sport zawodowy: ${safeString(data.nnw_sport_zawodowy, 100)}`
      );
      lines.push(`Uwagi: ${safeString(data.nnw_uwagi, 800)}`);
      lines.push("");
    }

    lines.push("--- Dodatkowe informacje ---");
    lines.push(additionalInfo || "(brak)");

    await resend.emails.send({
      from,
      to,
      subject: `APK / Wycena: ${selectedInsurance} – ${name}`,
      text: lines.join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: safeString(
          err?.message || "Błąd serwera podczas wysyłki formularza APK.",
          300
        ),
      },
      { status: 500 }
    );
  }
}
