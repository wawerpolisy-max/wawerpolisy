import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteForm } from "@/components/forms/quote-form"
import { Shield, Clock, CheckCircle2 } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Wycena ubezpieczenia",
  description:
    "Poproś o wycenę: OC/AC, mieszkanie, życie, zdrowie, podróże, firma. Minimum danych na start, konkretne warianty i jasne różnice.",
}

function QuoteFormShell() {
  return (
    <CardContent>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Ładowanie formularza…</div>}>
        <QuoteForm />
      </Suspense>
    </CardContent>
  )
}

export default function WycenaPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-500 to-sky-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Wycena ubezpieczenia</h1>
            <p className="text-xl text-sky-100 text-pretty">
              Ładny landing nic nie znaczy, jeśli nie dowozi decyzji. Tu masz prostą ścieżkę: podajesz minimum informacji,
              ja przygotowuję 2–3 warianty i wyjaśniam różnice.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Bez lania wody
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Dostajesz konkret: zakres, wyłączenia, limity i co realnie zmienia składkę.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Szybko
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Jeśli podasz telefon lub e-mail – wracam z pytaniami doprecyzowującymi i wariantami.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  Minimum barier
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Nie ma tu „muru” w postaci 20 pól. Na start wystarczy krótkie zgłoszenie.
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Formularz wyceny</CardTitle>
                <p className="text-muted-foreground">
                  Podaj telefon lub e-mail. Jeśli nie masz teraz danych – opisz temat jednym zdaniem.
                </p>
              </CardHeader>

              <QuoteFormShell />
            </Card>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Najczęstsze pytania przed wyceną</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>„Czy agent dolicza marżę?” – zwykle nie; liczy się składka i warunki.</li>
                    <li>„Czemu dwie polisy mają tę samą cenę, a inną ochronę?” – różnią się limitami i wyłączeniami.</li>
                    <li>„Co jest ważniejsze: cena czy zakres?” – zależy od Twojego ryzyka. Ustalimy priorytety.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Co przyspiesza proces</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Numer obecnej polisy / termin końca (jeśli to przedłużenie).</li>
                    <li>Dla auta: rok, marka/model, historia szkód.</li>
                    <li>Dla mieszkania: metraż, lokalizacja, wartość mienia.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
