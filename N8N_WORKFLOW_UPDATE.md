# 🔧 Aktualizacja Twojego n8n Workflow

## 📋 CO MAMY

**Twój obecny workflow**: https://wawerpolisy.app.n8n.cloud/workflow/QfyvZHK8bycKdJ5n

**Co widać na screenshocie:**
- Gmail Trigger (lewą stronę)
- Wiele HTTP Request nodes
- Loop structure
- Send Email na końcu

**Co zrobimy:**
1. Dodamy **node parsowania APK** (zamiast ręcznego wypełniania danych)
2. Zaktualizujemy **URL API** (z sandbox na Twój VPS)
3. Uprościmy **loop structure** (jeśli potrzebne)

---

## KROK 1: Otwórz Workflow w n8n

1. Otwórz: https://wawerpolisy.app.n8n.cloud
2. Zaloguj się
3. Otwórz Twój workflow: **QfyvZHK8bycKdJ5n**

**Powinien się otworzyć canvas z wieloma nodes.**

---

## KROK 2: Sprawdź Gmail Trigger

### 2.1. Kliknij na pierwszy node (Gmail Trigger)

**Sprawdź konfigurację:**
- **Event**: "Message Received"
- **Filters**: 
  - Subject: `🎯 Nowy formularz APK`
  - (pozostałe mogą być puste)
- **Poll Time**: "Every Minute" (lub szybciej)

### 2.2. Sprawdź credentials

- **Gmail OAuth2**: Powinien być połączony z `wawerpolisy@gmail.com`
- Jeśli NIE jest połączony:
  1. Kliknij "Select Credential"
  2. "Create New Credential"
  3. Gmail OAuth2
  4. "Connect My Account"
  5. Zaloguj się: `wawerpolisy@gmail.com`
  6. Zezwól na dostęp
  7. Zapisz jako "WawerPolisy Gmail"

**✅ Gmail Trigger gotowy!**

---

## KROK 3: Dodaj Node Parsowania APK

### 3.1. Znajdź node po Gmail Trigger

Po Gmail Trigger powinien być jakiś node (np. "Set" lub "Function").

**Usuniemy go i dodamy nowy "HTTP Request" dla parsowania APK.**

### 3.2. Usuń stary node (jeśli istnieje)

1. Kliknij na node zaraz po Gmail Trigger
2. Kliknij "Delete" (ikona kosza) lub naciśnij `Delete` na klawiaturze

### 3.3. Dodaj nowy node "HTTP Request"

1. Kliknij na **"+"** między Gmail Trigger a następnym node
2. Wyszukaj: **"HTTP Request"**
3. Kliknij "HTTP Request"

### 3.4. Skonfiguruj HTTP Request - Parse APK

**Kliknij na nowy node i wypełnij:**

#### **Parameters**:
- **Method**: `POST`
- **URL**: `http://TWOJE_VPS_IP:3000/api/apk/parse-and-calculate`
  - **⚠️ Zamień `TWOJE_VPS_IP` na IP Twojego VPS!**
  - Przykład: `http://159.69.123.45:3000/api/apk/parse-and-calculate`

#### **Body Parameters**:
- Kliknij "Add Parameter"
- Wybierz **"JSON"**
- Wklej:

```json
{
  "emailBody": "={{ $json.body.plain || $json.body.html }}",
  "emailSubject": "={{ $json.subject }}",
  "companies": ["pzu", "generali", "uniqa"]
}
```

**Wyjaśnienie:**
- `emailBody`: wyciąga treść emaila (plain text lub HTML)
- `emailSubject`: temat emaila
- `companies`: lista towarzystw do sprawdzenia

#### **Options**:
- Kliknij "Add Option"
- Wybierz **"Timeout"**
- Ustaw: `120000` (2 minuty)

#### **Zapisz**:
- Kliknij "Execute Node" (test)
- Jeśli działa → kliknij "Save"

**✅ Node parsowania APK dodany!**

---

## KROK 4: Usuń/Zaktualizuj Loop Structure

### 4.1. Sprawdź co jest po HTTP Request (Parse APK)

Po nowym node "HTTP Request - Parse APK" powinieneś mieć:
- Jakiś "Loop" node lub "Split In Batches"
- Wiele "HTTP Request" nodes dla każdego towarzystwa

**Problem:** Teraz nie potrzebujemy loop, bo nasze API już robi to za nas!

### 4.2. Opcja A: Usuń cały loop (ZALECANE)

1. Zaznacz wszystkie nodes w loop (kliknij i przeciągnij prostokąt)
2. Naciśnij `Delete`

**Zostaw tylko:**
- Gmail Trigger
- HTTP Request (Parse APK) ← nowy
- ... (następne nodes)

### 4.3. Opcja B: Zostaw loop (jeśli chcesz zachować strukturę)

Jeśli chcesz zachować loop, zaktualizuj URL w każdym "HTTP Request" node:
- Stary URL: `https://sandbox...` lub cokolwiek
- Nowy URL: `http://TWOJE_VPS_IP:3000/api/insurance/calculate`

**Ale polecam Opcję A** - prostsze i szybsze!

---

## KROK 5: Dodaj Node "Set" - Przygotuj Dane do Emaila

### 5.1. Dodaj node "Set"

1. Kliknij **"+"** po HTTP Request (Parse APK)
2. Wyszukaj: **"Set"**
3. Kliknij "Set"

### 5.2. Skonfiguruj Set Node

**Nazwa**: "Prepare Email Data"

**Dodaj parametry** (kliknij "Add Value" dla każdego):

#### String Values:

1. **customerName**
   - Name: `customerName`
   - Value: `={{ $json.data.apkData.name }}`

2. **customerEmail**
   - Name: `customerEmail`
   - Value: `={{ $json.data.apkData.email }}`

3. **customerPhone**
   - Name: `customerPhone`
   - Value: `={{ $json.data.apkData.phone }}`

4. **vehicle**
   - Name: `vehicle`
   - Value: `={{ $json.data.apkData.brand }} {{ $json.data.apkData.model }} {{ $json.data.apkData.year }}`

5. **bestCompany**
   - Name: `bestCompany`
   - Value: `={{ $json.data.summary.cheapest.company.toUpperCase() }}`

6. **bestPrice**
   - Name: `bestPrice`
   - Value: `={{ $json.data.summary.cheapest.price }}`

7. **savings**
   - Name: `savings`
   - Value: `={{ $json.data.summary.savings }}`

#### Array Values:

8. **allQuotes**
   - Name: `allQuotes`
   - Value: `={{ $json.data.quotes }}`

**Zapisz**

**✅ Set node gotowy!**

---

## KROK 6: Zaktualizuj Email Node

### 6.1. Znajdź node "Send Email" lub "Gmail"

Powinien być na końcu workflow.

### 6.2. Kliknij na Email node

### 6.3. Skonfiguruj Email

#### **Parameters**:
- **To**: `={{ $json.customerEmail }}`
- **Subject**: `✅ Twoje oferty ubezpieczenia {{ $json.vehicle }}`
- **Email Type**: `HTML`

#### **Message** (HTML Template):

**Skopiuj i wklej:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 30px;
      background: #f9f9f9;
    }
    .best-offer {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .price {
      font-size: 42px;
      font-weight: bold;
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #667eea;
      color: white;
    }
    .savings {
      background: #4caf50;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚗 Twoje Oferty Ubezpieczenia</h1>
    <p style="font-size: 18px;">{{ $json.vehicle }}</p>
  </div>
  
  <div class="content">
    <p>Witaj <strong>{{ $json.customerName }}</strong>!</p>
    
    <p>Przygotowaliśmy dla Ciebie porównanie ofert ubezpieczenia.</p>
    
    <div class="best-offer">
      <h2>🏆 Najlepsza Oferta</h2>
      <h3>{{ $json.bestCompany }}</h3>
      <div class="price">{{ $json.bestPrice }} PLN</div>
      <p>rocznie</p>
    </div>
    
    {{#if $json.savings}}
    <div class="savings">
      💰 Oszczędzasz: <strong>{{ $json.savings }} PLN</strong> rocznie!
    </div>
    {{/if}}
    
    <h2>📊 Wszystkie Oferty</h2>
    <table>
      <thead>
        <tr>
          <th>Towarzystwo</th>
          <th>OC</th>
          <th>AC</th>
          <th>Razem</th>
        </tr>
      </thead>
      <tbody>
        {{#each $json.allQuotes}}
        <tr>
          <td><strong>{{ company }}</strong></td>
          <td>{{ quote.ocPrice }} PLN</td>
          <td>{{ quote.acPrice }} PLN</td>
          <td><strong>{{ quote.totalPrice }} PLN</strong></td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    
    <h2>📞 Skontaktuj się z nami</h2>
    <ul>
      <li><strong>Telefon:</strong> {{ $json.customerPhone }}</li>
      <li><strong>Email:</strong> kontakt@wawerpolisy.pl</li>
      <li><strong>Strona:</strong> www.wawerpolisy.pl</li>
    </ul>
    
    <p style="margin-top: 30px; font-size: 12px; color: #999;">
      Oferta ważna 30 dni. Wiadomość wygenerowana automatycznie.
    </p>
  </div>
</body>
</html>
```

#### **Credentials**:
- Wybierz "WawerPolisy Gmail" (które stworzyłeś wcześniej)

**Zapisz**

**✅ Email node zaktualizowany!**

---

## KROK 7: Dodaj Node "Mark as Read" (opcjonalnie)

### 7.1. Dodaj node Gmail

1. Kliknij **"+"** po Email node
2. Wyszukaj: **"Gmail"**
3. Kliknij "Gmail"

### 7.2. Skonfiguruj Gmail node

- **Resource**: "Message"
- **Operation**: "Update"
- **Message ID**: `={{ $node["Gmail Trigger"].json.id }}`
- **Options** → "Add Label IDs": `INBOX`
- **Options** → "Mark as Read": `true`

**Credentials**: Wybierz "WawerPolisy Gmail"

**Zapisz**

**✅ Mark as Read node dodany!**

---

## KROK 8: Finalne Połączenia

### 8.1. Sprawdź przepływ nodes

Powinien wyglądać tak:

```
Gmail Trigger
    ↓
HTTP Request (Parse APK)
    ↓
Set (Prepare Email Data)
    ↓
Gmail (Send Email)
    ↓
Gmail (Mark as Read)
```

### 8.2. Połącz nodes

Jeśli nie są połączone:
1. Najedź na node
2. Kliknij i przeciągnij z prawej strony (kropka) do następnego node

---

## KROK 9: Test Workflow

### 9.1. Wyślij testowy email

**Z dowolnego emaila** wyślij na: `wawerpolisy@gmail.com`

**Subject**: `🎯 Nowy formularz APK`

**Body**:
```
Analiza Potrzeb Klienta - wawerpolisy.pl

👤 Dane kontaktowe
Imię i nazwisko: Mateusz Pawelec
Telefon: +48501221133
E-mail: mateuszppawelec@gmail.com
Preferowana forma kontaktu: 📞 telefon

🚗 Szczegóły pojazdu
Zakres ochrony: OC
Marka: Toyota
Model: Corolla
Rok produkcji: 2019
Data pierwszej rejestracji: 03.09.2019
Data uzyskania prawa jazdy: 09.10.2006
Pojemność silnika: 1598 cm³
Moc silnika: 120 KM
Sposób użytkowania: Prywatnie
Szkody w ostatnich latach: Nie

🎯 Priorytety klienta
Najlepsza cena
```

### 9.2. Sprawdź Executions w n8n

1. W workflow kliknij **"Executions"** (ikona zegara na dole)
2. Poczekaj 1-2 minuty (Gmail Trigger działa co 1 min)
3. Powinieneś zobaczyć nową execution
4. Kliknij na nią aby zobaczyć szczegóły
5. **Wszystkie nodes powinny być zielone ✅**

### 9.3. Sprawdź email

Sprawdź skrzynkę: `mateuszppawelec@gmail.com`

Powinieneś otrzymać email:
- Subject: **✅ Twoje oferty ubezpieczenia Toyota Corolla 2019**
- Piękny HTML z tabelą ofert
- Najlepsza oferta wyróżniona

**✅ Jeśli działa - GRATULACJE! Workflow gotowy!**

---

## KROK 10: Aktywuj Workflow

### 10.1. Włącz workflow

W prawym górnym rogu kliknij przełącznik **"Active"**.

Powinien zmienić kolor na **zielony**.

**✅ Workflow aktywny! Działa 24/7!**

---

## 🎉 GOTOWE!

### Co działa teraz:

1. **Klient wypełnia formularz APK** na wawerpolisy.pl
2. **Formularz wysyła email** na wawerpolisy@gmail.com
3. **n8n Gmail Trigger wykrywa** email (co 1 min)
4. **n8n wywołuje API** na Twoim VPS
5. **API parsuje email** i pobiera oferty z 3 towarzystw
6. **n8n wysyła email** do klienta z ofertami
7. **Email oznaczony** jako przeczytany

**Czas total: 2-3 minuty** od formularza do emaila! ⚡

---

## 🆘 TROUBLESHOOTING

### Problem: Execution fails na "HTTP Request (Parse APK)"

**Sprawdź:**
1. Czy URL jest poprawny? `http://TWOJE_VPS_IP:3000/api/apk/parse-and-calculate`
2. Czy VPS działa? `curl http://TWOJE_VPS_IP:3000/api/insurance/calculate?action=companies`
3. Czy firewall otworzony? (port 3000)

### Problem: Email nie przychodzi

**Sprawdź:**
1. Czy Gmail credentials są poprawne?
2. Czy email klienta jest poprawny w formularzu?
3. Sprawdź SPAM folder

### Problem: Gmail Trigger nie wykrywa emaili

**Sprawdź:**
1. Czy workflow jest "Active"?
2. Czy subject jest dokładnie: `🎯 Nowy formularz APK`?
3. Czy credentials Gmail są połączone?

---

## 📋 CHECKLIST KOŃCOWY

- [ ] Gmail Trigger skonfigurowany
- [ ] HTTP Request (Parse APK) dodany
- [ ] URL zaktualizowany na VPS IP
- [ ] Set node (Prepare Email Data) dodany
- [ ] Email node zaktualizowany (HTML template)
- [ ] Mark as Read node dodany
- [ ] Wszystkie nodes połączone
- [ ] Test execution przeprowadzony ✅
- [ ] Email otrzymany ✅
- [ ] Workflow aktywny ✅

**GRATULACJE! Automatyzacja APK działa! 🎉**
