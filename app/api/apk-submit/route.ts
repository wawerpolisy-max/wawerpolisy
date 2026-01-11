import { NextResponse } from "next/server";
import { Resend } from "resend";

function safeString(v: unknown, max = 500) {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));

    const name = safeString(data?.name, 120);
    const phone = safeString(data?.phone, 40);
    const email = safeString(data?.email, 160);

    // akceptuj różne nazwy pola, żeby formularz się nie wywalał po zmianach
    const selectedInsurance = safeString(
      data?.selectedInsurance ?? data?.insuranceType ?? data?.rodzajUbezpieczenia,
      60
    );

    const details = safeString(data?.details ?? data?.additionalInfo, 2000);
    const consent = Boolean(data?.consent);

    if (!name || !phone || !consent) {
      return NextResponse.json(
        { ok: false, error: "Uzupełnij wymagane pola (imię i nazwisko, telefon) i zaznacz zgodę RODO." },
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
        { ok: false, error: "Brak konfiguracji wysyłki e-mail (RESEND_API_KEY)." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const to = process.env.APK_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "wawerpolisy@gmail.com";

    await resend.emails.send({
      from: "WawerPolisy <onboarding@resend.dev>",
      to,
      subject: `APK / Wycena: ${selectedInsurance} – ${name}`,
      text: [
        `Imię i nazwisko: ${name}`,
        `Telefon: ${phone}`,
        email ? `E-mail: ${email}` : "",
        `Rodzaj ubezpieczenia: ${selectedInsurance}`,
        "",
        "Szczegóły:",
        details || "(brak)",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: safeString(err?.message || "Błąd serwera podczas wysyłki.", 300) },
      { status: 500 }
    );
  }
}
