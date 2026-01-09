"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"
import {
  FileText,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  AlertCircle,
  Plus,
  Download,
  FileCheck,
  Bell,
  BellOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Define the type for a policy
type Policy = {
  id: number
  category: string
  type: string
  policyNumber: string
  vehicle?: string
  property?: string
  validFrom: string
  validUntil: string
  status: string
  premium: string
  paymentConfirmed: boolean
  documents: {
    policy: boolean
    owu: boolean
    payment: boolean
  }
  notifications: {
    enabled: boolean
    email: string
    notify30Days: boolean
    notify7Days: boolean
  }
}

function daysUntilExpiration(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default function DashboardClient() {
  const policies: Policy[] = [
    {
      id: 1,
      category: "Komunikacyjne",
      type: "OC/AC Pojazdu",
      policyNumber: "POL/2025/001234",
      vehicle: "Toyota Corolla",
      validFrom: "2025-03-15",
      validUntil: "2026-03-15",
      status: "active",
      premium: "1,200 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: true,
        payment: true,
      },
      notifications: {
        enabled: true,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
    {
      id: 2,
      category: "Komunikacyjne",
      type: "OC Motocykl",
      policyNumber: "POL/2025/001567",
      vehicle: "Honda CB500",
      validFrom: "2025-04-01",
      validUntil: "2026-04-01",
      status: "active",
      premium: "680 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: true,
        payment: true,
      },
      notifications: {
        enabled: false,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
    {
      id: 3,
      category: "Mieszkaniowe",
      type: "Ubezpieczenie Mieszkania",
      policyNumber: "POL/2025/005678",
      property: "Mieszkanie 65m²",
      validFrom: "2024-12-01",
      validUntil: "2025-12-01",
      status: "active",
      premium: "450 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: true,
        payment: true,
      },
      notifications: {
        enabled: true,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
    {
      id: 4,
      category: "Turystyczne",
      type: "Ubezpieczenie Podróżne Europa",
      policyNumber: "POL/2025/007890",
      property: "Pakiet Rodzinny",
      validFrom: "2025-06-15",
      validUntil: "2025-07-15",
      status: "active",
      premium: "180 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: false,
        payment: true,
      },
      notifications: {
        enabled: false,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: false,
      },
    },
    {
      id: 5,
      category: "Firmowe",
      type: "OC Działalności",
      policyNumber: "POL/2025/008123",
      property: "Firma XYZ Sp. z o.o.",
      validFrom: "2025-01-01",
      validUntil: "2026-01-01",
      status: "active",
      premium: "3,200 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: true,
        payment: true,
      },
      notifications: {
        enabled: true,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
    {
      id: 6,
      category: "Zdrowotne",
      type: "Pakiet Medyczny",
      policyNumber: "POL/2025/009012",
      property: "Pakiet Rodzinny",
      validFrom: "2025-01-01",
      validUntil: "2026-01-01",
      status: "active",
      premium: "2,400 zł",
      paymentConfirmed: false,
      documents: {
        policy: true,
        owu: false,
        payment: false,
      },
      notifications: {
        enabled: false,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
    {
      id: 7,
      category: "Na Życie",
      type: "Ubezpieczenie na Życie",
      policyNumber: "POL/2025/009876",
      property: "Ochrona Rodziny",
      validFrom: "2024-08-01",
      validUntil: "2034-08-01",
      status: "active",
      premium: "1,800 zł",
      paymentConfirmed: true,
      documents: {
        policy: true,
        owu: true,
        payment: true,
      },
      notifications: {
        enabled: true,
        email: "jan.kowalski@example.com",
        notify30Days: true,
        notify7Days: true,
      },
    },
  ]

  const categories = ["Komunikacyjne", "Mieszkaniowe", "Turystyczne", "Firmowe", "Zdrowotne", "Na Życie"]
  const categorizedPolicies: Record<string, Policy[]> = {}
  categories.forEach((cat) => {
    categorizedPolicies[cat] = policies.filter((p) => p.category === cat)
  })

  const [activeTab, setActiveTab] = React.useState("Komunikacyjne")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-wawerpolisy.png"
                alt="wawerpolisy.pl"
                width={50}
                height={50}
                className="object-contain"
              />
              <span className="text-sm font-medium text-muted-foreground">Panel Klienta</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Jan Kowalski</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/portal/login">Wyloguj</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Witaj, Jan!</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi ubezpieczeniami i dokumentami</p>
        </div>

        {/* Policy Summary - Modern Cards */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-white shadow-lg border-blue-100">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Twoje polisy</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveTab(category)
                    // Scroll to tabs section
                    document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group relative bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 text-center transition-colors">
                      {category}
                    </span>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 rounded-full transition-all">
                      <span className="text-2xl font-bold text-blue-700 group-hover:text-blue-800">
                        {categorizedPolicies[category].length}
                      </span>
                    </div>
                  </div>
                  {/* Hover indicator */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Moje polisy</p>
                <p className="text-2xl font-bold">{policies.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold">Terminy</p>
                <p className="text-2xl font-bold">
                  {policies.filter((p) => daysUntilExpiration(p.validUntil) < 60).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Płatności</p>
                <p className="text-2xl font-bold">
                  {policies.filter((p) => !p.paymentConfirmed).length > 0 ? "!" : "OK"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold">Ustawienia</p>
                <p className="text-sm text-muted-foreground">Profil</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policies Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Zarządzaj swoimi polisami
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs id="tabs-section" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs lg:text-sm">
                        {category}
                        {categorizedPolicies[category].length > 0 && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {categorizedPolicies[category].length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <Button size="sm" asChild>
                          <Link href={`/apk?type=${category.toLowerCase()}`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Dodaj polisę
                          </Link>
                        </Button>
                      </div>

                      {categorizedPolicies[category].length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">Brak polis w kategorii {category}</p>
                          <Button asChild>
                            <Link href={`/apk?type=${category.toLowerCase()}`}>
                              <Plus className="h-4 w-4 mr-2" />
                              Dodaj pierwszą polisę
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {categorizedPolicies[category].map((policy) => {
                            const daysLeft = daysUntilExpiration(policy.validUntil)
                            const isExpiringSoon = daysLeft <= 30

                            return (
                              <div
                                key={policy.id}
                                className="border rounded-lg p-5 hover:border-blue-500 transition-colors bg-white"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="font-bold text-lg">{policy.type}</h4>
                                    <p className="text-sm text-muted-foreground">{policy.policyNumber}</p>
                                  </div>
                                  <div className="flex flex-col gap-2 items-end">
                                    <Badge
                                      variant={policy.status === "active" ? "default" : "secondary"}
                                      className="bg-green-100 text-green-700"
                                    >
                                      Aktywna
                                    </Badge>
                                    {isExpiringSoon && (
                                      <Badge
                                        variant="destructive"
                                        className="bg-orange-100 text-orange-700 border-orange-300"
                                      >
                                        Kończy się za {daysLeft} dni
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Przedmiot</p>
                                    <p className="font-medium">{policy.vehicle || policy.property}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Ważność</p>
                                    <p className="font-medium">
                                      {policy.validFrom} - {policy.validUntil}
                                    </p>
                                    <p className="text-xs text-blue-600 font-semibold mt-1">Pozostało {daysLeft} dni</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Składka</p>
                                    <p className="font-medium">{policy.premium}</p>
                                  </div>
                                </div>

                                <div className="border-t pt-4 mb-4">
                                  <p className="text-sm font-semibold mb-3">Dokumenty:</p>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      size="sm"
                                      variant={policy.documents.policy ? "default" : "outline"}
                                      className="gap-2"
                                    >
                                      {policy.documents.policy ? (
                                        <FileCheck className="h-4 w-4" />
                                      ) : (
                                        <Plus className="h-4 w-4" />
                                      )}
                                      Polisa
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={policy.documents.owu ? "default" : "outline"}
                                      className="gap-2"
                                    >
                                      {policy.documents.owu ? (
                                        <FileCheck className="h-4 w-4" />
                                      ) : (
                                        <Plus className="h-4 w-4" />
                                      )}
                                      OWU
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={policy.paymentConfirmed ? "default" : "outline"}
                                      className="gap-2"
                                    >
                                      {policy.paymentConfirmed ? (
                                        <FileCheck className="h-4 w-4" />
                                      ) : (
                                        <Plus className="h-4 w-4" />
                                      )}
                                      Potwierdzenie płatności
                                    </Button>
                                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                      <Download className="h-4 w-4" />
                                      Pobierz wszystko
                                    </Button>
                                  </div>
                                </div>

                                <div className="border-t pt-4 bg-slate-50 -m-5 mt-0 p-5 rounded-b-lg">
                                  <div className="flex items-start gap-3 mb-3">
                                    <Checkbox
                                      id={`notifications-${policy.id}`}
                                      defaultChecked={policy.notifications.enabled}
                                    />
                                    <div className="flex-1">
                                      <Label
                                        htmlFor={`notifications-${policy.id}`}
                                        className="font-semibold cursor-pointer flex items-center gap-2"
                                      >
                                        {policy.notifications.enabled ? (
                                          <Bell className="h-4 w-4" />
                                        ) : (
                                          <BellOff className="h-4 w-4" />
                                        )}
                                        Powiadomienia o wygaśnięciu polisy
                                      </Label>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Otrzymuj automatyczne przypomnienia przed końcem okresu ubezpieczenia
                                      </p>
                                    </div>
                                  </div>

                                  {policy.notifications.enabled && (
                                    <div className="ml-7 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`notify-30-${policy.id}`}
                                          defaultChecked={policy.notifications.notify30Days}
                                        />
                                        <Label htmlFor={`notify-30-${policy.id}`} className="text-sm cursor-pointer">
                                          Powiadomienie 30 dni przed wygaśnięciem
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`notify-7-${policy.id}`}
                                          defaultChecked={policy.notifications.notify7Days}
                                        />
                                        <Label htmlFor={`notify-7-${policy.id}`} className="text-sm cursor-pointer">
                                          Powiadomienie 7 dni przed wygaśnięciem
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Label htmlFor={`email-${policy.id}`} className="text-sm whitespace-nowrap">
                                          Email:
                                        </Label>
                                        <Input
                                          id={`email-${policy.id}`}
                                          type="email"
                                          defaultValue={policy.notifications.email}
                                          placeholder="twoj@email.com"
                                          className="text-sm h-8"
                                        />
                                      </div>
                                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                                        Zapisz ustawienia powiadomień
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Ostatnia Aktywność</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Polisa przedłużona</p>
                      <p className="text-sm text-muted-foreground">OC/AC Pojazdu - 15 stycznia 2026</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Płatność zrealizowana</p>
                      <p className="text-sm text-muted-foreground">Składka ubezpieczenia - 10 stycznia 2026</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Powiadomienia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-medium text-sm mb-1">Zbliża się termin przedłużenia</p>
                  <p className="text-xs text-muted-foreground">
                    Twoja polisa mieszkaniowa wygasa za 2 miesiące. Skontaktuj się z nami.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/kontakt">Skontaktuj się z Doradcą</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/wycena">Nowa Wycena</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
