export const metadata = {
  title: "Regulamin serwisu",
  description: "Regulamin korzystania z serwisu wawerpolisy.pl.",
}

const OWNER = {
  name: "Mateusz Pawelec",
  address: "ul. Rusinowska 7, 04-944 Warszawa",
  nip: "9211983228",
  email: "wawerpolisy@gmail.com",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Regulamin serwisu wawerpolisy.pl</h1>
        <p className="text-muted-foreground mb-10">
          Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem wawerpolisy.pl.
        </p>

        <div className="prose prose-slate max-w-none">
          <h2>1. Dane usługodawcy</h2>
          <p>
            Usługodawcą jest <strong>{OWNER.name}</strong>, {OWNER.address}, NIP: {OWNER.nip}. Kontakt:{" "}
            <strong>{OWNER.email}</strong>.
          </p>

          <h2>2. Definicje</h2>
          <ul>
            <li>
              <strong>Serwis</strong> – strona internetowa dostępna pod adresem wawerpolisy.pl.
            </li>
            <li>
              <strong>Użytkownik</strong> – osoba korzystająca z Serwisu.
            </li>
            <li>
              <strong>Formularze</strong> – funkcjonalności umożliwiające kontakt, prośbę o wycenę lub przesłanie danych
              (APK).
            </li>
          </ul>

          <h2>3. Zakres i zasady korzystania</h2>
          <ul>
            <li>Serwis ma charakter informacyjny oraz umożliwia przesyłanie zapytań i danych potrzebnych do wyceny.</li>
            <li>Użytkownik zobowiązuje się do podawania danych prawdziwych i aktualnych.</li>
            <li>Zabronione jest dostarczanie treści bezprawnych.</li>
          </ul>

          <h2>4. Wyceny i oferta</h2>
          <p>
            Informacje w Serwisie nie stanowią wiążącej oferty w rozumieniu Kodeksu cywilnego. Wycena przygotowywana jest
            na podstawie danych przekazanych przez Użytkownika i może wymagać doprecyzowania.
          </p>

          <h2>5. Odpowiedzialność</h2>
          <ul>
            <li>Usługodawca dokłada starań, aby Serwis działał poprawnie, ale nie gwarantuje ciągłości działania.</li>
            <li>
              Usługodawca nie ponosi odpowiedzialności za przerwy spowodowane czynnikami niezależnymi (np. awarie
              dostawców usług).
            </li>
          </ul>

          <h2>6. Prawa autorskie</h2>
          <p>
            Treści zamieszczone w Serwisie (teksty, grafiki, znaki) są chronione prawem autorskim. Kopiowanie bez zgody
            Usługodawcy jest zabronione, poza dozwolonym użytkiem.
          </p>

          <h2>7. Dane osobowe</h2>
          <p>
            Zasady przetwarzania danych osobowych opisuje <strong>Polityka prywatności</strong> oraz <strong>RODO</strong>
            .
          </p>

          <h2>8. Zmiany regulaminu</h2>
          <p>
            Usługodawca może zmienić Regulamin z ważnych powodów (np. zmiana przepisów lub funkcjonalności Serwisu).
            Aktualna wersja Regulaminu jest publikowana w Serwisie.
          </p>

          <p className="text-sm text-muted-foreground">Ostatnia aktualizacja: 2026-01-08</p>
        </div>
      </div>
    </div>
  )
}
