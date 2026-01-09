"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"

type FormState = {
  insuranceType: string
  fullName: string
  phone: string
  email: string
  preferredContact: string
  message: string
  details: string
  consent: boolean
  website: string // honeypot
}

function mapTypParam(typ: string | null) {
  if (!typ) return ""
  const t = typ.toLowerCase()
  const mapping: Record<string, string> = {
    komunikacyjne: "komunikacyjne",
    mieszkaniowe: "mieszkaniowe",
    turystyczne: "turystyczne",
    zdrowotne: "zdrowotne",
    zyciowe: "zyciowe",
    firmowe: "firmowe",
  }
  return mapping[t] || ""
}

export function QuoteForm() {
  const searchParams = useSearchParams()
  const defaultType = useMemo(() => mapTypParam(searchParams.get("typ") || searchParams.get("type")), [searchParams])

  const [state, setState] = useState<FormState>({
    insuranceType: defaultType,
    fullName: "",
    phone: "",
    email: "",
    preferredContact: "telefon",
    message: "",
    details: "",
    consent: false,
    website: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasAnyContact = state.phone.trim().length >= 7 || state.email.includes("@")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!hasAnyContact) {
      setError("Podaj telefon lub e-mail.")
      return
    }
    if (!state.consent) {
      setError("Zaznacz zgodę na przetwarzanie danych.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/quote-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Nie udało się wysłać zapytania.")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać zapytania.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Wysłane</h3>
        <p className="text-muted-foreground text-pretty">
          Dzięki. Jeśli podałeś numer telefonu, oddzwonię. Jeśli podałeś e-mail — odpiszę z wyceną lub doprecyzowaniem.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="website"
        value={state.website}
        onChange={(e) => setState((s) => ({ ...s, website: e.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-2">
        <Label htmlFor="insuranceType">Rodzaj ubezpieczenia *</Label>
        <Select
          value={state.insuranceType}
          onValueChange={(v) => setState((s) => ({ ...s, insuranceType: v }))}
          required
        >
          <SelectTrigger id="insuranceType">
            <SelectValue placeholder="Wybierz rodzaj ubezpieczenia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="komunikacyjne">Komunikacyjne (OC/AC)</SelectItem>
            <SelectItem value="mieszkaniowe">Mieszkaniowe</SelectItem>
            <SelectItem value="zdrowotne">Zdrowotne</SelectItem>
            <SelectItem value="zyciowe">Na życie</SelectItem>
            <SelectItem value="turystyczne">Turystyczne</SelectItem>
            <SelectItem value="firmowe">Firmowe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Imię i nazwisko *</Label>
        <Input
          id="fullName"
          value={state.fullName}
          onChange={(e) => setState((s) => ({ ...s, fullName: e.target.value }))}
          required
          placeholder="Mateusz Kowalski"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            value={state.phone}
            onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
            placeholder="+48 500 387 340"
            inputMode="tel"
          />
          <p className="text-xs text-muted-foreground">Wystarczy telefon lub e-mail. Nie oba.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            placeholder="jan.kowalski@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredContact">Preferowany kontakt</Label>
        <Select
          value={state.preferredContact}
          onValueChange={(v) => setState((s) => ({ ...s, preferredContact: v }))}
        >
          <SelectTrigger id="preferredContact">
            <SelectValue placeholder="Wybierz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="telefon">Telefon</SelectItem>
            <SelectItem value="email">E-mail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">W czym pomóc? (krótko)</Label>
        <Textarea
          id="message"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          rows={4}
          placeholder="Np. OC/AC: mam auto 2020, interesuje mnie OC+AC z szybami i assistance..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Szczegóły (opcjonalnie, jeśli masz)</Label>
        <Textarea
          id="details"
          value={state.details}
          onChange={(e) => setState((s) => ({ ...s, details: e.target.value }))}
          rows={5}
          placeholder="Dodatkowe informacje, które mają wpływ na wycenę (miejsce, zakres, suma, historia szkód itp.)."
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={state.consent}
          onCheckedChange={(v) => setState((s) => ({ ...s, consent: Boolean(v) }))}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed">
          Wyrażam zgodę na przetwarzanie danych w celu kontaktu i przygotowania oferty. Szczegóły w{" "}
          <Link href="/rodo" className="underline underline-offset-2">
            RODO
          </Link>{" "}
          i{" "}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            polityce prywatności
          </Link>
          .
        </Label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Wysyłanie..." : "Poproś o wycenę"}
      </Button>
    </form>
  )
}
