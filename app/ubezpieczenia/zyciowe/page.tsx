import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Heart, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia na Życie | UW",
  description: "Bezpieczeństwo finansowe dla Twoich najbliższych. Ubezpieczenia na życie i inwestycyjne.",
}

export default function ZyciowePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia na życie
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Bezpieczeństwo finansowe dla najbliższych
            </h1>
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Zadbaj o przyszłość swojej rodziny. Oferujemy kompleksowe ubezpieczenia na życie i produkty inwestycyjne.
            </p>
            <Link href="/apk?typ=zyciowe">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Sprawdź ofertę
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Rodzaje ubezpieczeń</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Ochronne na życie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Wypłata świadczenia w razie śmierci ubezpieczonego
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Zabezpieczenie rodziny</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Niskie składki</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Elastyczny okres ochrony</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Inwestycyjne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">Ochrona połączona z inwestowaniem oszczędności</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Budowanie kapitału</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Elastyczne inwestycje</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Ulgi podatkowe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Zdrowotne i wypadkowe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Dodatkowa ochrona na wypadek choroby lub wypadku
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Ochrona zdrowia</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Wypłata przy chorobie</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Pomoc w razie wypadku</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Dlaczego warto?</h2>
          <div className="space-y-4">
            {[
              { title: "Spokój finansowy", desc: "Twoja rodzina będzie zabezpieczona finansowo w trudnych momentach" },
              {
                title: "Oszczędzanie na przyszłość",
                desc: "Produkty inwestycyjne pozwalają budować kapitał na emeryturę",
              },
              {
                title: "Ochrona kredytu",
                desc: "Zabezpieczenie spłaty kredytu hipotecznego w razie nieprzewidzianych zdarzeń",
              },
              { title: "Ulgi podatkowe", desc: "Możliwość odliczenia składek od podatku" },
            ].map((item, i) => (
              <div key={i} className="bg-background p-6 rounded-lg border">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-pretty">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Zadbaj o przyszłość swojej rodziny</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">
            Skontaktuj się z nami - doradzimy najlepsze rozwiązanie dopasowane do Twoich potrzeb
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Porozmawiajmy
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
