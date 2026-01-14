// components/forms/quote-form.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export type QuoteType =
  | ""
  | "komunikacyjne"
  | "mieszkaniowe"
  | "zdrowotne"
  | "firmowe"
  | "turystyczne"
  | "zyciowe"

export function mapTypParam(param: string | undefined | null): QuoteType {
  switch ((param || "").toLowerCase()) {
    case "oc":
    case "ac":
    case "ocac":
    case "komunikacyjne":
      return "komunikacyjne"
    case "mieszkanie":
    case "dom":
    case "mieszkaniowe":
      return "mieszkaniowe"
    case "zdrowie":
    case "zdrowotne":
      return "zdrowotne"
    case "firma":
    case "firmowe":
      return "firmowe"
    case "podroz":
    case "podroze":
    case "turystyczne":
      return "turystyczne"
    case "zycie":
    case "zyciowe":
      return "zyciowe"
    default:
      return ""
  }
}

export function QuoteForm(props: { defaultType?: QuoteType }) {
  const [state, setState] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    insuranceType: props.defaultType || ("" as QuoteType),
    message: "",
    consent: false,
  })

  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const setField = (key: keyof typeof state, value: any) => setState((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const selectedInsurance = (() => {
        switch (state.insuranceType) {
          case "komunikacyjne":
            return "samochod"
          case "mieszkaniowe":
            return "mieszkanie"
          case "turystyczne":
            return "podroze"
          case "firmowe":
            return "firmowe"
          case "zdrowotne":
            return "nnw"
          case "zyciowe":
            return "zycie"
          default:
            return ""
        }
      })()

      const res = await fetch("/api/quote-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, selectedInsurance }),
      })

      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error ? String(j.error) : "Błąd wysyłki formularza.")

      setSuccess("Dziękuję! Wrócę do Ciebie z propozycją.")
      setState((s) => ({ ...s, fullName: "", phone: "", email: "", message: "", consent: false }))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formularz wyceny</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Imię i nazwisko *</Label>
            <Input value={state.fullName} onChange={(e) => setField("fullName", e.target.value)} required />
          </div>

          <div>
            <Label>Telefon *</Label>
            <Input value={state.phone} onChange={(e) => setField("phone", e.target.value)} required />
          </div>

          <div>
            <Label>E-mail</Label>
            <Input value={state.email} onChange={(e) => setField("email", e.target.value)} />
          </div>

          <div>
            <Label>Rodzaj ubezpieczenia *</Label>
            <Select value={state.insuranceType} onValueChange={(v) => setField("insuranceType", v as QuoteType)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="komunikacyjne">OC/AC</SelectItem>
                <SelectItem value="mieszkaniowe">Mieszkanie / dom</SelectItem>
                <SelectItem value="turystyczne">Podróż</SelectItem>
                <SelectItem value="firmowe">Firma</SelectItem>
                <SelectItem value="zdrowotne">Zdrowotne</SelectItem>
                <SelectItem value="zyciowe">Życiowe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dodatkowe informacje</Label>
            <Textarea value={state.message} onChange={(e) => setField("message", e.target.value)} rows={4} />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              className="mt-1"
              checked={state.consent}
              onChange={(e) => setField("consent", e.target.checked)}
              required
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed">
              Wyrażam zgodę na przetwarzanie danych w celu kontaktu i przygotowania oferty. Szczegóły w{" "}
              <Link className="underline" href="/rodo">
                RODO
              </Link>{" "}
              i{" "}
              <Link className="underline" href="/polityka-prywatnosci">
                polityce prywatności
              </Link>
              .
            </Label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Wysyłanie..." : "Poproś o wycenę"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
