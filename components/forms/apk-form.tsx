"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

type Step = 1 | 2 | 3 | 4

export function APKForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const stepIndicatorRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    selectedInsurance: "",
    fullName: "",
    phone: "",
    email: "",
    contactPreference: "telefon",
    priorities: [] as string[],
    additionalInfo: "",
    zgodaPrzetwarzanie: false,
    zgodaKlauzula: false,
    // Mieszkanie
    mieszkanie_lokalizacja: "",
    mieszkanie_rodzaj: "",
    mieszkanie_powierzchnia: "",
    mieszkanie_rok: "",
    mieszkanie_wartosc: "",
    mieszkanie_ryzyka: "",
    // Samochód
    samochod_zakres: "",
    samochod_marka: "",
    samochod_rok: "",
    samochod_moc: "",
    samochod_uzytkowanie: "",
    samochod_szkody: "",
    samochod_uwagi: "",
    // Podróże
    podroze_kierunek: "",
    podroze_termin: "",
    podroze_osoby: "",
    podroze_sporty: "",
    podroze_choroby: "",
    podroze_uwagi: "",
    // Firmowe
    firmowe_nazwa: "",
    firmowe_nip: "",
    firmowe_zakres: "",
    firmowe_skala: "",
    firmowe_opis: "",
    // NNW
    nnw_typ: "",
    nnw_dzieci: "",
    nnw_szkola: "",
    nnw_sport: "",
    nnw_uwagi: "",
    nnw_zawod: "",
    nnw_suma: "",
    nnw_sport_zawodowy: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const typ = params.get("typ")
      if (typ) {
        const mapping: Record<string, string> = {
          komunikacyjne: "samochod",
          mieszkaniowe: "mieszkanie",
          turystyczne: "podroze",
          zdrowotne: "zdrowotne",
          zyciowe: "zycie",
          firmowe: "firmowe",
          nnw: "nnw",
        }
        const ochronaType = mapping[typ]
        // Changed to use selectedInsurance from formData
        if (ochronaType && formData.selectedInsurance !== ochronaType) {
          setFormData((prev) => ({ ...prev, selectedInsurance: ochronaType }))
        }
      }
    }
  }, [formData.selectedInsurance])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (field: "priorities", value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[field]
      if (checked) {
        // Check if adding the new priority exceeds the limit (if applicable)
        // For now, assuming multiple selections are allowed for priorities
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
      setTimeout(() => {
        stepIndicatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
      setTimeout(() => {
        stepIndicatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Scroll to step indicator when reaching step 4
    if (currentStep === 4) {
      setTimeout(() => {
        stepIndicatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }

    if (!formData.zgodaPrzetwarzanie || !formData.zgodaKlauzula) {
      alert("Proszę zaznaczyć wymagane zgody.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/apk-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitted(true)
        console.log("[v0] APK submitted successfully. Number:", result.apkNumber)
      } else {
        alert("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.")
      }
    } catch (error) {
      console.error("[v0] Błąd:", error)
      alert("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto border-green-500">
        <CardHeader>
          <CardTitle className="text-green-600">Dziękujemy!</CardTitle>
        </CardHeader>
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Dziękujemy za wypełnienie formularza!</h2>
            <p className="text-muted-foreground text-pretty">
              Twój formularz APK został wysłany. Skontaktujemy się z Tobą w ciągu 24 godzin z przygotowaną ofertą.
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/")} className="mt-6">
            Wróć do strony głównej
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress indicator */}
      <div ref={stepIndicatorRef} className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                } ${step !== 1 ? "ml-1" : ""}`}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">Krok {currentStep} z 4</p>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>KROK 1: Rodzaj ubezpieczenia</CardTitle>
            <CardDescription>Wybierz rodzaj ubezpieczenia, który Cię interesuje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rodzaj ubezpieczenia</Label>
              <RadioGroup
                value={formData.selectedInsurance}
                onValueChange={(value) => handleRadioChange("selectedInsurance", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mieszkanie" id="ochrona-mieszkanie" />
                  <Label htmlFor="ochrona-mieszkanie" className="font-normal">
                    Ubezpieczenie mieszkaniowe
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="samochod" id="ochrona-samochod" />
                  <Label htmlFor="ochrona-samochod" className="font-normal">
                    Ubezpieczenie komunikacyjne (OC/AC)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="podroze" id="ochrona-podroz" />
                  <Label htmlFor="ochrona-podroz" className="font-normal">
                    Ubezpieczenie turystyczne
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nnw" id="ochrona-zycie" />
                  <Label htmlFor="ochrona-zycie" className="font-normal">
                    Ubezpieczenie na życie / NNW
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="firmowe" id="ochrona-firmowe" />
                  <Label htmlFor="ochrona-firmowe" className="font-normal">
                    Ubezpieczenie firmowe
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>KROK 2: Pytania szczegółowe</CardTitle>
            <CardDescription>Odpowiedz na pytania dotyczące wybranego ubezpieczenia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 2 - Mieszkanie */}
            {formData.selectedInsurance === "mieszkanie" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Mieszkanie / Dom</h3>
                <div>
                  <Label htmlFor="mieszkanie_lokalizacja">Lokalizacja nieruchomości *</Label>
                  <Input
                    id="mieszkanie_lokalizacja"
                    name="mieszkanie_lokalizacja"
                    value={formData.mieszkanie_lokalizacja}
                    onChange={handleInputChange}
                    placeholder="np. Warszawa Wawer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mieszkanie_rodzaj">Rodzaj *</Label>
                  <select
                    id="mieszkanie_rodzaj"
                    name="mieszkanie_rodzaj"
                    value={formData.mieszkanie_rodzaj}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="">Wybierz...</option>
                    <option value="Mieszkanie">Mieszkanie</option>
                    <option value="Dom">Dom</option>
                    <option value="Dom w budowie">Dom w budowie</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="mieszkanie_powierzchnia">Powierzchnia (m²)</Label>
                  <Input
                    id="mieszkanie_powierzchnia"
                    name="mieszkanie_powierzchnia"
                    type="number"
                    value={formData.mieszkanie_powierzchnia}
                    onChange={handleInputChange}
                    placeholder="np. 65"
                  />
                </div>
                <div>
                  <Label htmlFor="mieszkanie_rok">Rok budowy</Label>
                  <Input
                    id="mieszkanie_rok"
                    name="mieszkanie_rok"
                    type="number"
                    value={formData.mieszkanie_rok}
                    onChange={handleInputChange}
                    placeholder="np. 2010"
                  />
                </div>
                <div>
                  <Label htmlFor="mieszkanie_wartosc">Szacowana wartość (PLN)</Label>
                  <Input
                    id="mieszkanie_wartosc"
                    name="mieszkanie_wartosc"
                    type="number"
                    value={formData.mieszkanie_wartosc}
                    onChange={handleInputChange}
                    placeholder="np. 450000"
                  />
                </div>
                <div>
                  <Label htmlFor="mieszkanie_ryzyka">Co chcesz chronić/kluczowe ryzyka?</Label>
                  <Textarea
                    id="mieszkanie_ryzyka"
                    name="mieszkanie_ryzyka"
                    value={formData.mieszkanie_ryzyka}
                    onChange={handleInputChange}
                    placeholder="np. pożar, zalanie, kradzież..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Samochód */}
            {formData.selectedInsurance === "samochod" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Samochód</h3>
                <div>
                  <Label htmlFor="samochod_zakres">Zakres *</Label>
                  <select
                    id="samochod_zakres"
                    name="samochod_zakres"
                    value={formData.samochod_zakres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="">Wybierz...</option>
                    <option value="OC">OC</option>
                    <option value="OC + AC">OC + AC</option>
                    <option value="OC + AC + Assistance">OC + AC + Assistance</option>
                    <option value="OC + Assistance">OC + Assistance</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="samochod_marka">Marka / model *</Label>
                  <Input
                    id="samochod_marka"
                    name="samochod_marka"
                    value={formData.samochod_marka}
                    onChange={handleInputChange}
                    placeholder="np. Toyota Corolla"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="samochod_rok">Rok produkcji</Label>
                  <Input
                    id="samochod_rok"
                    name="samochod_rok"
                    type="number"
                    value={formData.samochod_rok}
                    onChange={handleInputChange}
                    placeholder="np. 2019"
                  />
                </div>
                <div>
                  <Label htmlFor="samochod_moc">Pojemność / moc (opcjonalnie)</Label>
                  <Input
                    id="samochod_moc"
                    name="samochod_moc"
                    value={formData.samochod_moc}
                    onChange={handleInputChange}
                    placeholder="np. 1.6 / 120 KM"
                  />
                </div>
                <div>
                  <Label htmlFor="samochod_uzytkowanie">Sposób użytkowania</Label>
                  <select
                    id="samochod_uzytkowanie"
                    name="samochod_uzytkowanie"
                    value={formData.samochod_uzytkowanie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">Wybierz...</option>
                    <option value="Prywatnie">Prywatnie</option>
                    <option value="Firmowo">Firmowo</option>
                    <option value="Taksówka">Taksówka</option>
                    <option value="Wypożyczalnia">Wypożyczalnia</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="samochod_szkody">Szkody w ostatnich latach?</Label>
                  <select
                    id="samochod_szkody"
                    name="samochod_szkody"
                    value={formData.samochod_szkody}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">Wybierz...</option>
                    <option value="Nie">Nie</option>
                    <option value="Tak">Tak</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="samochod_uwagi">Uwagi (opcjonalnie)</Label>
                  <Textarea
                    id="samochod_uwagi"
                    name="samochod_uwagi"
                    value={formData.samochod_uwagi}
                    onChange={handleInputChange}
                    placeholder="Dodatkowe informacje..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Podróże */}
            {formData.selectedInsurance === "podroze" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Podróż</h3>
                <div>
                  <Label htmlFor="podroze_kierunek">Kierunek (kraj/region) *</Label>
                  <Input
                    id="podroze_kierunek"
                    name="podroze_kierunek"
                    value={formData.podroze_kierunek}
                    onChange={handleInputChange}
                    placeholder="np. Włochy, Europa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="podroze_termin">Termin wyjazdu *</Label>
                  <Input
                    id="podroze_termin"
                    name="podroze_termin"
                    type="date"
                    value={formData.podroze_termin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="podroze_osoby">Liczba osób + wiek *</Label>
                  <Input
                    id="podroze_osoby"
                    name="podroze_osoby"
                    value={formData.podroze_osoby}
                    onChange={handleInputChange}
                    placeholder="np. 2 dorosłych, dzieci 5 i 8 lat"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="podroze_sporty">Sporty / aktywności</Label>
                  <Input
                    id="podroze_sporty"
                    name="podroze_sporty"
                    value={formData.podroze_sporty}
                    onChange={handleInputChange}
                    placeholder="np. narty, nurkowanie"
                  />
                </div>
                <div>
                  <Label htmlFor="podroze_choroby">Choroby przewlekłe?</Label>
                  <select
                    id="podroze_choroby"
                    name="podroze_choroby"
                    value={formData.podroze_choroby}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">Wybierz...</option>
                    <option value="Nie">Nie</option>
                    <option value="Tak">Tak</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="podroze_uwagi">Uwagi (opcjonalnie)</Label>
                  <Textarea
                    id="podroze_uwagi"
                    name="podroze_uwagi"
                    value={formData.podroze_uwagi}
                    onChange={handleInputChange}
                    placeholder="Dodatkowe informacje..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Firmowe */}
            {formData.selectedInsurance === "firmowe" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Ubezpieczenie firmy</h3>
                <div>
                  <Label htmlFor="firmowe_nazwa">Nazwa firmy / branża *</Label>
                  <Input
                    id="firmowe_nazwa"
                    name="firmowe_nazwa"
                    value={formData.firmowe_nazwa}
                    onChange={handleInputChange}
                    placeholder="np. ABC Sp. z o.o. - usługi budowlane"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firmowe_nip">Numer NIP</Label>
                  <Input
                    id="firmowe_nip"
                    name="firmowe_nip"
                    value={formData.firmowe_nip}
                    onChange={handleInputChange}
                    placeholder="np. 123-456-78-90"
                  />
                </div>
                <div>
                  <Label htmlFor="firmowe_zakres">Czego dotyczy ubezpieczenie? *</Label>
                  <select
                    id="firmowe_zakres"
                    name="firmowe_zakres"
                    value={formData.firmowe_zakres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="">Wybierz...</option>
                    <option value="OC działalności">OC działalności</option>
                    <option value="Mienie firmy">Mienie firmy</option>
                    <option value="Flota">Flota</option>
                    <option value="Pracownicy (grupowe)">Pracownicy (grupowe)</option>
                    <option value="Pakiet (kilka obszarów)">Pakiet (kilka obszarów)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="firmowe_skala">Skala (opcjonalnie)</Label>
                  <Input
                    id="firmowe_skala"
                    name="firmowe_skala"
                    value={formData.firmowe_skala}
                    onChange={handleInputChange}
                    placeholder="np. liczba pracowników, przychód roczny"
                  />
                </div>
                <div>
                  <Label htmlFor="firmowe_opis">Opis ryzyk / oczekiwań</Label>
                  <Textarea
                    id="firmowe_opis"
                    name="firmowe_opis"
                    value={formData.firmowe_opis}
                    onChange={handleInputChange}
                    placeholder="Opisz czego oczekujesz od ubezpieczenia..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - NNW */}
            {formData.selectedInsurance === "nnw" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Ubezpieczenie NNW</h3>
                <div>
                  <Label>Typ ubezpieczenia *</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="nnw_typ_dorosly"
                        name="nnw_typ"
                        value="dorosly"
                        checked={formData.nnw_typ === "dorosly"}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="nnw_typ_dorosly" className="font-normal">
                        Osoba dorosła
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="nnw_typ_dziecko"
                        name="nnw_typ"
                        value="dziecko"
                        checked={formData.nnw_typ === "dziecko"}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="nnw_typ_dziecko" className="font-normal">
                        Dziecko w wieku szkolnym
                      </Label>
                    </div>
                  </div>
                </div>

                {formData.nnw_typ === "dziecko" && (
                  <>
                    <div>
                      <Label htmlFor="nnw_dzieci">Liczba dzieci + wiek *</Label>
                      <Input
                        id="nnw_dzieci"
                        name="nnw_dzieci"
                        value={formData.nnw_dzieci}
                        onChange={handleInputChange}
                        placeholder="np. 2 dzieci, 7 i 10 lat"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nnw_szkola">Szkoła *</Label>
                      <select
                        id="nnw_szkola"
                        name="nnw_szkola"
                        value={formData.nnw_szkola}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        required
                      >
                        <option value="">Wybierz...</option>
                        <option value="Przedszkole">Przedszkole</option>
                        <option value="Podstawowa">Podstawowa</option>
                        <option value="Średnia">Średnia</option>
                        <option value="Wyższa">Wyższa</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="nnw_sport">Aktywność sportowa?</Label>
                      <select
                        id="nnw_sport"
                        name="nnw_sport"
                        value={formData.nnw_sport}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="">Wybierz...</option>
                        <option value="Nie">Nie</option>
                        <option value="Tak (rekreacyjnie)">Tak (rekreacyjnie)</option>
                        <option value="Tak (wyczynowo)">Tak (wyczynowo)</option>
                      </select>
                    </div>
                  </>
                )}

                {formData.nnw_typ === "dorosly" && (
                  <>
                    <div>
                      <Label htmlFor="nnw_zawod">Zawód</Label>
                      <Input
                        id="nnw_zawod"
                        name="nnw_zawod"
                        value={formData.nnw_zawod}
                        onChange={handleInputChange}
                        placeholder="np. programista, nauczyciel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nnw_suma">Suma ubezpieczenia (PLN)</Label>
                      <Input
                        id="nnw_suma"
                        name="nnw_suma"
                        type="number"
                        value={formData.nnw_suma}
                        onChange={handleInputChange}
                        placeholder="np. 50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nnw_sport_zawodowy">Sport zawodowy?</Label>
                      <select
                        id="nnw_sport_zawodowy"
                        name="nnw_sport_zawodowy"
                        value={formData.nnw_sport_zawodowy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="">Wybierz...</option>
                        <option value="Nie">Nie</option>
                        <option value="Tak">Tak</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="nnw_uwagi">Uwagi (opcjonalnie)</Label>
                  <Textarea
                    id="nnw_uwagi"
                    name="nnw_uwagi"
                    value={formData.nnw_uwagi}
                    onChange={handleInputChange}
                    placeholder="Dodatkowe informacje..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {!formData.selectedInsurance && (
              <p className="text-center text-muted-foreground italic">
                Wybierz rodzaj ubezpieczenia z poprzedniego kroku.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>KROK 3: Dane kontaktowe i priorytety</CardTitle>
            <CardDescription>Podaj swoje dane, abyśmy mogli przygotować dla Ciebie ofertę</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 3 - Contact and Priorities */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Imię i nazwisko *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Jan Kowalski"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+48 123 456 789"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jan.kowalski@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPreference">Preferowana forma kontaktu *</Label>
                <select
                  id="contactPreference"
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="telefon">Telefon</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div className="pt-4">
                <Label>Co jest dla Ciebie najważniejsze? (można wybrać kilka)</Label>
                <div className="space-y-2 mt-2">
                  {[
                    "Najlepsza cena",
                    "Szeroki zakres ochrony",
                    "Szybka likwidacja szkód",
                    "Dobra reputacja ubezpieczyciela",
                    "Elastyczne warunki",
                  ].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={formData.priorities.includes(priority)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              priorities: [...formData.priorities, priority],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              priorities: formData.priorities.filter((p) => p !== priority),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`priority-${priority}`} className="font-normal">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>KROK 4: Podsumowanie i zgody</CardTitle>
            <CardDescription>Sprawdź wprowadzone dane i wyraź wymagane zgody</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Twoje dane</h3>
                <p className="text-sm">
                  <strong>Imię i nazwisko:</strong> {formData.fullName}
                </p>
                <p className="text-sm">
                  <strong>Telefon:</strong> {formData.phone}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-sm">
                  <strong>Preferowany kontakt:</strong> {formData.contactPreference}
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Wybrana ochrona</h3>
                <p className="text-sm">{formData.selectedInsurance || "Brak wyboru"}</p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Twoje priorytety</h3>
                <p className="text-sm">{formData.priorities.join(", ") || "Brak wyboru"}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Dodatkowe informacje (opcjonalnie)</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Czy jest coś jeszcze, o czym powinniśmy wiedzieć?"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold text-lg">Wymagane zgody</h3>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="zgoda-przetwarzanie"
                  checked={formData.zgodaPrzetwarzanie}
                  onCheckedChange={(checked) => handleBooleanChange("zgodaPrzetwarzanie", checked as boolean)}
                />
                <Label htmlFor="zgoda-przetwarzanie" className="font-normal leading-relaxed">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych przez agenta ubezpieczeniowego w celu
                  przygotowania oferty (RODO). *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="zgoda-klauzula"
                  checked={formData.zgodaKlauzula}
                  onCheckedChange={(checked) => handleBooleanChange("zgodaKlauzula", checked as boolean)}
                />
                <Label htmlFor="zgoda-klauzula" className="font-normal leading-relaxed">
                  Oświadczam, że zapoznałem się z{" "}
                  <a
                    href="/rodo"
                    target="_blank"
                    className="text-primary underline hover:no-underline"
                    rel="noreferrer"
                  >
                    klauzulą informacyjną
                  </a>{" "}
                  dostępną na stronie wawerpolisy.pl. *
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button type="button" onClick={prevStep} disabled={currentStep === 1} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>

        {currentStep < 4 ? (
          <Button type="button" onClick={nextStep}>
            Dalej
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={loading || !formData.zgodaPrzetwarzanie || !formData.zgodaKlauzula}>
            {loading ? "Wysyłanie..." : "Wyślij formularz"}
          </Button>
        )}
      </div>
    </form>
  )
}
