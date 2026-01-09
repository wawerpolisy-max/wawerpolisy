import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteForm } from "@/components/forms/quote-form"

export const metadata: Metadata = {
  title: "Wycena ubezpieczenia — WawerPolisy",
  description:
    "Szybka wycena ubezpieczenia w Warszawie (Wawer i okolice). Wypełnij krótki formularz — oddzwonię z ofertą.",
}

export default function WycenaPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Wycena ubezpieczenia
          </h1>
          <p className="mt-3 text-muted-foreground">
            Wypełnij krótki formularz. Jeśli czegoś nie wiesz — pomiń, dopytam.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formularz wyceny</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="text-sm text-muted-foreground">
                      Ładowanie formularza…
                    </div>
                  }
                >
                  <QuoteForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Jak to działa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>- Wypełniasz formularz (2–3 min).</p>
                <p>- Analizuję Twoją sytuację i porównuję warianty.</p>
                <p>- Oddzwaniam / odpisuję z propozycją.</p>
                <p className="pt-2 text-xs">
                  Nie spamuję. Dane wykorzystuję tylko do przygotowania wyceny.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
