export const metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności serwisu wawerpolisy.pl.",
}

const ADMIN = {
  name: "Mateusz Pawelec",
  address: "ul. Rusinowska 7, 04-944 Warszawa",
  nip: "9211983228",
  email: "wawerpolisy@gmail.com",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Polityka prywatności</h1>
        <p className="text-muted-foreground mb-10">
          Ten dokument opisuje zasady przetwarzania danych osobowych i korzystania z plików cookies w serwisie
          wawerpolisy.pl.
        </p>

        <div className="prose prose-slate max-w-none">
          <h2>1. Administrator</h2>
          <p>
            Administratorem danych jest <strong>{ADMIN.name}</strong>, {ADMIN.address}, NIP: {ADMIN.nip}. Kontakt:{" "}
            <strong>{ADMIN.email}</strong>.
          </p>

          <h2>2. Jakie dane zbieramy</h2>
          <ul>
            <li>dane podawane w formularzach (kontakt, wycena, APK),</li>
            <li>dane techniczne (np. adres IP, typ przeglądarki) – wyłącznie w celach bezpieczeństwa i statystyki,</li>
            <li>pliki cookies niezbędne do działania strony.</li>
          </ul>

          <h2>3. Cele przetwarzania</h2>
          <ul>
            <li>obsługa zapytań i przygotowanie ofert ubezpieczeniowych,</li>
            <li>kontakt zwrotny,</li>
            <li>bezpieczeństwo serwisu (np. ograniczanie spamu, logi),</li>
            <li>statystyka i analityka (jeśli włączona) – w celu ulepszania serwisu.</li>
          </ul>

          <h2>4. Podstawy prawne</h2>
          <p>
            Dane przetwarzamy na podstawie art. 6 ust. 1 lit. b, c, f RODO (oraz lit. a, jeśli wyrażysz odrębną zgodę).
            Szczegóły znajdziesz w <strong>RODO</strong>.
          </p>

          <h2>5. Odbiorcy danych</h2>
          <p>
            Możemy korzystać z usług podmiotów przetwarzających (np. hosting, narzędzia do wysyłki e-mail, analityka).
            Podmioty te przetwarzają dane wyłącznie na nasze polecenie i w zakresie niezbędnym do świadczenia usług.
          </p>

          <h2>6. Cookies</h2>
          <p>Serwis może wykorzystywać pliki cookies:</p>
          <ul>
            <li>
              niezbędne – zapewniające poprawne działanie serwisu (np. nawigacja, bezpieczeństwo),
            </li>
            <li>
              analityczne – jeżeli są używane narzędzia statystyczne, pomagają zrozumieć jak użytkownicy korzystają ze
              strony.
            </li>
          </ul>
          <p>
            Możesz zarządzać cookies w ustawieniach swojej przeglądarki. Wyłączenie cookies może wpłynąć na działanie
            serwisu.
          </p>

          <h2>7. Okres przechowywania</h2>
          <p>
            Dane przechowujemy przez czas potrzebny do obsługi sprawy i ewentualnej obrony roszczeń, a dane rozliczeniowe
            – przez okres wymagany przepisami.
          </p>

          <h2>8. Prawa użytkownika</h2>
          <p>
            Masz prawa opisane w RODO (dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw, skarga do
            UODO).
          </p>

          <h2>9. Bezpieczeństwo</h2>
          <p>
            Stosujemy środki organizacyjne i techniczne adekwatne do ryzyka (m.in. ograniczanie spamu, podstawowe logi
            bezpieczeństwa). Pamiętaj jednak, że żadna transmisja danych przez Internet nie jest w 100% wolna od ryzyka.
          </p>

          <p className="text-sm text-muted-foreground">Ostatnia aktualizacja: 2026-01-08</p>
        </div>
      </div>
    </div>
  )
}
