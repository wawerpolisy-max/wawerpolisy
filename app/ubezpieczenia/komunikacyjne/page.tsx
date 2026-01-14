import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Shield, Car, Wrench, Phone } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia Komunikacyjne OC/AC | wawerpolisy.pl",
  description: "Ubezpieczenia komunikacyjne OC i AC. Porównamy oferty i znajdziemy najlepszą dla Twojego pojazdu.",
}

export default function KomunikacyjnePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia komunikacyjne
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Ubezpieczenie OC, AC i NNW dla Twojego Pojazdu
            </h1>
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Porównamy oferty od wiodących towarzystw ubezpieczeniowych i znajdziemy najlepsze rozwiązanie dostosowane
              do Twoich potrzeb i budżetu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Skontaktuj się
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Co oferuję?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>OC - Obowiązkowe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Obowiązkowe ubezpieczenie odpowiedzialności cywilnej posiadaczy pojazdów mechanicznych.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ochrona do 5 mln EUR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Wypłata odszkodowań dla poszkodowanych</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Porównanie ofert od wielu ubezpieczycieli</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>AC - Autocasco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Dobrowolne ubezpieczenie pojazdu od kradzieży, uszkodzeń i zdarzeń losowych.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ochrona przed kradzieżą</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Uszkodzenia w wypadku</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Zdarzenia losowe (grad, pożar)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Assistance i NNW</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Dodatkowe ubezpieczenia zapewniające pełne bezpieczeństwo na drodze.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Pomoc drogowa 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Auto zastępcze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ochrona kierowcy i pasażerów</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dlaczego warto ubezpieczyć się z nami?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Najlepsze ceny", desc: "Porównujemy oferty od kilkunastu ubezpieczycieli" },
              { title: "Szybka realizacja", desc: "Polisa gotowa nawet w 15 min." },
              { title: "Pomoc przy szkodach", desc: "Wsparcie w procesie likwidacji" },
              { title: "Elastyczne raty", desc: "Możliwość płatności ratalnej" },
            ].map((item, i) => (
              <div key={i} className="bg-background p-6 rounded-lg border">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Phone className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Potrzebujesz pomocy?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">
            Zadzwoń do nas lub wypełnij formularz wyceny - odpowiemy w ciągu 24 godzin
          </p>
          <Link href="/apk?typ=komunikacyjne">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Otrzymaj bezpłatną wycenę
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
