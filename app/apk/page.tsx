import { APKForm } from "@/components/forms/apk-form"

export const metadata = {
  title: "Analiza Potrzeb Klienta (APK) | UW",
  description: "Wypełnij formularz analizy potrzeb klienta, aby otrzymać spersonalizowaną ofertę ubezpieczeniową.",
}

export default function APKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">
              Dobierzmy najlepszą ochronę dla Ciebie (APK)
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Krótka ankieta, która pozwoli mi porównać oferty 10+ towarzystw i wybrać tę najkorzystniejszą.
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg text-left mt-8">
              <h2 className="text-lg font-semibold mb-2 text-primary">Czym jest APK?</h2>
              <p className="text-muted-foreground mb-4">
                Analiza Potrzeb Klienta (APK) to profesjonalne narzędzie, które pozwala mi dokładnie poznać Twoją
                sytuację życiową, finansową i oczekiwania. Dzięki temu mogę dopasować ofertę ubezpieczeniową idealnie do
                Twoich potrzeb.
              </p>
              <h3 className="text-lg font-semibold mb-2 text-primary">Po co jest potrzebne APK?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Otrzymasz ofertę dopasowaną do Twojej sytuacji, a nie standardowy pakiet</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Porównam dla Ciebie oferty wielu towarzystw ubezpieczeniowych</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Zaoszczędzisz czas i pieniądze dzięki profesjonalnej analizie</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Unikniesz niedoubezpieczenia lub przepłacania za niepotrzebne opcje</span>
                </li>
              </ul>
            </div>
          </div>

          <APKForm />
        </div>
      </div>
    </div>
  )
}
