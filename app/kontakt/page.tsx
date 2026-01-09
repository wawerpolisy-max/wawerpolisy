import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { ContactForm } from "@/components/forms/contact-form"

export const metadata = {
  title: "Kontakt – agent ubezpieczeniowy Wawer",
  description:
    "Kontakt z agentem ubezpieczeniowym w Wawrze (Warszawa): telefon, e-mail i formularz. Odpowiadam konkretnie i szybko.",
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-500 to-sky-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Kontakt</h1>
            <p className="text-xl text-sky-100 text-pretty">
              Masz pytanie, potrzebujesz wyceny albo chcesz przedłużyć polisę? Napisz lub zadzwoń. Jeśli nie wiesz co
              podać – opisz temat jednym zdaniem, dopytam o resztę.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Dane kontaktowe</h2>
                <p className="text-muted-foreground text-lg">
                  Wybierz najszybszy kanał. Telefon działa najlepiej w pilnych tematach, e-mail w sprawach „do
                  dopięcia”, a formularz gdy wolisz wszystko w jednym miejscu.
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Telefon</CardTitle>
                      <p className="text-muted-foreground">Najlepszy do szybkich tematów</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href="tel:+48500387340" className="text-primary font-semibold text-lg hover:underline">
                      +48 500 387 340
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>E-mail</CardTitle>
                      <p className="text-muted-foreground">Dobre do dosyłania danych</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:wawerpolisy@gmail.com" className="text-primary font-semibold hover:underline">
                      wawerpolisy@gmail.com
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Adres</CardTitle>
                      <p className="text-muted-foreground">Warszawa – Wawer</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">ul. Rusinowska 7</p>
                    <p className="text-muted-foreground">04-944 Warszawa</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Godziny</CardTitle>
                      <p className="text-muted-foreground">Kontakt i oddzwanianie</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">Pon–Pt: 9:00–18:00</p>
                    <p className="text-muted-foreground">Sobota: po umówieniu</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Co przyspiesza odpowiedź
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Rodzaj ubezpieczenia (OC/AC, mieszkanie, życie, podróże, firma).</li>
                    <li>Co jest priorytetem: cena, zakres, assistance, szybka likwidacja szkody.</li>
                    <li>Jeśli masz: numer obecnej polisy / termin końca / podstawowe parametry.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Napisz wiadomość</CardTitle>
                  <p className="text-muted-foreground">Wystarczy telefon lub e-mail. Resztę doprecyzuję.</p>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
