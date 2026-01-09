import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminNav } from "@/components/admin/admin-nav"
import { Users, Search, Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Zarządzanie Klientami | Admin UW",
}

export default function KlienciAdminPage() {
  // Mock data
  const clients = [
    { id: 1, name: "Jan Kowalski", email: "jan.kowalski@email.pl", phone: "+48 123 456 789", policies: 2 },
    { id: 2, name: "Anna Nowak", email: "anna.nowak@email.pl", phone: "+48 234 567 890", policies: 1 },
    { id: 3, name: "Piotr Wiśniewski", email: "piotr.wisniewski@email.pl", phone: "+48 345 678 901", policies: 3 },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Zarządzanie Klientami</h1>
            <p className="text-muted-foreground">Przeglądaj i zarządzaj bazą klientów</p>
          </div>
          <Button asChild>
            <Link href="/admin/klienci/nowy">
              <Plus className="mr-2 h-4 w-4" />
              Dodaj Klienta
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista Klientów
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Szukaj klienta..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Klient</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Telefon</th>
                    <th className="text-center py-3 px-4 font-semibold">Polisy</th>
                    <th className="text-right py-3 px-4 font-semibold">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium">{client.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{client.email}</td>
                      <td className="py-4 px-4 text-muted-foreground">{client.phone}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {client.policies}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Szczegóły
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
