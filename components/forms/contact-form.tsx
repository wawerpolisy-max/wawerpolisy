"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"

type State = {
  fullName: string
  phone: string
  email: string
  topic: string
  message: string
  consent: boolean
  website: string // honeypot
}

export function ContactForm() {
  const [state, setState] = useState<State>({
    fullName: "",
    phone: "",
    email: "",
    topic: "Ogólne pytanie",
    message: "",
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
    if (!state.message || state.message.trim().length < 10) {
      setError("Napisz krótką wiadomość (min. 10 znaków).")
      return
    }
    if (!state.consent) {
      setError("Zaznacz zgodę na przetwarzanie danych.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Nie udało się wysłać wiadomości.")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać wiadomości.")
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
        <h3 className="text-xl font-bold mb-2">Wiadomość wysłana</h3>
        <p className="text-muted-foreground text-pretty">
          Dzięki. Odpowiem tak szybko, jak się da. Jeśli podałeś telefon, oddzwonię.
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
        <Label>Temat</Label>
        <Select value={state.topic} onValueChange={(v) => setState((s) => ({ ...s, topic: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz temat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ogólne pytanie">Ogólne pytanie</SelectItem>
            <SelectItem value="Wycena ubezpieczenia">Wycena ubezpieczenia</SelectItem>
            <SelectItem value="Przedłużenie polisy">Przedłużenie polisy</SelectItem>
            <SelectItem value="Szkoda / assistance">Szkoda / assistance</SelectItem>
            <SelectItem value="Ubezpieczenie firmowe">Ubezpieczenie firmowe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Wiadomość *</Label>
        <Textarea
          id="message"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          required
          rows={6}
          placeholder="Opisz sprawę. Jeśli to wycena, dopisz najważniejsze parametry (zakres, suma, rok, lokalizacja itp.)."
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={state.consent}
          onCheckedChange={(v) => setState((s) => ({ ...s, consent: Boolean(v) }))}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed">
          Wyrażam zgodę na przetwarzanie danych w celu kontaktu. Szczegóły w{" "}
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
        {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
      </Button>
    </form>
  )
}
