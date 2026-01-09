import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Home, Shield, Flame, Droplet } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Ubezpieczenia Mieszkaniowe | UW",
  description: "Kompleksowe ubezpieczenie domu, mieszkania i odpowiedzialności cywilnej w życiu prywatnym.",
}

export default function MieszkaniePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Ubezpieczenia mieszkaniowe
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Ochrona twojego domu i mieszkania</h1>
            {/* </CHANGE> */}
            <p className="text-xl text-blue-100 mb-8 text-pretty">
              Kompleksowa ochrona Twojej nieruchomości oraz odpowiedzialności cywilnej w życiu prywatnym.
            </p>
            <Link href="/apk?typ=mieszkaniowe">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Oblicz składkę
              </Button>
              {/* </CHANGE> */}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Zakres ochrony</h2>
          {/* </CHANGE> */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Home className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle className="text-lg">Budynek/Lokal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-pretty">Ochrona konstrukcji i wyposażenia stałego</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle className="text-lg">Ruchomości</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-pretty">Ubezpieczenie mebli, sprzętu AGD/RTV</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Flame className="h-10 w-10 text-orange-600 mb-4" />
                <CardTitle className="text-lg">OC w życiu prywatnym</CardTitle>
                {/* </CHANGE> */}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-pretty">
                  Odpowiedzialność za szkody wyrządzone osobom trzecim
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Droplet className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle className="text-lg">Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-pretty">Pomoc w nagłych wypadkach 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Co jest ubezpieczone?</h2>
          {/* </CHANGE> */}
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-6">Zdarzenia losowe</h3>
              {/* </CHANGE> */}
              <ul className="space-y-3">
                {[
                  "Pożar i uderzenie pioruna",
                  "Zalanie wodą",
                  "Kradzież z włamaniem",
                  "Wandalizm",
                  "Huragan i grad",
                  "Trzęsienie ziemi",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Dodatkowe opcje</h3>
              {/* </CHANGE> */}
              <ul className="space-y-3">
                {[
                  "Szkody w elektronice",
                  "Szyby i przedmioty szklane",
                  "Assistance domowy",
                  "Kradzież poza domem",
                  "Odpowiedzialność cywilna",
                  "Następstwa awarii",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Zabezpiecz swój dom</h2>
          {/* </CHANGE> */}
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">Uzyskaj wycenę dostosowaną do Twoich potrzeb</p>
          <Link href="/apk?typ=mieszkaniowe">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Bezpłatna wycena
            </Button>
            {/* </CHANGE> */}
          </Link>
        </div>
      </section>
    </div>
  )
}
