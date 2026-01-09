import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { AdminNav } from "@/components/admin/admin-nav"

export const metadata = {
  title: "Dashboard Administratora | UW",
  description: "Panel administracyjny - przegląd działalności",
}

export default function AdminDashboardPage() {
  // Mock data
  const stats = {
    totalClients: 347,
    activePolicies: 512,
    pendingQuotes: 23,
    monthlyRevenue: "42,500 PLN",
  }

  const recentQuotes = [
    { id: 1, client: "Anna Nowak", type: "Komunikacyjne", date: "2026-01-28", status: "pending" },
    { id: 2, client: "Piotr Kowalski", type: "Mieszkaniowe", date: "2026-01-28", status: "pending" },
    { id: 3, client: "Maria Wiśniewska", type: "Zdrowotne", date: "2026-01-27", status: "completed" },
  ]

  const upcomingRenewals = [
    { id: 1, client: "Jan Lewandowski", policy: "OC/AC Toyota", expires: "2026-02-15" },
    { id: 2, client: "Katarzyna Mazur", policy: "Mieszkaniowe", expires: "2026-02-20" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administratora</h1>
          <p className="text-muted-foreground">Przegląd aktywności i kluczowych wskaźników</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Klienci</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Aktywne Polisy</p>
              <p className="text-3xl font-bold">{stats.activePolicies}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Oczekujące Wyceny</p>
              <p className="text-3xl font-bold">{stats.pendingQuotes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Przychód (styczeń)</p>
              <p className="text-2xl font-bold">{stats.monthlyRevenue}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Quotes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Najnowsze Wnioski o Wycenę</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/wyceny">Zobacz wszystkie</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{quote.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {quote.type} • {quote.date}
                          </p>
                        </div>
                      </div>
                      {quote.status === "pending" ? (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Oczekuje
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Zrealizowane
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Nadchodzące Przedłużenia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingRenewals.map((renewal) => (
                    <div key={renewal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{renewal.client}</p>
                        <p className="text-sm text-muted-foreground">{renewal.policy}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Wygasa</p>
                        <p className="text-sm text-muted-foreground">{renewal.expires}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Szybkie Akcje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/klienci/nowy">
                    <Users className="mr-2 h-4 w-4" />
                    Dodaj Klienta
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/polisy/nowa">
                    <FileText className="mr-2 h-4 w-4" />
                    Nowa Polisa
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href="/admin/wyceny">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Przejrzyj Wyceny
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zadania na Dziś</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">23 nowe wnioski o wycenę</p>
                    <p className="text-xs text-muted-foreground">Wymagają odpowiedzi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">2 polisy do przedłużenia</p>
                    <p className="text-xs text-muted-foreground">Skontaktuj się z klientami</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Aktywny
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wersja</span>
                  <span className="font-medium">1.0.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
