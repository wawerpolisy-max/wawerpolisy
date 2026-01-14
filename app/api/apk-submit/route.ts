import { NextResponse } from "next/server";
import { Resend } from "resend";

function safe(v: any, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));

    const name = safe(data.fullName, 140);
    const phone = safe(data.phone, 40);
    const email = safe(data.email, 140);

    // alias selectedInsurance ← insuranceType
    const selectedInsurance = safe(
      data.selectedInsurance ?? data.insuranceType ?? "",
      80
    );

    const details = safe(
      data.additionalInfo ??
      data.details ??
      "",
      2000
    );

    // zgoda = true jeśli oba zaznaczone
    const consent = Boolean(data.zgodaPrzetwarzanie || data.zgodaKlauzula);

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Uzupełnij wymagane dane: imię i nazwisko, telefon." },
        { status: 400 }
      );
    }

    if (!selectedInsurance) {
      return NextResponse.json(
        { ok: false, error: "Wybierz rodzaj ubezpieczenia." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Zaznacz wymagane zgody RODO." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Brak RESEND_API_KEY w konfiguracji." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const to =
      process.env.APK_TO_EMAIL ??
      process.env.CONTACT_TO ??
      "wawerpolisy@gmail.com";

    await resend.emails.send({
      from: process.env.APK_FROM_EMAIL ?? "WawerPolisy <onboarding@resend.dev>",
      to,
      subject: `APK – ${selectedInsurance} – ${name}`,
      text: [
        `Imię i nazwisko: ${name}`,
        `Telefon: ${phone}`,
        email ? `E-mail: ${email}` : null,
        `Rodzaj ubezpieczenia: ${selectedInsurance}`,
        "",
        "Dodatkowe informacje:",
        details || "(brak)",
        "",
        "Zgody RODO: TAK"
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
