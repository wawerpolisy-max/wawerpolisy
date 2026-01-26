# 🔗 Integracja z n8n - Insurance Scraping API

## 📋 Przegląd

System Insurance Scraping API można łatwo zintegrować z n8n (lub innymi narzędziami no-code) poprzez zwykłe HTTP requesty.

---

## 🌐 **API Endpoint**

### **Produkcyjny URL** (po deploymencie):
```
https://your-domain.com/api/insurance/calculate
```

### **Lokalny URL** (development):
```
http://localhost:3000/api/insurance/calculate
```

### **Sandbox URL** (aktualny test):
```
https://3000-itx8ca6bsyxi8sd21vhvi-d0b9e1e2.sandbox.novita.ai/api/insurance/calculate
```

---

## 🎯 **Dostępne Endpoints**

### 1. **Lista dostępnych towarzystw**
```http
GET /api/insurance/calculate?action=companies
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": ["pzu", "generali", "uniqa"],
    "count": 3
  }
}
```

---

### 2. **Kalkulacja dla jednego towarzystwa**
```http
POST /api/insurance/calculate
Content-Type: application/json

{
  "insuranceCompany": "pzu",
  "vehicle": {
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

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "quote": {
      "company": "PZU",
      "ocPrice": 850,
      "acPrice": 1200,
      "totalPrice": 2050,
      "currency": "PLN",
      "paymentOptions": {
        "annual": 2050,
        "quarterly": 525,
        "monthly": 175
      },
      "calculatedAt": "2026-01-23T12:00:00.000Z",
      "validUntil": "2026-02-22T12:00:00.000Z"
    },
    "executionTime": 15234,
    "cached": false
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "PZU scraping failed: timeout"
}
```

---

### 3. **Kalkulacja dla wielu towarzystw**
```http
POST /api/insurance/calculate?multi=true
Content-Type: application/json

{
  "companies": ["pzu", "generali", "uniqa"],
  "vehicle": {
    "brand": "Volkswagen",
    "model": "Golf",
    "year": 2020
  },
  "driver": {
    "age": 35,
    "drivingLicenseDate": "2005-06-15",
    "accidentHistory": 0
  },
  "options": {
    "acIncluded": true,
    "acValue": 45000
  }
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
          "company": "PZU",
          "totalPrice": 2050,
          ...
        }
      },
      {
        "success": true,
        "quote": {
          "company": "Generali",
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

---

### 4. **Statystyki cache**
```http
GET /api/insurance/calculate?action=stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keys": 5,
    "stats": {
      "hits": 12,
      "misses": 5,
      "keys": 5
    }
  }
}
```

---

### 5. **Wyczyść cache**
```http
POST /api/insurance/calculate?action=clearCache
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

---

## 🔧 **Konfiguracja w n8n**

### **Krok 1: Dodaj HTTP Request node**

1. Otwórz n8n workflow
2. Dodaj node **HTTP Request**
3. Skonfiguruj:

**Dla listy towarzystw:**
```
Method: GET
URL: https://your-domain.com/api/insurance/calculate?action=companies
```

**Dla kalkulacji:**
```
Method: POST
URL: https://your-domain.com/api/insurance/calculate
Body Content Type: JSON
Body:
{
  "insuranceCompany": "{{ $json.company }}",
  "vehicle": {
    "brand": "{{ $json.vehicle.brand }}",
    "model": "{{ $json.vehicle.model }}",
    "year": {{ $json.vehicle.year }}
  },
  "driver": {
    "age": {{ $json.driver.age }},
    "drivingLicenseDate": "{{ $json.driver.licenseDate }}",
    "accidentHistory": {{ $json.driver.accidents }}
  },
  "options": {
    "acIncluded": {{ $json.options.ac }},
    "acValue": {{ $json.options.acValue }}
  }
}
```

---

### **Krok 2: Parse Response**

Dodaj node **Set** lub **Code** do parsowania odpowiedzi:

```javascript
// Extract price from response
const data = $input.first().json;

if (data.success && data.data.quote) {
  return {
    company: data.data.quote.company,
    totalPrice: data.data.quote.totalPrice,
    ocPrice: data.data.quote.ocPrice,
    acPrice: data.data.quote.acPrice,
    cached: data.data.cached,
    executionTime: data.data.executionTime
  };
} else {
  throw new Error(data.error || 'Unknown error');
}
```

---

### **Krok 3: Loop przez towarzystwa** (opcjonalnie)

**Node 1: Function** - Lista towarzystw
```javascript
return [
  { company: 'pzu' },
  { company: 'generali' },
  { company: 'uniqa' }
];
```

**Node 2: Split In Batches**
- Batch Size: 1

**Node 3: HTTP Request** - Kalkulacja dla każdego

**Node 4: Merge** - Zbierz wyniki

---

## 📊 **Przykładowy Workflow n8n**

```
┌─────────────┐
│   Webhook   │  ← Trigger (dane klienta)
└──────┬──────┘
       │
┌──────▼──────────────┐
│  Set Variables      │  ← Przygotuj dane
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Function           │  ← Lista towarzystw
│  [pzu, generali,    │
│   uniqa]            │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Split In Batches   │  ← Po jednym na raz
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  HTTP Request       │  ← Kalkulacja API
│  POST /calculate    │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Parse Response     │  ← Wyciągnij ceny
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Loop Over Items    │  ← Powtórz dla każdego
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Merge              │  ← Zbierz wyniki
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Sort by Price      │  ← Sortuj (najtańsza)
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Send Email/SMS     │  ← Wyślij ofertę
└─────────────────────┘
```

---

## ⚡ **Optymalizacja Performance**

### **Problem: Scraping jest wolny** (10-90 sekund/towarzystwo)

### **Rozwiązania:**

#### **1. Multi-company endpoint** (równoległy)
```http
POST /api/insurance/calculate?multi=true
```
Wszystkie towarzystwa scrape'ują się równocześnie.

**Czas:**
- Sequentially: 3 × 30s = 90s
- Parallel: max(30s, 25s, 28s) = 30s

#### **2. Cache** (już zaimplementowany)
Identyczne zapytania zwracają natychmiast z cache (< 0.2s)

**TTL:** 1 godzina (configurable)

#### **3. Webhook callback** (asynchroniczny)
Zamiast czekać na wynik:
1. n8n wywołuje API
2. API zwraca `requestId`
3. Scraping dzieje się w tle
4. API wywołuje webhook n8n z wynikiem

---

## 🔐 **Autoryzacja** (opcjonalnie)

Jeśli chcesz zabezpieczyć API:

### **Option 1: API Key**
```javascript
// W Next.js API route
const apiKey = request.headers.get('x-api-key');
if (apiKey !== process.env.API_KEY) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**W n8n:**
```
HTTP Request Node:
Headers:
  x-api-key: your-secret-api-key
```

### **Option 2: Bearer Token**
```
Headers:
  Authorization: Bearer your-jwt-token
```

---

## 📈 **Monitoring & Logs**

### **Sprawdź status kalkulacji:**
```javascript
// W n8n Code node
const response = $input.first().json;

console.log('Execution time:', response.data.executionTime, 'ms');
console.log('From cache:', response.data.cached);
console.log('Price:', response.data.quote.totalPrice, 'PLN');
```

### **Error handling:**
```javascript
if (!response.success) {
  console.error('Error:', response.error);
  // Wyślij alert, retry, fallback
}
```

---

## ⏱️ **Timeouts**

**Domyślnie:**
- Scraping timeout: 30s
- HTTP timeout w n8n: 60s (ustawialny)

**Jeśli potrzeba dłużej:**
W n8n HTTP Request node:
```
Timeout: 120000 (2 minuty)
```

---

## 🧪 **Testowanie**

### **cURL:**
```bash
curl -X POST "https://your-domain.com/api/insurance/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "insuranceCompany": "pzu",
    "vehicle": {
      "brand": "Volkswagen",
      "model": "Golf",
      "year": 2020
    },
    "driver": {
      "age": 35,
      "drivingLicenseDate": "2005-06-15",
      "accidentHistory": 0
    },
    "options": {
      "acIncluded": true,
      "acValue": 45000
    }
  }'
```

### **Postman:**
1. Import collection (można stworzyć)
2. Set environment variables
3. Test endpoints

### **n8n Test:**
1. Create simple workflow
2. Use "Execute Workflow" button
3. Check output

---

## 💡 **Best Practices**

### ✅ **DO:**
- Użyj multi-company endpoint dla wielu towarzystw
- Implementuj retry logic (3 attempts)
- Cache wyniki dla identycznych zapytań
- Monitoruj execution time
- Log errors dla analizy

### ❌ **DON'T:**
- Nie rób 10+ requestów sekwencyjnie (użyj multi)
- Nie scrape'uj tego samego co minutę (cache!)
- Nie ignoruj błędów (handle them)
- Nie używaj zbyt krótkich timeoutów (min 30s)

---

## 🚀 **Deployment**

### **Opcja A: Vercel** (Frontend + API)
```bash
vercel deploy
```
Ale: Puppeteer może być problematyczny na Vercel (limity)

### **Opcja B: Hetzner VPS** (Recommended)
```bash
# Na VPS:
git clone repo
npm install
npm run build
pm2 start npm --name "insurance-api" -- start
```

### **Opcja C: Hybrid**
- Vercel: Frontend
- VPS: Scraping API (osobny service)

---

## 📞 **Support & Troubleshooting**

### **Problem: Timeout**
- Zwiększ timeout w n8n
- Sprawdź czy VPS ma dość zasobów
- Użyj cache dla powtarzających się zapytań

### **Problem: Błędne ceny**
- Selektory CSS mogą się zmienić
- Sprawdź screenshots w `./logs/`
- Zaktualizuj scrapers

### **Problem: 500 Error**
- Sprawdź logs Next.js
- Sprawdź czy Puppeteer ma potrzebne biblioteki
- Restart serwera

---

## 📝 **Changelog**

### v1.0.0 (2026-01-23)
- ✅ Initial release
- ✅ 3 towarzystwa: PZU, Generali, Uniqa
- ✅ Cache layer (1h TTL)
- ✅ Multi-company support
- ✅ Error handling
- ✅ n8n ready

---

**API jest gotowe do integracji z n8n!** 🎉

**Public URL (sandbox):**
```
https://3000-itx8ca6bsyxi8sd21vhvi-d0b9e1e2.sandbox.novita.ai/api/insurance/calculate
```

**Ważność:** ~1 godzina (sandbox lifetime)

**Po deployu produkcyjnym:** Będziesz miał stały URL.
