import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Plane, MapPin, Heart, Shield } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia Turystyczne | UW",
  description: "Pełna ochrona podczas podróży krajowych i zagranicznych. Assistance, koszty leczenia, bagaż.",
}

export default function TurystycznePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia turystyczne
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Bezpieczne podróże po całym świecie</h1>
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Kompleksowa ochrona podczas wyjazdów krajowych i zagranicznych. Wyjedź ze spokojem!
            </p>
            <Link href="/apk?typ=turystyczne">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Oblicz składkę
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Zakres ochrony</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Heart />, title: "Koszty leczenia", desc: "Do 100 000 EUR" },
              { icon: <Plane />, title: "Assistance", desc: "Pomoc 24/7 na całym świecie" },
              { icon: <Shield />, title: "OC w życiu prywatnym", desc: "Ochrona do 50 000 EUR" },
              { icon: <MapPin />, title: "Bagaż i opóźnienia", desc: "Ochrona rzeczy i zwrot kosztów" },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-blue-600 flex justify-center mb-4">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Co jest ubezpieczone?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Podstawowy zakres</h3>
                <ul className="space-y-3">
                  {[
                    "Koszty leczenia i transportu",
                    "Następstwa nieszczęśliwych wypadków",
                    "Odpowiedzialność cywilna",
                    "Assistance",
                    "Bagaż podróżny",
                    "Opóźnienie lotu",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6">Dodatkowe opcje</h3>
                <ul className="space-y-3">
                  {[
                    "Sporty ekstremalne",
                    "Praca fizyczna za granicą",
                    "Polisa roczna multitrip",
                    "Rezygnacja z podróży",
                    "Sprzęt sportowy",
                    "Choroby przewlekłe",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Plane className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Planujesz wyjazd?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">Wykup polisę online w kilka minut!</p>
          <Link href="/apk?typ=turystyczne">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Kup polisę online
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
