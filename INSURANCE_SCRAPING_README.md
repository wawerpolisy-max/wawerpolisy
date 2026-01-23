# 🚗 System Kalkulacji Ubezpieczeń - Proof of Concept

System automatycznej kalkulacji składek ubezpieczeniowych dla polskich towarzystw ubezpieczeniowych z wykorzystaniem web scrapingu.

## 🎯 Obecna wersja: POC (Proof of Concept)

### ✅ Zaimplementowane towarzystwa:
- **Link4** - Direct insurer
- **Uniqa** - 15% zniżki online
- **TUZ** - Towarzystwo Ubezpieczeń Zdrowotnych

### 📋 Roadmap (do implementacji):
- PZU
- Warta
- Generali
- Compensa
- Wiener
- Trasti
- Proama
- Allianz
- TUW

---

## 🚀 Quick Start

### 1. Instalacja (już zrobione!)
```bash
npm install puppeteer node-cache zod
```

### 2. API Endpoints

#### **GET** Lista dostępnych towarzystw
```bash
GET /api/insurance/calculate?action=companies
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": ["link4", "uniqa", "tuz"],
    "count": 3
  }
}
```

#### **POST** Kalkulacja dla jednego towarzystwa
```bash
POST /api/insurance/calculate
Content-Type: application/json

{
  "insuranceCompany": "link4",
  "vehicle": {
    "registrationNumber": "WA12345",
    "brand": "Volkswagen",
    "model": "Golf",
    "year": 2020,
    "engineCapacity": 1600,
    "fuelType": "benzyna"
  },
  "driver": {
    "age": 35,
    "drivingLicenseDate": "2005-06-15",
    "accidentHistory": 0
  },
  "options": {
    "ocOnly": false,
    "acIncluded": true,
    "assistance": true,
    "nnw": false,
    "acValue": 45000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "quote": {
      "company": "Link4",
      "ocPrice": 850,
      "acPrice": 1200,
      "totalPrice": 2050,
      "currency": "PLN",
      "paymentOptions": {
        "annual": 2050,
        "quarterly": 525,
        "monthly": 175
      },
      "calculatedAt": "2026-01-23T10:00:00.000Z",
      "validUntil": "2026-02-22T10:00:00.000Z"
    },
    "executionTime": 5234,
    "cached": false
  }
}
```

#### **POST** Kalkulacja dla wielu towarzystw
```bash
POST /api/insurance/calculate?multi=true
Content-Type: application/json

{
  "companies": ["link4", "uniqa", "tuz"],
  "vehicle": { ... },
  "driver": { ... },
  "options": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "success": true,
        "quote": {
          "company": "Link4",
          "totalPrice": 2050,
          ...
        }
      },
      {
        "success": true,
        "quote": {
          "company": "Uniqa",
          "totalPrice": 1980,
          ...
        }
      }
    ],
    "errors": [],
    "summary": {
      "total": 3,
      "successful": 3,
      "failed": 0
    }
  }
}
```

#### **GET** Statystyki cache
```bash
GET /api/insurance/calculate?action=stats
```

#### **POST** Wyczyść cache
```bash
POST /api/insurance/calculate?action=clearCache
```

---

## 💻 Użycie programistyczne

### Import w kodzie TypeScript/JavaScript

```typescript
import { 
  calculateInsurance, 
  calculateInMultipleCompanies,
  getAvailableCompanies 
} from '@/services/insurance-scrapers';

// Przykład 1: Pojedyncze towarzystwo
const result = await calculateInsurance({
  insuranceCompany: 'link4',
  vehicle: {
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
  },
  driver: {
    age: 35,
    drivingLicenseDate: new Date('2005-06-15'),
    accidentHistory: 0,
  },
  options: {
    acIncluded: true,
    acValue: 45000,
  },
});

console.log(result.quote?.totalPrice); // np. 2050

// Przykład 2: Wiele towarzystw
const results = await calculateInMultipleCompanies({
  vehicle: { ... },
  driver: { ... },
  options: { ... },
}, ['link4', 'uniqa', 'tuz']);

// Przykład 3: Lista dostępnych
const companies = getAvailableCompanies();
console.log(companies); // ['link4', 'uniqa', 'tuz']
```

### Użycie z fetch/axios

```typescript
// Frontend code
const response = await fetch('/api/insurance/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    insuranceCompany: 'link4',
    vehicle: { ... },
    driver: { ... },
    options: { ... },
  }),
});

const data = await response.json();
if (data.success) {
  console.log('Cena:', data.data.quote.totalPrice);
}
```

---

## 🗂️ Struktura projektu

```
/home/user/webapp/
├── services/
│   └── insurance-scrapers/
│       ├── types.ts              # Typy TypeScript
│       ├── cache.ts              # Cache layer (node-cache)
│       ├── index.ts              # Orchestrator
│       └── scrapers/
│           ├── link4.ts          # ✅ Link4 scraper
│           ├── uniqa.ts          # ✅ Uniqa scraper
│           └── tuz.ts            # ✅ TUZ scraper
├── app/api/insurance/
│   └── calculate/
│       └── route.ts              # Next.js API route
└── lib/
    └── insurance-utils.ts        # Utility functions
```

---

## 📊 Funkcje

### ✅ Zaimplementowane:
- ✅ Web scraping (Puppeteer)
- ✅ Cache layer (1 godzina TTL)
- ✅ 3 towarzystwa (Link4, Uniqa, TUZ)
- ✅ Next.js API routes
- ✅ TypeScript + Zod validation
- ✅ Multi-company kalkulacja
- ✅ Error handling
- ✅ Screenshots błędów (debug)

### 🚧 TODO:
- ⏳ Pozostałe 9 towarzystw
- ⏳ Queue system (Bull)
- ⏳ Rate limiting
- ⏳ Proxy rotation (jeśli potrzebne)
- ⏳ Monitoring + logging
- ⏳ Unit tests

---

## 🔧 Konfiguracja

### Cache TTL (Time To Live)
Domyślnie: **1 godzina** (3600 sekund)

Zmień w `services/insurance-scrapers/cache.ts`:
```typescript
const DEFAULT_TTL = 3600; // 1 godzina
```

### Headless Browser
Domyślnie: **headless: true**

Dla debugowania, zmień na `false` w plikach scraperów:
```typescript
this.browser = await puppeteer.launch({
  headless: false, // Pokaż przeglądarkę
  ...
});
```

---

## 🐛 Debugowanie

### Logi konsoli
Scrapers wypisują szczegółowe logi:
```
[Link4] Rozpoczynam kalkulację...
[Link4] Ładuję stronę kalkulatora...
[Link4] Wypełniam formularz...
[Link4] Obliczam składkę...
[Link4] ✅ Kalkulacja zakończona w 5234ms
```

### Screenshots błędów
W przypadku błędu, scraper zapisuje screenshot:
```
./logs/link4-error-1706012345678.png
```

Stwórz folder logs:
```bash
mkdir -p logs
```

---

## ⚠️ Ważne uwagi

### Prawne aspekty
- Web scraping znajduje się w **szarej strefie prawnej**
- Upewnij się, że przestrzegasz regulaminów stron TU
- Rozważ kontakt z TU w sprawie oficjalnego API

### Zmiany w strukturze stron
- Strony TU mogą zmieniać strukturę HTML
- Selektory CSS wymagają okresowej aktualizacji
- Scrapers są podatne na redesign stron

### Performance
- Scraping jest **wolny** (3-10 sekund/towarzystwo)
- Cache znacznie przyspiesza powtarzalne zapytania
- Rozważ asynchroniczną kolejkę dla wielu kalkulacji

### Blokowanie IP
- Niektóre TU mogą blokować zbyt częste requesty
- Rozważ proxy rotation dla dużej skali
- Rate limiting zalecany

---

## 📞 Support

Problemy? Sprawdź:
1. Czy Puppeteer się uruchomił (wymaga Chrome/Chromium)
2. Czy selektory CSS są aktualne
3. Czy strona TU działa normalnie
4. Sprawdź screenshots w `./logs/`

---

## 🚀 Następne kroki

1. **Testowanie** - Przetestuj obecne 3 towarzystwa
2. **Dodaj kolejne** - Implementuj scrapers dla PZU, Warta, etc.
3. **Hosting** - Rozważ VPS (Hetzner ~22 PLN/miesiąc)
4. **Produkcja** - Dodaj monitoring, error tracking
5. **Skalowanie** - Queue system, worker processes

---

**Wersja:** 1.0.0-POC  
**Data:** 2026-01-23  
**Licencja:** Proprietary
