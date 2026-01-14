import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Walidacja minimalna
    if (!body.fullName || !body.message) {
      return NextResponse.json(
        { ok: false, error: "Brak podstawowych danych." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: process.env.QUOTE_FROM!,
      to: process.env.QUOTE_TO!,
      subject: `Nowa wycena od ${body.fullName}`,
      html: `
        <h2>Nowa prośba o wycenę</h2>
        <p><b>Imię i nazwisko:</b> ${body.fullName}</p>
        <p><b>Telefon:</b> ${body.phone || "-"}</p>
        <p><b>Email:</b> ${body.email || "-"}</p>
        <p><b>Wiadomość:</b><br/>${body.message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("QUOTE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Błąd serwera" },
      { status: 500 }
    );
  }
}
