"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, create account here
    router.push("/portal/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Imię</Label>
          <Input id="firstName" name="firstName" required placeholder="Jan" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nazwisko</Label>
          <Input id="lastName" name="lastName" required placeholder="Kowalski" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="twoj@email.pl" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" name="phone" type="tel" required placeholder="+48 123 456 789" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input id="password" name="password" type="password" required placeholder="••••••••" minLength={8} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potwierdź Hasło</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="••••••••" />
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" name="terms" required className="mt-1" />
        <Label htmlFor="terms" className="text-sm font-normal">
          Akceptuję regulamin i politykę prywatności
        </Label>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? "Tworzenie konta..." : "Utwórz Konto"}
      </Button>
    </form>
  )
}
