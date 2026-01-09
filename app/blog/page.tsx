import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "Blog – ubezpieczenia prosto | wawerpolisy.pl",
  description: "Praktyczne porady i checklisty: OC/AC, mieszkanie, życie, podróże, firma.",
}

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Jak Obniżyć Składkę na Ubezpieczenie OC Pojazdu?",
      excerpt:
        "Poznaj sprawdzone sposoby na zmniejszenie kosztów ubezpieczenia komunikacyjnego. Porady ekspertów i praktyczne wskazówki.",
      date: "2026-01-25",
      readTime: "5 min",
      category: "Komunikacyjne",
      image: "/car-insurance-concept.png",
    },
    {
      id: 2,
      title: "Ubezpieczenie Mieszkania - Co Warto Wiedzieć?",
      excerpt:
        "Kompletny przewodnik po ubezpieczeniach mieszkaniowych. Dowiedz się, na co zwrócić uwagę przy wyborze polisy.",
      date: "2026-01-20",
      readTime: "7 min",
      category: "Mieszkaniowe",
      image: "/cozy-home-protection.png",
    },
    {
      id: 3,
      title: "Ubezpieczenie Turystyczne - Czy Warto?",
      excerpt:
        "Planujesz wyjazd za granicę? Zobacz, dlaczego ubezpieczenie turystyczne to must-have każdego podróżnika.",
      date: "2026-01-15",
      readTime: "4 min",
      category: "Turystyczne",
      image: "/travel-insurance-concept.png",
    },
    {
      id: 4,
      title: "5 Najczęstszych Błędów przy Zgłaszaniu Szkody",
      excerpt: "Uniknij problemów podczas likwidacji szkody. Sprawdź, jakich błędów należy się wystrzegać.",
      date: "2026-01-10",
      readTime: "6 min",
      category: "Poradnik",
      image: "/insurance-claim.jpg",
    },
    {
      id: 5,
      title: "Ubezpieczenia dla Firm - Od Czego Zacząć?",
      excerpt: "Prowadzisz działalność gospodarczą? Poznaj niezbędne ubezpieczenia dla przedsiębiorców i ich korzyści.",
      date: "2026-01-05",
      readTime: "8 min",
      category: "Firmowe",
      image: "/business-insurance-concept.png",
    },
    {
      id: 6,
      title: "Zmiany w Przepisach o Ubezpieczeniach w 2026 Roku",
      excerpt: "Sprawdź najważniejsze nowości legislacyjne, które wpłyną na Twoje ubezpieczenia w tym roku.",
      date: "2026-01-01",
      readTime: "5 min",
      category: "Aktualności",
      image: "/insurance-law.jpg",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Blog Ubezpieczeniowy</h1>
            <p className="text-xl text-blue-100 text-pretty">
              Praktyczne porady, aktualności i wszystko, co powinieneś wiedzieć o ubezpieczeniach
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-pretty">{post.excerpt}</p>
                  <Button variant="ghost" className="group p-0 h-auto text-blue-600 hover:text-blue-700">
                    Czytaj więcej
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Załaduj Więcej Artykułów
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
