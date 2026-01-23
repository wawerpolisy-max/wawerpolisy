# 🎯 Automatyzacja Ubezpieczeń w n8n - KROK PO KROKU

## 📋 SPIS TREŚCI
1. [Przygotowanie](#przygotowanie)
2. [Import Workflow do n8n](#import-workflow)
3. [Konfiguracja Node'ów](#konfiguracja)
4. [Testowanie](#testowanie)
5. [Produkcja](#produkcja)
6. [Troubleshooting](#troubleshooting)

---

## 🛠️ KROK 1: PRZYGOTOWANIE

### **Co potrzebujesz:**
- ✅ Konto n8n (self-hosted lub cloud)
- ✅ Działające API Insurance (z tego projektu)
- ✅ URL do API (sandbox lub produkcyjny)
- ✅ Konto email do wysyłki (Gmail, SMTP, Resend, etc.)

### **URL API:**
```
Sandbox (test): https://3000-itx8ca6bsyxi8sd21vhvi-d0b9e1e2.sandbox.novita.ai
Produkcja: https://your-domain.com
```

---

## 📥 KROK 2: IMPORT WORKFLOW DO N8N

### **Metoda A: Import z JSON**

1. **Pobierz plik workflow:**
   - Plik: `n8n-workflow-insurance.json`
   - Lokalizacja: `/home/user/webapp/n8n-workflow-insurance.json`

2. **Otwórz n8n:**
   ```
   https://your-n8n-instance.com
   ```

3. **Zaimportuj workflow:**
   - Kliknij **"+"** (New Workflow)
   - Kliknij **"..."** (menu)
   - Wybierz **"Import from File"**
   - Wybierz plik `n8n-workflow-insurance.json`
   - Kliknij **"Import"**

### **Metoda B: Manualne tworzenie** (jeśli import nie działa)

Przejdź do [KROK 3](#manual-creation) poniżej.

---

## ⚙️ KROK 3: KONFIGURACJA NODE'ÓW

Po imporcie musisz skonfigurować kilka rzeczy:

### **NODE 1: Webhook - Dane Klienta** 

**Typ:** `Webhook` (Trigger)

**Konfiguracja:**
```
HTTP Method: POST
Path: insurance-quote
Response Mode: Last Node
```

**Co robi:**
- Odbiera dane klienta (pojazd, kierowca, opcje)
- Trigger dla całego workflow

**Endpoint URL:**
```
https://your-n8n.com/webhook/insurance-quote
```

**Przykładowy Request:**
```json
{
  "vehicle": {
    "brand": "Volkswagen",
    "model": "Golf",
    "year": 2020
  },
  "driver": {
    "age": 35,
    "drivingLicenseDate": "2005-06-15"
  },
  "options": {
    "acValue": 45000
  },
  "clientEmail": "klient@example.com"
}
```

---

### **NODE 2: Przygotuj Dane**

**Typ:** `Set` (Transform)

**Konfiguracja:**
- Wyciąga dane z webhook body
- Normalizuje format

**Mapowanie:**
```javascript
company: ={{ $json.body.insuranceCompany || 'pzu' }}
vehicleBrand: ={{ $json.body.vehicle.brand }}
vehicleModel: ={{ $json.body.vehicle.model }}
vehicleYear: ={{ $json.body.vehicle.year }}
driverAge: ={{ $json.body.driver.age }}
licenseDate: ={{ $json.body.driver.drivingLicenseDate }}
acValue: ={{ $json.body.options.acValue }}
clientEmail: ={{ $json.body.clientEmail }}
```

---

### **NODE 3: Przygotuj Requesty dla TU**

**Typ:** `Function` (Code)

**Konfiguracja:**
```javascript
// Lista towarzystw do sprawdzenia
const companies = ['pzu', 'generali', 'uniqa'];

// Przygotuj dane pojazdu
const vehicle = {
  brand: $input.first().json.vehicleBrand,
  model: $input.first().json.vehicleModel,
  year: parseInt($input.first().json.vehicleYear)
};

// Przygotuj dane kierowcy
const driver = {
  age: parseInt($input.first().json.driverAge),
  drivingLicenseDate: $input.first().json.licenseDate,
  accidentHistory: 0
};

// Opcje ubezpieczenia
const options = {
  acIncluded: true,
  acValue: parseInt($input.first().json.acValue || 45000)
};

// Zwróć tablicę requestów dla każdego towarzystwa
return companies.map(company => ({
  json: {
    insuranceCompany: company,
    vehicle: vehicle,
    driver: driver,
    options: options,
    clientEmail: $input.first().json.clientEmail
  }
}));
```

**Co robi:**
- Tworzy 3 osobne requesty (dla PZU, Generali, Uniqa)
- Każdy request ma te same dane klienta

---

### **NODE 4: Pętla po Towarzystwach**

**Typ:** `Split In Batches` (Loop)

**Konfiguracja:**
```
Batch Size: 1
```

**Co robi:**
- Przetwarza po jednym towarzystwie na raz
- Umożliwia iterację przez wszystkie 3 TU

---

### **NODE 5: Wywołaj API Insurance** ⚠️ **WAŻNE - TUTAJ ZMIEŃ URL!**

**Typ:** `HTTP Request`

**Konfiguracja:**
```
URL: https://3000-itx8ca6bsyxi8sd21vhvi-d0b9e1e2.sandbox.novita.ai/api/insurance/calculate
Method: POST
Authentication: None
Content Type: JSON
Timeout: 90000 (90 sekund)

Body Parameters (JSON):
={{ JSON.stringify($json) }}
```

**⚠️ ZMIEŃ URL NA SWÓJ:**
- Sandbox (test): `https://3000-itx8ca6bsyxi8sd21vhvi-d0b9e1e2.sandbox.novita.ai/api/insurance/calculate`
- Produkcja: `https://your-domain.com/api/insurance/calculate`

**Co robi:**
- Wysyła request do naszego API
- Czeka max 90 sekund na odpowiedź (scraping)
- Zwraca cenę OC/AC

---

### **NODE 6: Sprawdź czy sukces**

**Typ:** `IF` (Condition)

**Konfiguracja:**
```
Condition: Boolean
Value 1: ={{ $json.success }}
Operation: Equal
Value 2: true
```

**Co robi:**
- Sprawdza czy API zwróciło sukces
- Jeśli TAK → przejdź dalej
- Jeśli NIE → pomiń (error handling)

---

### **NODE 7: Wyciągnij Cenę**

**Typ:** `Set` (Transform)

**Konfiguracja:**
```
company: ={{ $json.data.quote.company }}
ocPrice: ={{ $json.data.quote.ocPrice }}
acPrice: ={{ $json.data.quote.acPrice }}
totalPrice: ={{ $json.data.quote.totalPrice }}
cached: ={{ $json.data.cached }}
executionTime: ={{ $json.data.executionTime }}
```

**Co robi:**
- Ekstraktuje tylko potrzebne dane z odpowiedzi API
- Upraszcza strukturę

---

### **NODE 8: Zbierz Wszystkie Wyniki**

**Typ:** `Merge` (Aggregator)

**Konfiguracja:**
```
Mode: Combine
Combination Mode: Merge By Position
```

**Co robi:**
- Czeka aż wszystkie 3 towarzystwa zwrócą wyniki
- Łączy je w jedną tablicę

---

### **NODE 9: Analizuj Oferty**

**Typ:** `Function` (Code)

**Konfiguracja:**
```javascript
// Sortuj wyniki po cenie (od najtańszej)
const items = $input.all();

const sorted = items.sort((a, b) => {
  const priceA = parseFloat(a.json.totalPrice) || Infinity;
  const priceB = parseFloat(b.json.totalPrice) || Infinity;
  return priceA - priceB;
});

// Oblicz średnią cenę
const validPrices = sorted
  .map(item => parseFloat(item.json.totalPrice))
  .filter(price => price > 0);

const avgPrice = validPrices.length > 0
  ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
  : 0;

// Najlepsza oferta
const bestOffer = sorted[0]?.json || {};

// Oszczędności
const savings = avgPrice > 0 ? (avgPrice - bestOffer.totalPrice) : 0;
const savingsPercent = avgPrice > 0 ? ((savings / avgPrice) * 100).toFixed(1) : 0;

// Zwróć wyniki
return [{
  json: {
    allOffers: sorted.map(item => item.json),
    bestOffer: bestOffer,
    averagePrice: avgPrice.toFixed(2),
    savings: savings.toFixed(2),
    savingsPercent: savingsPercent,
    totalOffers: sorted.length,
    clientEmail: $input.first().json.clientEmail || 'klient@example.com'
  }
}];
```

**Co robi:**
- Sortuje oferty od najtańszej
- Oblicza średnią cenę
- Oblicza oszczędności
- Przygotowuje dane do emaila

---

### **NODE 10: Wyślij Email z Ofertą** ⚠️ **SKONFIGURUJ EMAIL!**

**Typ:** `Email Send` (lub Gmail)

**Konfiguracja:**
```
From Email: ubezpieczenia@twoja-firma.pl
To Email: ={{ $json.clientEmail }}
Subject: Najlepsza oferta ubezpieczenia OC/AC

Email Type: HTML

Body: (zobacz poniżej)
```

**Email Body (HTML):**
```html
<h2>🚗 Twoja najlepsza oferta ubezpieczenia</h2>

<p>Dzień dobry,</p>

<p>Przygotowaliśmy dla Ciebie porównanie ofert ubezpieczenia.</p>

<h3>💰 Najlepsza oferta:</h3>
<ul>
  <li><strong>Towarzystwo:</strong> {{ $json.bestOffer.company }}</li>
  <li><strong>OC:</strong> {{ $json.bestOffer.ocPrice }} PLN</li>
  <li><strong>AC:</strong> {{ $json.bestOffer.acPrice }} PLN</li>
  <li><strong>RAZEM:</strong> <span style="color: green; font-size: 24px;">{{ $json.bestOffer.totalPrice }} PLN</span></li>
</ul>

<h3>📊 Porównanie wszystkich ofert:</h3>
<table border="1" cellpadding="10">
  <tr>
    <th>Towarzystwo</th>
    <th>Cena Całkowita</th>
  </tr>
  {{ #each $json.allOffers }}
  <tr>
    <td>{{ company }}</td>
    <td><strong>{{ totalPrice }} PLN</strong></td>
  </tr>
  {{ /each }}
</table>

<h3>💡 Oszczędności:</h3>
<p>Wybierając najtańszą ofertę zaoszczędzisz: <strong>{{ $json.savings }} PLN ({{ $json.savingsPercent }}%)</strong></p>

<p>Pozdrawiamy,<br>Twój Broker</p>
```

**⚠️ KONFIGURACJA SMTP/EMAIL:**

Musisz skonfigurować credentials emaila w n8n:
1. Idź do **Settings → Credentials**
2. Dodaj nowy **Email** credential
3. Wybierz provider (Gmail, SMTP, Resend, etc.)
4. Podaj dane logowania

---

## 🧪 KROK 4: TESTOWANIE

### **Test 1: Webhook Test**

1. **Aktywuj workflow:**
   - Kliknij przełącznik **"Active"** na górze

2. **Skopiuj Webhook URL:**
   ```
   https://your-n8n.com/webhook/insurance-quote
   ```

3. **Wyślij test request (cURL):**
   ```bash
   curl -X POST "https://your-n8n.com/webhook/insurance-quote" \
     -H "Content-Type: application/json" \
     -d '{
       "vehicle": {
         "brand": "Volkswagen",
         "model": "Golf",
         "year": 2020
       },
       "driver": {
         "age": 35,
         "drivingLicenseDate": "2005-06-15"
       },
       "options": {
         "acValue": 45000
       },
       "clientEmail": "test@example.com"
     }'
   ```

4. **Sprawdź wykonanie:**
   - Idź do **Executions** w n8n
   - Kliknij ostatnie wykonanie
   - Sprawdź każdy node

---

### **Test 2: Manual Execution**

1. **Otwórz workflow**
2. **Kliknij "Execute Workflow"** na górze
3. **Podaj test data** w Webhook node
4. **Obserwuj wykonanie** node po node

**Oczekiwany czas:** 30-120 sekund (zależy od scraping)

---

## 🚀 KROK 5: PRODUKCJA

### **5.1 Deploy API na produkcję**

Zamiast sandbox URL, użyj:
- Vercel: `https://your-app.vercel.app/api/insurance/calculate`
- VPS: `https://your-domain.com/api/insurance/calculate`

**Zaktualizuj Node 5 (HTTP Request):**
```
URL: https://your-production-url.com/api/insurance/calculate
```

### **5.2 Integracja z formularzem na stronie**

**HTML Form:**
```html
<form id="insuranceForm">
  <input name="brand" placeholder="Marka" required>
  <input name="model" placeholder="Model" required>
  <input name="year" type="number" placeholder="Rok" required>
  <input name="age" type="number" placeholder="Wiek" required>
  <input name="email" type="email" placeholder="Email" required>
  <button type="submit">Oblicz</button>
</form>

<script>
document.getElementById('insuranceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  const data = {
    vehicle: {
      brand: formData.get('brand'),
      model: formData.get('model'),
      year: parseInt(formData.get('year'))
    },
    driver: {
      age: parseInt(formData.get('age')),
      drivingLicenseDate: '2005-01-01' // lub z formularza
    },
    options: {
      acValue: 45000
    },
    clientEmail: formData.get('email')
  };
  
  // Wyślij do n8n webhook
  const response = await fetch('https://your-n8n.com/webhook/insurance-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  alert('Oferta wysłana na email!');
});
</script>
```

---

## 🐛 KROK 6: TROUBLESHOOTING

### **Problem 1: Timeout Error**

**Objaw:** `Request timeout after 60000ms`

**Rozwiązanie:**
- Zwiększ timeout w Node 5 (HTTP Request) na **90000ms** (90s)
- Scraping może trwać długo przy pierwszym requście

---

### **Problem 2: API zwraca błąd**

**Objaw:** `success: false` w odpowiedzi

**Debug:**
1. Sprawdź Node 6 (IF condition)
2. Zobacz output z Node 5 (HTTP Request)
3. Sprawdź logs API (Next.js)

**Możliwe przyczyny:**
- Błędne dane wejściowe
- Problem ze scraperem
- Zmiana struktury strony TU

---

### **Problem 3: Email nie wysyła się**

**Objaw:** Workflow kończy się ale email nie przychodzi

**Rozwiązanie:**
1. Sprawdź credentials w n8n (Settings → Credentials)
2. Testuj z prostszym emailem (bez HTML)
3. Sprawdź spam folder
4. Użyj Resend.com zamiast Gmail (łatwiejsze)

---

### **Problem 4: Pętla nie działa**

**Objaw:** Tylko jedno towarzystwo sprawdzone

**Rozwiązanie:**
- Sprawdź konfigurację Node 4 (Split In Batches)
- Batch Size = 1
- Upewnij się że connection wraca do Split In Batches

---

## 📊 MONITORING

### **Sprawdź wykonania:**
```
n8n → Executions → Filter by workflow
```

### **Metryki:**
- **Success rate:** Ile % wykonań się udaje
- **Average execution time:** Średni czas (oczekiwany: 30-90s)
- **Cache hit rate:** Sprawdź w API stats

---

## 💡 BEST PRACTICES

### **1. Retry Logic**

Dodaj retry dla HTTP Request:
```
Node 5 → Settings → Retry On Fail
Max Retries: 3
Wait Between Tries: 10s
```

### **2. Error Notifications**

Dodaj Email node po Error output:
```
IF node (Error) → Email Send (Alert admin)
```

### **3. Cache Optimization**

- Identyczne zapytania są cached (< 0.2s)
- TTL: 1 godzina
- Wyczyść cache gdy potrzeba: `POST /api/insurance/calculate?action=clearCache`

---

## 🎯 NASTĘPNE KROKI

1. ✅ Zaimportuj workflow
2. ✅ Skonfiguruj URL API
3. ✅ Skonfiguruj Email
4. ✅ Przetestuj
5. ✅ Deploy na produkcję
6. ✅ Dodaj do swojej strony

---

**Gotowe!** Twoja automatyzacja ubezpieczeń jest skonfigurowana! 🎉

**Pytania?** Zobacz `N8N_INTEGRATION_GUIDE.md` dla więcej szczegółów.
