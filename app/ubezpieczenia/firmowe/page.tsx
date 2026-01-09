import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Briefcase, Building, Users, Shield } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia Firmowe | wawerpolisy.pl",
  description: "Kompleksowa ochrona dla przedsiębiorstw. Ubezpieczenia dla firm, pracowników i majątku.",
}

export default function FirmowePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia firmowe
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Kompleksowa ochrona dla Twojego biznesu
            </h1>
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Zabezpiecz swoją firmę, pracowników i majątek. Oferujemy pełen pakiet ubezpieczeń dla przedsiębiorców.
            </p>
            <Link href="/kontakt">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Skontaktuj się
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Oferta dla firm</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Building className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                <CardTitle className="text-lg">Majątek firmy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-3 text-pretty">Nieruchomości, wyposażenie, towary</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Budynki i lokale</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Maszyny i urządzenia</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Zapasy magazynowe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-orange-600 mb-4 mx-auto" />
                <CardTitle className="text-lg">OC działalności</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-3 text-pretty">Odpowiedzialność cywilna w biznesie</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>OC ogólna</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>OC produktu</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>OC zawodowa</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-4 mx-auto" />
                <CardTitle className="text-lg">Pracownicy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-3 text-pretty">Ochrona zdrowia i życia załogi</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Grupowe na życie</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Opieka medyczna</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ubezpieczenie NNW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                <CardTitle className="text-lg">Flota</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-3 text-pretty">Ubezpieczenia komunikacyjne dla firm</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>OC/AC floty</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Assistance 24/7</span>
                  </li>
                  <li className="flex gap-2 justify-center">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Auta zastępcze</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Dlaczego warto ubezpieczyć firmę?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Ochrona majątku", desc: "Zabezpieczenie przed stratami finansowymi w razie szkody" },
              { title: "Ciągłość działania", desc: "Szybka pomoc i wypłata odszkodowania" },
              { title: "Spokój przedsiębiorcy", desc: "Możesz skupić się na rozwoju biznesu" },
              { title: "Atrakcyjny benefit", desc: "Opieka medyczna dla pracowników" },
              { title: "Koszty uzyskania", desc: "Składki stanowią koszt podatkowy" },
              { title: "Indywidualne podejście", desc: "Dopasujemy ochronę do branży i wielkości firmy" },
            ].map((item, i) => (
              <div key={i} className="bg-background p-6 rounded-lg border">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Zabezpiecz swoją firmę</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">
            Umów się na bezpłatną konsultację - przygotujemy dedykowaną ofertę
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Umów konsultację
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
