# Portal Agencyjny - Checklist Dostępu

## Cel
Sprawdzić czy masz dostęp do portali agencyjnych towarzystw i jak się logować.

---

## 1. PZU - Strefa Brokera/Agenta

### Link do portalu:
- **Agent PZU**: https://agentpzu.pl/
- **Broker PZU**: https://broker.pzu.pl/

### Jak sprawdzić dostęp:
1. Otwórz: https://broker.pzu.pl/ lub https://agentpzu.pl/
2. Sprawdź czy masz:
   - Login i hasło do portalu?
   - Numer telefonu zarejestrowany w systemie PZU?
   - Email zarejestrowany?

### Co potrzebujesz:
- [ ] Login (może być email lub numer telefonu)
- [ ] Hasło
- [ ] Kod SMS (jeśli wymaga weryfikacji)

### Dokumenty/Kontakt:
- Umowa agencyjna powinna zawierać dane dostępu
- Kontakt PZU: 801 102 102 (dla agentów)
- W umowie szukaj: "dostęp do systemu sprzedażowego" lub "Everest"

---

## 2. Generali - Portal Agenta

### Link do portalu:
- **Generali Portal**: https://portal.generali.pl/
- **Aplikacja**: https://play.google.com/store/apps/details?id=pl.generali

### Jak sprawdzić dostęp:
1. Otwórz: https://portal.generali.pl/
2. Sprawdź czy masz:
   - Login (zwykle email)
   - Hasło
   - Kod agenta (nadany przez Generali)

### Co potrzebujesz:
- [ ] Email (login)
- [ ] Hasło
- [ ] Kod agenta (numer identyfikacyjny)

### Dokumenty/Kontakt:
- Umowa agencyjna: "dostęp do portalu partnerskiego"
- Kontakt Generali: 22 543 43 43
- W umowie szukaj: "kod agenta" lub "numer identyfikacyjny"

---

## 3. Uniqa - Panel Agenta

### Link do portalu:
- **Panel Agenta**: https://serwis.uniqa.pl/partner/Login.html
- **Portal**: https://portal.uniqa.pl/

### Jak sprawdzić dostęp:
1. Otwórz: https://serwis.uniqa.pl/partner/Login.html
2. Sprawdź czy masz:
   - Email (login)
   - Hasło

### Co potrzebujesz:
- [ ] Email (login)
- [ ] Hasło

### Dokumenty/Kontakt:
- Umowa agencyjna: sekcja "dostęp do systemów"
- Kontakt Uniqa: 22 599 95 22
- W umowie szukaj: "Panel Agenta" lub "dostęp elektroniczny"

---

## AKCJA DLA CIEBIE

### Sprawdź teraz (każdy portal):
1. **Otwórz każdy link** i zobacz czy możesz się zalogować
2. **Sprawdź swoją umowę agencyjną** - szukaj:
   - Hasło/login
   - Kod agenta
   - Numer referencyjny
   - Email kontaktowy
3. **Jeśli nie masz dostępu** - zadzwoń do biura agencyjnego:
   - PZU: 801 102 102
   - Generali: 22 543 43 43
   - Uniqa: 22 599 95 22
   
   Powiedz: "Jestem agentem i potrzebuję dostępu do portalu sprzedażowego/kalkulatora"

---

## Co dalej?

### Wariant A: Masz już dostęp
Podaj mi:
- [ ] PZU: login + czy wymaga SMS?
- [ ] Generali: login + kod agenta
- [ ] Uniqa: login

**NIE PODAWAJ HASEŁ** - zapiszemy je w `.env` lokalnie.

### Wariant B: Nie masz dostępu
1. Zadzwoń do każdego towarzystwa
2. Poproś o "dostęp do portalu agenta/kalkulatora online"
3. Otrzymasz dane dostępu w 1-3 dni robocze

### Wariant C: Chcesz najpierw przetestować bez logowania
Możemy użyć publicznych kalkulatorów (bez logowania), ale:
- ❌ Gorsza prowizja
- ❌ Mniej danych
- ❌ Mogą być wyższe ceny dla klientów

---

## WAŻNE: Bezpieczeństwo

### Jak będziemy przechowywać credentials:
```env
# .env.local (NIE commitujemy do git!)
PZU_AGENT_LOGIN=twoj.email@example.com
PZU_AGENT_PASSWORD=twoje_haslo
PZU_AGENT_PHONE=+48123456789

GENERALI_AGENT_LOGIN=twoj.email@example.com
GENERALI_AGENT_PASSWORD=twoje_haslo
GENERALI_AGENT_CODE=AGT12345

UNIQA_AGENT_LOGIN=twoj.email@example.com
UNIQA_AGENT_PASSWORD=twoje_haslo
```

### Scrapers będą:
1. Logować się do portalu (Puppeteer)
2. Nawigować do kalkulatora
3. Wypełnić formularz
4. Pobrać cenę
5. Wylogować się

---

## Następne kroki po uzyskaniu dostępu

1. ✅ Zaktualizuję scrapers z logiką logowania
2. ✅ Dodam obsługę sesji (cookies)
3. ✅ Przetestuję kalkulacje
4. ✅ Zintegruję z n8n

**Która opcja wybierasz?**
- [ ] A: Mam dostęp, chcę go używać
- [ ] B: Nie mam, ale zadzwonię teraz
- [ ] C: Zacznijmy bez logowania (na razie)
