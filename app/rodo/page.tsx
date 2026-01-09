export const metadata = {
  title: "RODO – klauzula informacyjna",
  description: "Informacje o przetwarzaniu danych osobowych (RODO) dla serwisu wawerpolisy.pl.",
}

const ADMIN = {
  name: "Mateusz Pawelec",
  address: "ul. Rusinowska 7, 04-944 Warszawa",
  nip: "9211983228",
  email: "wawerpolisy@gmail.com",
}

export default function RODOPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Klauzula informacyjna RODO</h1>
        <p className="text-muted-foreground mb-10">
          Poniżej znajdziesz informacje wymagane przez art. 13 RODO w związku z przetwarzaniem danych osobowych w serwisie
          wawerpolisy.pl (formularze: kontakt, wycena, APK).
        </p>

        <div className="prose prose-slate max-w-none">
          <h2>1. Administrator danych</h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>{ADMIN.name}</strong>, {ADMIN.address}, NIP:{" "}
            {ADMIN.nip}. Kontakt: <strong>{ADMIN.email}</strong>.
          </p>

          <h2>2. Zakres danych</h2>
          <p>
            W zależności od formularza możemy przetwarzać dane takie jak: imię i nazwisko, telefon, e-mail oraz informacje
            niezbędne do przygotowania oferty ubezpieczeniowej (np. parametry pojazdu, nieruchomości, podróży lub firmy).
          </p>

          <h2>3. Cele i podstawy prawne</h2>
          <ul>
            <li>
              Kontakt na Twoją prośbę oraz odpowiedź na zapytanie (art. 6 ust. 1 lit. b RODO – działania przed zawarciem
              umowy / art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes polegający na obsłudze zapytań).
            </li>
            <li>
              Przygotowanie wyceny/oferty ubezpieczeniowej i obsługa procesu (art. 6 ust. 1 lit. b RODO).
            </li>
            <li>
              Realizacja obowiązków prawnych (np. księgowych) – jeśli dojdzie do zawarcia umowy i rozliczeń (art. 6 ust. 1
              lit. c RODO).
            </li>
            <li>
              Dochodzenie lub obrona roszczeń (art. 6 ust. 1 lit. f RODO).
            </li>
            <li>
              Jeśli wyrażasz dodatkową, odrębną zgodę (np. na kontakt marketingowy) – przetwarzanie w oparciu o zgodę (art.
              6 ust. 1 lit. a RODO).
            </li>
          </ul>

          <h2>4. Odbiorcy danych</h2>
          <p>Twoje dane mogą być przekazywane:</p>
          <ul>
            <li>towarzystwom ubezpieczeniowym i podmiotom współpracującym – w zakresie niezbędnym do przygotowania oferty,</li>
            <li>dostawcom usług IT (hosting, utrzymanie, poczta, narzędzia bezpieczeństwa) – jako podmiotom przetwarzającym,</li>
            <li>uprawnionym organom – gdy wynika to z przepisów prawa.</li>
          </ul>

          <h2>5. Okres przechowywania</h2>
          <ul>
            <li>dane z formularzy – co do zasady do czasu obsłużenia sprawy, a następnie przez okres potrzebny do obrony roszczeń,</li>
            <li>dane związane z rozliczeniami – przez okres wymagany przepisami prawa (np. podatkowymi/księgowymi).</li>
          </ul>

          <h2>6. Twoje prawa</h2>
          <p>Masz prawo do:</p>
          <ul>
            <li>dostępu do danych,</li>
            <li>sprostowania danych,</li>
            <li>usunięcia danych (gdy spełnione są przesłanki),</li>
            <li>ograniczenia przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania opartego o art. 6 ust. 1 lit. f RODO,</li>
            <li>cofnięcia zgody w dowolnym momencie (jeśli przetwarzanie odbywa się na podstawie zgody).</li>
          </ul>

          <h2>7. Skarga do organu nadzorczego</h2>
          <p>
            Jeśli uważasz, że przetwarzanie narusza przepisy, możesz złożyć skargę do Prezesa Urzędu Ochrony Danych
            Osobowych (UODO).
          </p>

          <h2>8. Dobrowolność podania danych</h2>
          <p>
            Podanie danych jest dobrowolne, ale konieczne do udzielenia odpowiedzi lub przygotowania oferty. Brak danych
            może uniemożliwić realizację Twojego zapytania.
          </p>

          <h2>9. Zautomatyzowane podejmowanie decyzji</h2>
          <p>Nie podejmujemy decyzji w sposób wyłącznie zautomatyzowany, w tym nie profilujemy Cię w rozumieniu RODO.</p>

          <p className="text-sm text-muted-foreground">
            Ostatnia aktualizacja: 2026-01-08
          </p>
        </div>
      </div>
    </div>
  )
}
