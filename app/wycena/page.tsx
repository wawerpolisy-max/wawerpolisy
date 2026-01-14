import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Wycena ubezpieczenia — WawerPolisy",
  description:
    "Szybka wycena ubezpieczenia w Warszawie (Wawer i okolice). Wypełnij krótki formularz — oddzwonię z ofertą.",
};

export default function WycenaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Wycena ubezpieczenia</h1>
      <p className="mt-2 text-muted-foreground">
        Wypełnij krótki formularz. Jeśli czegoś nie wiesz — pomiń, dopytam.
      </p>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Formularz wyceny</CardTitle>
          </CardHeader>
          <CardContent>
            {/* To jest klucz: QuoteForm używa useSearchParams(), więc MUSI być pod Suspense */}
            <Suspense fallback={<div className="text-sm text-muted-foreground">Ładowanie formularza…</div>}>
              <QuoteForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Jak to działa</h2>
        <ul className="mt-3 list-disc pl-5 text-muted-foreground">
          <li>Wypełniasz formularz (2–3 min).</li>
          <li>Analizuję Twoją sytuację i porównuję warianty.</li>
          <li>Oddzwaniam / odpisuję z propozycją.</li>
        </ul>

        <p className="mt-3 text-sm text-muted-foreground">
          Nie spamuję. Dane wykorzystuję tylko do przygotowania wyceny.
        </p>
      </div>
    </div>
  );
}
