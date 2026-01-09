import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export const metadata = {
  title: "Towarzystwa Ubezpieczeniowe | UW - Ubezpieczenia Wawer",
  description: "Współpracujemy z wiodącymi towarzystwami ubezpieczeniowymi w Polsce.",
}

export default function TowarzystwaPage() {
  const companies = [
    "PZU",
    "Allianz",
    "Generali",
    "Ergo Hestia",
    "Warta",
    "Compensa",
    "Uniqa",
    "Link4",
    "InterRisk",
    "AXA",
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-500 to-sky-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Towarzystwa Ubezpieczeniowe</h1>
            <p className="text-xl text-sky-100 text-pretty">
              Współpracujemy z najlepszymi towarzystwami ubezpieczeniowymi w Polsce
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
              Jako niezależny agent ubezpieczeniowy współpracuję z wieloma wiodącymi towarzystwami ubezpieczeniowymi.
              Dzięki temu mogę zaproponować Ci najlepsze rozwiązania i ceny dostosowane do Twoich potrzeb.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card key={company} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
                    <Shield className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">{company}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-12 bg-gradient-to-br from-sky-50 to-orange-50 border-2">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Szukasz najlepszej oferty?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Skontaktuj się ze mną, a porównam oferty wszystkich towarzystw i znajdę najlepszą dla Ciebie!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
