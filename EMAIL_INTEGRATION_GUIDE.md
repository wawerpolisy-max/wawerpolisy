# Integracja Email → n8n → Kalkulacje

## Cel
Automatycznie przetwarzać wypełnione formularze APK (Wniosek o Polisę Komunikacyjną) z emaili i generować oferty z różnych towarzystw.

---

## PRZEPŁYW DANYCH

```
┌─────────────────┐
│  Klient         │
│  wypełnia APK   │
│  na stronie     │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Email          │
│  z danymi APK   │
│  → Gmail        │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  n8n Workflow   │
│  1. Gmail Trigger│
│  2. Parse APK   │
│  3. Wywołaj API │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Nasze API      │
│  /api/insurance │
│  /calculate     │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Scrapers       │
│  PZU, Generali, │
│  Uniqa          │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Email          │
│  z ofertami     │
│  → Klient       │
└─────────────────┘
```

---

## KROK 1: Sprawdź format emaila z APK

### Pytania:
1. **Skąd przychodzą emaile z APK?**
   - Ze strony www (formularz kontaktowy)?
   - Z systemu CRM?
   - Z innego narzędzia?

2. **W jakim formacie są dane?**
   - Zwykły tekst?
   - HTML?
   - Załącznik PDF?
   - JSON w treści?

3. **Przykład emaila** - czy możesz pokazać jak wygląda?

### Przykładowy format (który zakładam):
```
Subject: Nowe zapytanie o OC/AC

Imię i nazwisko: Jan Kowalski
Email: jan.kowalski@example.com
Telefon: +48 123 456 789

Dane pojazdu:
- Marka: Volkswagen
- Model: Golf
- Rok produkcji: 2020
- Numer rejestracyjny: WA12345
- VIN: WVWZZZ1KZBW123456
- Pojemność silnika: 1600 cm³
- Moc: 110 KM

Dane kierowcy:
- Data urodzenia: 15.06.1988
- Data wydania prawa jazdy: 20.05.2005
- Liczba lat bez szkód: 10

Opcje:
- AC: Tak
- Wartość pojazdu: 45000 PLN
- Assistance: Tak
```

---

## KROK 2: n8n Gmail Trigger

### Konfiguracja Gmail Trigger:

1. **W n8n dodaj node:**
   - `Gmail Trigger` → "On New Email"

2. **Połącz Gmail:**
   - Credentials → Google OAuth2
   - Zezwól na dostęp do Gmail

3. **Filtr emaili:**
   ```
   Label/Folder: "APK" lub "Wnioski"
   From: your-website-form@example.com
   Subject contains: "APK" lub "OC/AC"
   ```

4. **Opcje:**
   - Mark as Read: Yes (po przetworzeniu)
   - Download Attachments: Yes (jeśli są PDFy)

---

## KROK 3: Parse danych z emaila

### Node: "Extract from Email" (Function)

```javascript
// n8n Function Node - Parse APK Email
const emailBody = $input.item.json.body;

// Przykładowa funkcja parsująca
function parseAPK(text) {
  // Regex patterns dla polskich danych
  const patterns = {
    name: /(?:Imię i nazwisko|Nazwisko):\s*(.+)/i,
    email: /(?:Email|E-mail):\s*([^\s]+)/i,
    phone: /(?:Telefon|Tel):\s*([\d\s\+\-]+)/i,
    
    // Pojazd
    brand: /(?:Marka):\s*(.+)/i,
    model: /(?:Model):\s*(.+)/i,
    year: /(?:Rok produkcji|Rocznik):\s*(\d{4})/i,
    registration: /(?:Numer rejestracyjny|Rejestracja):\s*([A-Z0-9]+)/i,
    vin: /(?:VIN|Numer VIN):\s*([A-Z0-9]{17})/i,
    engineCapacity: /(?:Pojemność silnika):\s*(\d+)/i,
    enginePower: /(?:Moc):\s*(\d+)/i,
    
    // Kierowca
    birthDate: /(?:Data urodzenia):\s*([\d\.\-\/]+)/i,
    licenseDate: /(?:Data wydania prawa jazdy|Prawo jazdy):\s*([\d\.\-\/]+)/i,
    
    // Opcje
    acValue: /(?:Wartość pojazdu|AC):\s*([\d\s]+)/i,
  };
  
  const result = {};
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      result[key] = match[1].trim();
    }
  }
  
  return result;
}

// Parse
const parsed = parseAPK(emailBody);

// Format dla naszego API
const apiRequest = {
  vehicle: {
    brand: parsed.brand || "Volkswagen",
    model: parsed.model || "Golf",
    year: parseInt(parsed.year) || 2020,
    registrationNumber: parsed.registration,
    vin: parsed.vin,
    engineCapacity: parseInt(parsed.engineCapacity),
    enginePower: parseInt(parsed.enginePower)
  },
  driver: {
    age: calculateAge(parsed.birthDate),
    drivingLicenseDate: formatDate(parsed.licenseDate),
    accidentHistory: 0 // domyślnie
  },
  options: {
    acIncluded: parsed.acValue ? true : false,
    acValue: parseInt(parsed.acValue?.replace(/\s/g, '')) || 0,
    assistanceIncluded: true
  },
  customer: {
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone
  }
};

// Helper functions
function calculateAge(birthDateStr) {
  const parts = birthDateStr.split(/[\.\-\/]/);
  const birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateStr) {
  const parts = dateStr.split(/[\.\-\/]/);
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

return {
  json: {
    apiRequest,
    customer: apiRequest.customer
  }
};
```

---

## KROK 4: Wywołaj API dla wielu towarzystw

### Node: "HTTP Request" (Loop)

To już mamy w workflow! 
- `Split In Batches` dla 3 towarzystw
- `HTTP Request` do naszego API
- `Merge` wyników

---

## KROK 5: Wyślij ofertę do klienta

### Node: "Gmail" - Send Email

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #0066cc; color: white; padding: 20px; }
    .quote { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
    .best { background: #e6f3ff; border: 2px solid #0066cc; }
    .price { font-size: 24px; font-weight: bold; color: #0066cc; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Twoje Oferty Ubezpieczenia</h1>
  </div>
  
  <p>Witaj {{ $json.customer.name }}!</p>
  
  <p>Przygotowaliśmy dla Ciebie oferty ubezpieczenia OC/AC dla pojazdu:</p>
  <p><strong>{{ $json.vehicle.brand }} {{ $json.vehicle.model }} ({{ $json.vehicle.year }})</strong></p>
  
  <h2>🏆 Najlepsza oferta:</h2>
  <div class="quote best">
    <h3>{{ $json.quotes[0].company.toUpperCase() }}</h3>
    <div class="price">{{ $json.quotes[0].totalPrice }} PLN</div>
    <ul>
      <li>OC: {{ $json.quotes[0].ocPrice }} PLN</li>
      <li>AC: {{ $json.quotes[0].acPrice }} PLN</li>
      <li>Assistance: ✓</li>
    </ul>
  </div>
  
  <h2>Pozostałe oferty:</h2>
  {{ for quote in $json.quotes.slice(1) }}
  <div class="quote">
    <h3>{{ quote.company.toUpperCase() }}</h3>
    <div class="price">{{ quote.totalPrice }} PLN</div>
    <p>Drożej o: {{ quote.totalPrice - $json.quotes[0].totalPrice }} PLN</p>
  </div>
  {{ endfor }}
  
  <p><strong>Oszczędzasz:</strong> Do {{ $json.savings }} PLN rocznie!</p>
  
  <p>
    Aby sfinalizować polisę, skontaktuj się z nami:<br>
    📞 <strong>+48 123 456 789</strong><br>
    ✉️ <strong>kontakt@wawerpolisy.pl</strong>
  </p>
  
  <p>Pozdrawiamy,<br>Zespół WawerPolisy</p>
</body>
</html>
```

---

## KROK 6: Testowanie end-to-end

### Test manualny:
1. **Wyślij testowy email** do swojego Gmail z danymi APK
2. **Sprawdź n8n** - czy workflow się uruchomił?
3. **Sprawdź logi** - czy parsing działa?
4. **Sprawdź API** - czy wywołało nasze scrapers?
5. **Sprawdź email** - czy otrzymałeś oferty?

### Webhook test (alternatywa):
Jeśli formularz na stronie wysyła POST, użyj n8n Webhook zamiast Gmail:

```javascript
// n8n Webhook node
// URL: https://wawerpolisy.app.n8n.cloud/webhook/apk-submit

// Formularz HTML wysyła:
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "vehicle": { ... },
  "driver": { ... }
}

// Webhook odbiera i przekazuje dalej do API
```

---

## OPCJE INTEGRACJI

### Opcja A: Gmail Trigger (zalecana jeśli formularz wysyła email)
✅ Prosta konfiguracja
✅ Nie wymaga zmian w formularzu
✅ Automatyczne archiwizowanie
❌ Opóźnienie (1-5 min)

### Opcja B: Webhook (zalecana jeśli kontrolujesz formularz)
✅ Natychmiastowa reakcja
✅ Strukturowane dane (JSON)
✅ Walidacja formularza
❌ Wymaga zmiany formularza

### Opcja C: Zapier/Make.com (jeśli używasz innych narzędzi)
✅ Łatwa integracja z CRM
✅ Gotowe szablony
❌ Dodatkowy koszt

---

## PYTANIA DO CIEBIE

1. **Skąd przychodzą dane APK?**
   - [ ] Formularz na stronie → Email
   - [ ] Formularz na stronie → Webhook
   - [ ] System CRM
   - [ ] Inne: ___________

2. **Czy masz dostęp do skrzynki Gmail?**
   - [ ] Tak, mogę połączyć z n8n
   - [ ] Nie, ale mogę stworzyć nową
   - [ ] Używam innego email (Outlook, custom)

3. **Czy mogę zmienić formularz na stronie?**
   - [ ] Tak, mogę wysyłać POST do webhooka
   - [ ] Nie, formularz wysyła tylko email

4. **Przykład danych:**
   - Czy możesz pokazać przykładowy email z APK?
   - Lub strukturę JSON z formularza?

---

## CO DALEJ?

Odpowiedz na pytania powyżej, a ja:
1. Zaktualizuję n8n workflow pod Twój format danych
2. Dodam node do parsowania emaili/webhooków
3. Przetestuję end-to-end
4. Wdrożę na produkcję

**Gotowy na następny krok?** 😊
