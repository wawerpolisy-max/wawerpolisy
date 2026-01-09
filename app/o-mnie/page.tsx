import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Award, Users, Heart, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "O mnie | UW - Ubezpieczenia Wawer",
  description: "Poznaj swojego agenta ubezpieczeniowego. Doświadczenie, profesjonalizm i indywidualne podejście.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-500 to-sky-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">O mnie</h1>
            <p className="text-xl text-sky-100 text-pretty">
              Poznaj swojego lokalnego agenta ubezpieczeniowego w Wawrze
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Agent ubezpieczeniowy z pasją</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Witam serdecznie! Jestem doradcą ubezpieczeniowym z 4-letnim doświadczeniem. Pracuję dla klientów
                  indywidualnych i firm na terenie województw lubelskiego i mazowieckiego. Współpracuję z wiodącymi
                  towarzystwami ubezpieczeniowymi, dzięki czemu przedstawiam przejrzyste, dopasowane do potrzeb
                  rozwiązania.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong>Działam również online</strong> - jeśli wolisz wygodę rozmowy przez telefon lub spotkania
                  online, chętnie Ci to umożliwię. Nie musisz przyjeżdżać osobiście - możemy wszystko załatwić zdalnie!
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cenię sobie bezpośredni kontakt z klientem i indywidualne podejście do każdej sprawy. Oferuję pełne
                  wsparcie nie tylko przy wyborze polisy, ale również podczas likwidacji szkód.
                </p>
              </div>
              <div className="relative h-96 bg-gradient-to-br from-sky-200 to-orange-200 rounded-lg overflow-hidden">
                <Image
                  src="https://static.oferteo.pl/images/portfolio/5951026/256px_s/1767292620864-1767292618363_avatar.jpg"
                  alt="Mateusz Pawelec - Agent Ubezpieczeniowy"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Award className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold">Doświadczenie</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    4 lata praktyki w branży ubezpieczeniowej. Zadowoleni klienci i pomyślnie zrealizowane polisy
                    ubezpieczeniowe.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Shield className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold">Profesjonalizm</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Licencjonowany agent ubezpieczeniowy z certyfikatami wiodących towarzystw. Stałe podnoszenie
                    kwalifikacji i śledzenie nowości rynkowych.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold">Lokalność i elastyczność</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Jestem Twoim sąsiadem z Wawra, ale obsługuję klientów również online. Dzięki temu możemy spotkać się
                    osobiście lub załatwić wszystko zdalnie - jak Ci wygodniej.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Heart className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold">Indywidualne podejście</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Każdy klient jest dla mnie wyjątkowy. Dokładnie analizuję potrzeby i proponuję rozwiązania idealnie
                    dopasowane do sytuacji życiowej i finansowej.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-sky-50 to-orange-50 border-2">
              <CardContent className="p-8 text-center space-y-6">
                <h2 className="text-3xl font-bold">Skontaktuj się ze mną</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Chętnie odpowiem na wszystkie Twoje pytania i pomogę wybrać najlepsze ubezpieczenie. Zapraszam do
                  kontaktu!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-semibold">+48 500 387 340</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold">wawerpolisy@gmail.com</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/kontakt">
                    <Button size="lg" className="bg-accent hover:bg-accent/90">
                      Formularz kontaktowy
                    </Button>
                  </Link>
                  <Link href="/apk">
                    <Button size="lg" variant="outline">
                      Bezpłatna wycena
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
