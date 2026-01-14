import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Home, Heart, Plane, Briefcase, Car, Phone, Mail, MapPin, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500 text-white overflow-hidden">
        {/* Modern geometric background pattern */}
        <div className="absolute inset-0 opacity-30">
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-300/40 via-transparent to-transparent" />

          {/* Animated geometric shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl animate-bounce" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Contract signing animation */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-64 h-80">
            {/* Animated contract document */}
            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl p-6 animate-fade-in">
              {/* Document lines */}
              <div className="space-y-3 mb-8">
                <div className="h-2 bg-gray-200 rounded animate-fade-in delay-200" />
                <div className="h-2 bg-gray-200 rounded w-5/6 animate-fade-in delay-300" />
                <div className="h-2 bg-gray-200 rounded animate-fade-in delay-400" />
                <div className="h-2 bg-gray-200 rounded w-4/6 animate-fade-in delay-500" />
                <div className="h-2 bg-gray-200 rounded animate-fade-in delay-600" />
              </div>

              {/* Signature line */}
              <div className="mt-16 border-b-2 border-gray-300 relative">
                {/* Animated signature */}
                <svg
                  className="absolute -top-8 left-4 w-32 h-12 animate-draw-signature"
                  viewBox="0 0 120 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 10 30 Q 30 10, 50 25 T 90 20"
                    stroke="#1e40af"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="signature-path"
                  />
                </svg>
                <p className="text-xs text-gray-500 mt-2 text-center animate-fade-in delay-1000">Podpis Klienta</p>
              </div>

              {/* Success checkmark */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in delay-1500">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Floating shield icon */}
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-xl animate-float">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto lg:max-w-2xl text-center space-y-6">
            <div className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold animate-fade-in">
              Lokalny agent ubezpieczeniowy w Wawrze
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance animate-fade-in delay-200">
              Kompleksowa ochrona dla Ciebie i Twojej rodziny
            </h1>
            <p className="text-xl text-sky-100 text-pretty animate-fade-in delay-400">
              Kilkuletnie doświadczenie w branży ubezpieczeniowej.
            </p>
            <p className="text-xl text-sky-100 text-pretty animate-fade-in delay-400">
              Pomagam znaleźć najlepsze rozwiązania dopasowane do Twoich potrzeb.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-600">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Link href="/apk">Bezpłatna wycena</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                <Link href="/kontakt">Skontaktuj się</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Moje usługi ubezpieczeniowe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Oferuję pełen zakres ubezpieczeń dostosowanych do potrzeb indywidualnych i firmowych
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon={<Car className="h-12 w-12" />}
              title="Ubezpieczenia komunikacyjne"
              description="OC, AC, NNW, assistance. Najlepsze oferty od wiodących towarzystw ubezpieczeniowych."
              href="/ubezpieczenia/komunikacyjne"
            />
            <ServiceCard
              icon={<Home className="h-12 w-12" />}
              title="Ubezpieczenia mieszkaniowe"
              description="Ochrona domu, mieszkania i odpowiedzialności cywilnej w życiu prywatnym."
              href="/ubezpieczenia/mieszkaniowe"
            />
            <ServiceCard
              icon={<Heart className="h-12 w-12" />}
              title="Ubezpieczenia zdrowotne"
              description="Prywatna opieka medyczna dla Ciebie i Twojej rodziny."
              href="/ubezpieczenia/zdrowotne"
            />
            <ServiceCard
              icon={<Shield className="h-12 w-12" />}
              title="Ubezpieczenia na życie"
              description="Bezpieczeństwo finansowe dla najbliższych na przyszłość."
              href="/ubezpieczenia/zyciowe"
            />
            <ServiceCard
              icon={<Plane className="h-12 w-12" />}
              title="Ubezpieczenia turystyczne"
              description="Pełna ochrona podczas podróży krajowych i zagranicznych."
              href="/ubezpieczenia/turystyczne"
            />
            <ServiceCard
              icon={<Briefcase className="h-12 w-12" />}
              title="Ubezpieczenia firmowe"
              description="Kompleksowa ochrona dla przedsiębiorstw i działalności gospodarczej."
              href="/ubezpieczenia/firmowe"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Dlaczego warto mnie wybrać?</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Profesjonalne doradztwo i obsługa na najwyższym poziomie
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-orange-500" />}
              title="Kilkuletnie doświadczenie"
              description="Praktyczne doświadczenie w branży ubezpieczeniowej"
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-orange-500" />}
              title="Indywidualne podejście"
              description="Każdy klient otrzymuje spersonalizowaną ofertę"
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-orange-500" />}
              title="Obsługa lokalna i on-line"
              description="Spotkania w Wawrze lub wygodnie przez Internet"
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-orange-500" />}
              title="Kompleksowe wsparcie"
              description="Pomoc przy wypełnianiu wniosków i likwidacji szkód"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}

      {/* How it works + objections */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">Jak wygląda współpraca</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Nie każę Ci „wypełnić epopei”. Zbieram minimum danych, dopytuję tylko o to, co realnie wpływa na składkę i zakres,
              a potem pokazuję 2–3 sensowne warianty wraz z różnicami.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border bg-background p-6">
              <p className="text-sm text-muted-foreground mb-2">Krok 1</p>
              <h3 className="text-xl font-bold mb-2">Szybkie rozpoznanie</h3>
              <p className="text-muted-foreground">
                Kontakt telefoniczny lub e-mail. Ustalamy czego potrzebujesz i co jest „must-have”, a co można odpuścić.
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-6">
              <p className="text-sm text-muted-foreground mb-2">Krok 2</p>
              <h3 className="text-xl font-bold mb-2">Porównanie wariantów</h3>
              <p className="text-muted-foreground">
                Dostajesz konkret: zakres, wyłączenia, udziały własne, limity. Bez marketingowego watowania.
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-6">
              <p className="text-sm text-muted-foreground mb-2">Krok 3</p>
              <h3 className="text-xl font-bold mb-2">Zakup i obsługa</h3>
              <p className="text-muted-foreground">
                Formalności załatwiamy sprawnie. W razie szkody dostajesz instrukcję krok po kroku.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-12 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-background p-6">
              <h3 className="text-xl font-bold mb-3">Najczęstsze obawy i odpowiedzi</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">„Czy to nie będzie drożej przez agenta?”</span> – w praktyce płacisz składkę jak w towarzystwie, a zyskujesz porównanie i opiekę.
                </li>
                <li>
                  <span className="font-medium text-foreground">„Nie wiem, co wybrać.”</span> – dlatego pokazuję różnice wariantów i rekomendację pod Twoje priorytety.
                </li>
                <li>
                  <span className="font-medium text-foreground">„Ile danych muszę podać?”</span> – minimum potrzebne do sensownej wyceny. Resztę doprecyzujemy później.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-background p-6">
              <h3 className="text-xl font-bold mb-3">Co zrobić teraz</h3>
              <p className="text-muted-foreground mb-5">
                Wybierz ścieżkę. Jeśli nie jesteś pewien – wejdź w wycenę i opisz temat jednym zdaniem.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <a href="/wycena">Poproś o wycenę</a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href="/kontakt">Zadaj pytanie</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Opinie moich klientów</h2>
            <p className="text-xl text-muted-foreground text-pretty">Zaufało mi już setki zadowolonych klientów</p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll-testimonials hover:pause-animation pb-4">
              {/* Real reviews from Oferteo */}
              <TestimonialCard
                name="Paweł W."
                rating={5}
                text="Współpraca z firmą bardzo udana. Kontakt z Panem Mateuszem bezproblemowy. Wszystkie wątpliwości wyjaśnione, a formalności sprawnie załatwione. Dzięki!"
              />
              <TestimonialCard
                name="Michał B."
                rating={5}
                text="Wykupiłem dwie polisy u Pana Mateusza. Wspólnie wybraliśmy produkty, które najlepiej spełniały moje oczekiwania."
              />
              <TestimonialCard
                name="Magdalena B."
                rating={5}
                text="Bardzo rzetelny agent. Dopasował ofertę do moich potrzeb."
              />
              {/* Duplicate reviews for continuous scroll effect */}
              <TestimonialCard
                name="Paweł W."
                rating={5}
                text="Współpraca z firmą bardzo udana. Kontakt z Panem Mateuszem bezproblemowy. Wszystkie wątpliwości wyjaśnione, a formalności sprawnie załatwione. Dzięki!"
              />
              <TestimonialCard
                name="Michał B."
                rating={5}
                text="Wykupiłem dwie polisy u Pana Mateusza. Wspólnie wybraliśmy produkty, które najlepiej spełniały moje oczekiwania."
              />
              <TestimonialCard
                name="Magdalena B."
                rating={5}
                text="Bardzo rzetelny agent. Dopasował ofertę do moich potrzeb."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-sky-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">Gotowy na pełną ochronę?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty">
            Skontaktuj się ze mną już dziś i otrzymaj bezpłatną wycenę dopasowaną do Twoich potrzeb
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link href="/apk">Otrzymaj bezpłatną wycenę</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-sky-700 hover:bg-sky-50">
              <Link href="/kontakt">Zadzwoń</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">Telefon</p>
                <p className="text-muted-foreground">+48 500 387 340</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">Email</p>
                <p className="text-muted-foreground">wawerpolisy@gmail.com</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">Adres</p>
                <p className="text-muted-foreground">Warszawa Wawer, ul. Rusinowska 7, 04-944 Warszawa</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  href,
}: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent">
        <CardContent className="p-6 space-y-4">
          <div className="text-primary">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-pretty">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, rating, text }: { name: string; rating: number; text: string }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-muted-foreground italic text-pretty">{text}</p>
        <p className="font-semibold">{name}</p>
      </CardContent>
    </Card>
  )
}