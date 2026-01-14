import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const ContactSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    topic: z.string().trim().max(80).optional().or(z.literal("")),
    message: z.string().trim().min(10).max(4000),
    consent: z.boolean(),
    website: z.string().trim().max(200).optional().or(z.literal("")), // honeypot
  })
  .refine((d) => (d.phone && d.phone.length >= 7) || (d.email && d.email.includes("@")), {
    message: "Podaj telefon lub e-mail (wystarczy jedno).",
    path: ["phone"],
  })
  .refine((d) => d.consent === true, {
    message: "Zaznacz zgodę na przetwarzanie danych (RODO).",
    path: ["consent"],
  });

function safeError(msg: unknown, max = 250) {
  return String(msg ?? "").slice(0, max);
}

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}));

    // honeypot – jeśli bot wypełni ukryte pole, udajemy sukces i nie wysyłamy maila
    if (typeof raw?.website === "string" && raw.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues?.[0]?.message || "Uzupełnij wymagane pola.";
      return NextResponse.json({ ok: false, error: first }, { status: 400 });
    }

    const { fullName, phone, email, topic, message } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Brak konfiguracji wysyłki e-mail (RESEND_API_KEY)." },
        { status: 500 }
      );
    }

    // Obsłuż 2 nazwy env (żebyś nie musiał trafiać idealnie):
    const to =
      process.env.CONTACT_TO ||
      process.env.CONTACT_TO_EMAIL ||
      process.env.CONTACT_EMAIL_TO ||
      "wawerpolisy@gmail.com";

    // Z Resend: najlepiej verified sender lub domena; na start może być onboarding@resend.dev
    const from =
      process.env.CONTACT_FROM ||
      process.env.CONTACT_FROM_EMAIL ||
      "WawerPolisy <onboarding@resend.dev>";

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to,
      subject: `Kontakt (${topic || "zapytanie"}) – ${fullName}`,
      text: [
        `Imię i nazwisko: ${fullName}`,
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
    return NextResponse.json(
      { ok: false, error: safeError(err?.message || "Błąd serwera podczas wysyłki.") },
      { status: 500 }
    );
  }
}
