import { NextResponse } from "next/server";
import { Resend } from "resend";

function safeString(v: unknown, max = 500) {
  return String(v ?? "").trim().slice(0, max);
}

function isLikelyEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));

    const name = safeString(data?.name, 120);
    const phone = safeString(data?.phone, 40);
    const email = safeString(data?.email, 160);
    const topic = safeString(data?.topic, 80);
    const message = safeString(data?.message, 4000);
    const consent = Boolean(data?.consent);

    if (!name || !message || !consent) {
      return NextResponse.json(
        { ok: false, error: "Uzupełnij wymagane pola i zaznacz zgodę RODO." },
        { status: 400 }
      );
    }

    if (!phone && !email) {
      return NextResponse.json(
        { ok: false, error: "Podaj telefon lub e-mail (wystarczy jedno)." },
        { status: 400 }
      );
    }

    if (email && !isLikelyEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "E-mail wygląda na niepoprawny." },
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

    const to = process.env.CONTACT_TO_EMAIL || "wawerpolisy@gmail.com";

    await resend.emails.send({
      from: "WawerPolisy <onboarding@resend.dev>",
      to,
      subject: `Kontakt (${topic || "zapytanie"}) – ${name}`,
      text: [
        `Imię i nazwisko: ${name}`,
        phone ? `Telefon: ${phone}` : "",
        email ? `E-mail: ${email}` : "",
        topic ? `Temat: ${topic}` : "",
        "",
        "Wiadomość:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // To się pokaże w UI zamiast “Failed to send”
    return NextResponse.json(
      { ok: false, error: safeString(err?.message || "Błąd serwera podczas wysyłki.", 300) },
      { status: 500 }
    );
  }
}
