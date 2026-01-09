import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteForm } from "@/components/forms/quote-form"
import { Shield, Clock, CheckCircle2 } from "lucide-react"
import { Suspense } from "react"

export const metadata = {
  title: "Wycena ubezpieczenia",
  description:
    "Poproś o wycenę: OC/AC, mieszkanie, życie, zdrowie, podróże, firma. Minimum danych na start, konkretne warianty i jasne różnice.",
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
