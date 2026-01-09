import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Heart, Stethoscope, Hospital, Pill } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia Zdrowotne | UW",
  description: "Prywatna opieka medyczna dla Ciebie i Twojej rodziny. Dostęp do najlepszych specjalistów.",
}

export default function ZdrowotnePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia zdrowotne
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Prywatna opieka medyczna dla Twojej rodziny
            </h1>
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Szybki dostęp do specjalistów, badań diagnostycznych i zabiegów. Zadbaj o zdrowie swoje i bliskich.
            </p>
            <Link href="/apk?typ=zdrowotne">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Sprawdź ofertę
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Co obejmuje ubezpieczenie?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Stethoscope className="h-10 w-10" />,
                title: "Wizyty u specjalistów",
                desc: "Bez skierowań i kolejek",
              },
              { icon: <Hospital className="h-10 w-10" />, title: "Badania diagnostyczne", desc: "USG, RTG, rezonans" },
              { icon: <Pill className="h-10 w-10" />, title: "Operacje i zabiegi", desc: "W prywatnych klinikach" },
              { icon: <Heart className="h-10 w-10" />, title: "Profilaktyka", desc: "Badania okresowe, szczepienia" },
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Korzyści z prywatnej opieki</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Brak kolejek do specjalistów",
              "Szybkie terminy wizyt i badań",
              "Najnowocześniejszy sprzęt medyczny",
              "Opieka w komfortowych warunkach",
              "Pakiety dla całej rodziny",
              "Teleporady 24/7",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-background p-4 rounded-lg border">
                <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Zadbaj o swoje zdrowie</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">
            Skontaktuj się z nami i dobierzemy najlepszy pakiet medyczny
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Umów rozmowę
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
