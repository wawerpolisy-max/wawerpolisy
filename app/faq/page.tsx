import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Najczęściej Zadawane Pytania (FAQ) | wawerpolisy.pl",
  description: "Odpowiedzi na najczęstsze pytania dotyczące ubezpieczeń. Dowiedz się więcej o naszych usługach.",
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Ogólne",
      questions: [
        {
          q: "Jak mogę skontaktować się z agentem?",
          a: "Możesz skontaktować się z nami telefonicznie pod numerem +48 500 387 340, mailowo na wawerpolisy@gmail.com lub poprzez formularz kontaktowy na stronie.",
        },
        {
          q: "Czy wycena jest bezpłatna?",
          a: "Tak, przygotowanie wyceny ubezpieczenia jest całkowicie bezpłatne i nie zobowiązuje do zakupu polisy.",
        },
        {
          q: "Jak długo trwa przygotowanie oferty?",
          a: "Standardowo przygotowujemy ofertę w ciągu 24 godzin od otrzymania wszystkich niezbędnych informacji.",
        },
      ],
    },
    {
      category: "Ubezpieczenia komunikacyjne",
      questions: [
        {
          q: "Jaka jest różnica między OC a AC?",
          a: "OC (Odpowiedzialność Cywilna) jest obowiązkowe i pokrywa szkody wyrządzone przez Ciebie innym. AC (AutoCasco) jest dobrowolne i chroni Twój pojazd przed uszkodzeniem lub kradzieżą.",
        },
        {
          q: "Czy mogę przedłużyć OC u innego ubezpieczyciela?",
          a: "Tak, możesz zmienić ubezpieczyciela przy przedłużeniu polisy OC. Pomożemy Ci porównać oferty i wybrać najkorzystniejszą.",
        },
        {
          q: "Co to jest bonus za bezszkodową jazdę?",
          a: "Bonus to zniżka w składce przyznawana kierowcom, którzy nie powodowali szkód. Może wynosić nawet do 60% składki podstawowej.",
        },
      ],
    },
    {
      category: "Ubezpieczenia mieszkaniowe",
      questions: [
        {
          q: "Czy ubezpieczenie mieszkania jest obowiązkowe?",
          a: "Nie jest obowiązkowe, ale jest bardzo zalecane. Banki często wymagają go przy kredycie hipotecznym.",
        },
        {
          q: "Co jest objęte ubezpieczeniem mieszkania?",
          a: "Standardowo: konstrukcja, wyposażenie stałe, ruchomości domowe, OC w życiu prywatnym. Możliwe rozszerzenia o szyby, elektronikę, kradzież poza domem.",
        },
        {
          q: "Jak określić sumę ubezpieczenia?",
          a: "Suma ubezpieczenia powinna odpowiadać wartości odtworzeniowej mieszkania i znajdujących się w nim przedmiotów. Pomożemy Ci ją określić.",
        },
      ],
    },
    {
      category: "Likwidacja szkód",
      questions: [
        {
          q: "Jak zgłosić szkodę?",
          a: "Skontaktuj się z nami telefonicznie lub mailowo - pomożemy w zgłoszeniu szkody do ubezpieczyciela i będziemy wspierać w całym procesie likwidacji.",
        },
        {
          q: "Jak długo trwa wypłata odszkodowania?",
          a: "Zależy od rodzaju szkody. Proste przypadki - do 30 dni. Złożone - do 90 dni. Ubezpieczyciel musi wypłacić odszkodowanie w ustawowych terminach.",
        },
        {
          q: "Czy mogę samodzielnie wybrać warsztat naprawczy?",
          a: "Tak, masz prawo wyboru warsztatu, chyba że polisa AC zawiera klauzulę warsztatu sieci. Sprawdzimy to w Twojej umowie.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Najczęściej zadawane pytania</h1>
            <p className="text-xl text-blue-100 text-pretty">
              Znajdź odpowiedzi na najpopularniejsze pytania dotyczące ubezpieczeń i naszych usług
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                <Card className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-pretty">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4">Nie znalazłeś odpowiedzi?</h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Skontaktuj się z nami - chętnie odpowiemy na wszystkie pytania
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/kontakt">Zadaj pytanie</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
