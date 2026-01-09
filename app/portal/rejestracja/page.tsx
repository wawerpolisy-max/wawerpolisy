import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Rejestracja - Portal Klienta | wawerpolisy.pl",
  description: "Załóż konto w portalu klienta",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
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
          <h1 className="text-2xl font-bold mb-2">Utwórz Konto</h1>
          <p className="text-muted-foreground">Zarejestruj się w portalu klienta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rejestracja</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Masz już konto?{" "}
                <Link href="/portal/login" className="text-blue-600 hover:underline font-medium">
                  Zaloguj się
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
