"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormState = {
  name: string
  phone: string
  email: string
  product: string
  message: string
  consent: boolean
}

const PRODUCT_MAP: Record<string, string> = {
  "oc-ac": "OC/AC",
  oc: "OC",
  ac: "AC",
  "oc-ac-nnw": "OC/AC/NNW",
  nnw: "NNW",
  "mieszkanie-dom": "Mieszkanie/Dom",
  mieszkanie: "Mieszkanie",
  dom: "Dom",
  "na-zycie": "Na życie",
  zycie: "Na życie",
  "dla-firmy": "Dla firmy",
  firma: "Dla firmy",
  "turystyczne": "Turystyczne",
  turystyka: "Turystyczne",
  "zdrowotne": "Zdrowotne",
  zdrowie: "Zdrowotne",
}

function normalizeProduct(p: string | null): string {
  if (!p) return ""
  const key = p.trim().toLowerCase()
  return PRODUCT_MAP[key] ?? p
}

export function QuoteForm() {
  const [prefillProduct, setPrefillProduct] = useState<string>("")
  const [state, setState] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
    consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Zamiast useSearchParams(): czytamy query dopiero w przeglądarce po mount
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search)
      const p = sp.get("product")
      const normalized = normalizeProduct(p)
      if (normalized) setPrefillProduct(normalized)
    } catch {
      // ignorujemy - i tak formularz działa bez prefill
    }
  }, [])

  // Jeśli przyszło ?product=..., wypełnij pole "product" tylko jeśli użytkownik jeszcze nic nie wybrał
  useEffect(() => {
    if (!prefillProduct) return
    setState((s) => (s.product ? s : { ...s, product: prefillProduct }))
  }, [prefillProduct])

  const isValid = useMemo(() => {
    const phoneOk = state.phone.trim().length >= 7
    const nameOk = state.name.trim().length >= 2
    const productOk = state.product.trim().length >= 2
    return phoneOk && nameOk && productOk && state.consent
  }, [state])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!isValid) {
      setError("Uzupełnij wymagane pola i zaznacz zgodę.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/apk-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          phone: state.phone,
          email: state.email,
          product: state.product,
          message: state.message,
          consent: state.consent,
        }),
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Błąd wysyłki formularza.")
      }

      setSuccess(true)
      setState({
        name: "",
        phone: "",
        email: "",
        product: prefillProduct || "",
        message: "",
        consent: false,
      })
    } catch (err: any) {
      setError(err?.message || "Coś poszło nie tak. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Dzięki! Formularz wysłany. Odezwę się najszybciej jak to możliwe.
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="name">Imię i nazwisko *</Label>
        <Input
          id="name"
          value={state.name}
          onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
          placeholder="Np. Jan Kowalski"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Telefon *</Label>
        <Input
          id="phone"
          value={state.phone}
          onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
          placeholder="Np. 500 600 700"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          placeholder="Np. jan@firma.pl"
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product">Rodzaj ubezpieczenia *</Label>
        <Input
          id="product"
          value={state.product}
          onChange={(e) => setState((s) => ({ ...s, product: e.target.value }))}
          placeholder="Np. OC/AC, mieszkanie, na życie..."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Dodatkowe informacje</Label>
        <Textarea
          id="message"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          placeholder="Np. marka/rocznik auta, data końca polisy, zniżki..."
          rows={4}
        />
      </div>

      <div className="flex items-start gap-2">
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
