import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import Link from "next/link"

export const metadata = {
  title: "Panel Administracyjny - Logowanie | UW",
  description: "Logowanie do panelu administracyjnego",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-bold">
              <span className="text-blue-400">U</span>
              <span className="text-orange-400">W</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Panel Administracyjny</h1>
          <p className="text-slate-400">Zaloguj się aby kontynuować</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Logowanie Administratora</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white">
            Wróć do strony głównej
          </Link>
        </p>
      </div>
    </div>
  )
}
