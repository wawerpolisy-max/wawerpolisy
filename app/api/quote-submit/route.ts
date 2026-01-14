import { NextResponse } from "next/server";
import { Resend } from "resend";

function safeString(v: unknown, max = 4000) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const fullName = safeString(data?.fullName, 120);
    const phone = safeString(data?.phone, 50);
    const email = safeString(data?.email, 120);

    // alias - jeżeli front wysyła selectedInsurance zamiast insuranceType
    const insuranceType = safeString(
      data?.insuranceType ?? data?.selectedInsurance,
      80
    );

    const message = safeString(data?.message, 4000);
    const consent = Boolean(data?.consent);

    if (!fullName)
      return NextResponse.json(
        { error: "Missing fullName" },
        { status: 400 }
      );
    if (!phone)
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    if (!insuranceType)
      return NextResponse.json(
        { error: "Missing insuranceType" },
        { status: 400 }
      );
    if (!consent)
      return NextResponse.json(
        { error: "Consent required" },
        { status: 400 }
      );

    // ENV — korzystamy z tych samych co kontakt
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail =
      process.env.QUOTE_TO_EMAIL ||
      process.env.CONTACT_TO ||
      process.env.TO_EMAIL;
    const fromEmail =
      process.env.QUOTE_FROM_EMAIL ||
      process.env.CONTACT_FROM ||
      process.env.FROM_EMAIL ||
      "onboarding@resend.dev";

    if (!resendKey)
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    if (!toEmail)
      return NextResponse.json(
        { error: "Missing QUOTE_TO_EMAIL/CONTACT_TO/TO_EMAIL" },
        { status: 500 }
      );

    const resend = new Resend(resendKey);

    const subject = `Nowa wycena: ${insuranceType} — ${fullName}`;

    const text = [
      "Nowe zgłoszenie wyceny:",
      "",
      `Imię i nazwisko: ${fullName}`,
      `Telefon: ${phone}`,
      email ? `E-mail: ${email}` : "E-mail: (brak)",
      `Rodzaj ubezpieczenia: ${insuranceType}`,
      "",
      "Dodatkowe informacje:",
      message || "(brak)",
      "",
      "Zgoda: TAK",
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("QUOTE API ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
