import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import Image from "next/image"
import { Shield, FileText, Bell, Lock } from "lucide-react"

export const metadata = {
  title: "Logowanie - Portal Klienta | wawerpolisy.pl",
  description: "Zaloguj się do portalu klienta wawerpolisy.pl",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/logo-wawerpolisy.png"
              alt="wawerpolisy.pl"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
          <h1 className="text-3xl font-bold mb-2">Twój Osobisty Panel Ubezpieczeń</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zarządzaj wszystkimi polisami w jednym miejscu z pełnym bezpieczeństwem i wygodą
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Login Card - Left Side */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Zaloguj się do panelu</CardTitle>
              </CardHeader>
              <CardContent>
                <LoginForm />
                <div className="mt-6 text-center text-sm">
                  <p className="text-muted-foreground">
                    Nie masz konta?{" "}
                    <Link href="/portal/rejestracja" className="text-primary hover:underline font-medium">
                      Utwórz bezpłatny panel
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/kontakt" className="hover:text-primary transition-colors">
                Potrzebujesz pomocy z logowaniem?
              </Link>
            </p>
          </div>

          {/* Benefits Cards - Right Side */}
          <div className="order-1 lg:order-2 space-y-4">
            <Card className="bg-white/80 backdrop-blur border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Wszystkie polisy w jednym miejscu</h3>
                    <p className="text-sm text-muted-foreground">
                      Uporządkowane dokumenty, łatwy dostęp do polis komunikacyjnych, mieszkaniowych, zdrowotnych i
                      wszystkich innych - bez papierowej biurokracji.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/20 p-3 rounded-lg flex-shrink-0">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Inteligentne przypomnienia</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatyczne powiadomienia o zbliżających się terminach odnowienia polis i ważnych datach - nigdy
                      nie przegapisz przedłużenia ochrony.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">100% bezpieczeństwo i prywatność</h3>
                    <p className="text-sm text-muted-foreground">
                      Twoje dane są chronione najwyższymi standardami bezpieczeństwa. Tylko Ty masz dostęp do swoich
                      dokumentów - gwarantujemy pełną poufność.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Dostęp 24/7 z każdego urządzenia</h3>
                    <p className="text-sm text-muted-foreground">
                      Przeglądaj polisy, pobieraj dokumenty i zarządzaj ubezpieczeniami kiedy chcesz - z komputera,
                      telefonu czy tabletu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
