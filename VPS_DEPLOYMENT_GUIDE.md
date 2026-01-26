# 🚀 DEPLOYMENT - Hetzner VPS (Krok po Kroku)

## 📋 CHECKLIST PRZED ROZPOCZĘCIEM

- [ ] Karta kredytowa (do zakupu VPS)
- [ ] Terminal/SSH client
- [ ] 30-40 minut czasu
- [ ] Dostęp do GitHub (wawerpolisy-max/wawerpolisy)

---

## FAZA 1: Zakup i Setup VPS (10 min)

### 1.1. Kup Hetzner VPS

1. **Otwórz**: https://www.hetzner.com/cloud
2. **Sign Up**: Utwórz konto z emailem `mateuszppawelec@gmail.com`
3. **Potwierdź email**: Sprawdź skrzynkę
4. **Dodaj płatność**: Billing → Payment methods → Karta kredytowa
5. **Utwórz projekt**: "New Project" → Nazwa: `WawerPolisy Production`

### 1.2. Utwórz serwer

**Kliknij "Add Server"** i wybierz:

```
Location:       🇫🇮 Helsinki, Finland
Image:          Ubuntu 22.04
Type:           Standard → CX21 (2 vCPU, 4GB RAM, 40GB SSD)
                💰 22 PLN/mies (~€4.85/mies)
Networking:     ✅ IPv4 + IPv6
SSH keys:       (zostaw puste lub dodaj jeśli masz)
Name:           wawerpolisy-prod
```

**Kliknij "Create & Buy now"**

### 1.3. Zapisz dane dostępowe

Po utworzeniu zobaczysz:

```
┌─────────────────────────────────────────┐
│ Server Created Successfully! 🎉         │
├─────────────────────────────────────────┤
│ IP Address:    159.69.123.45           │  ← ZAPISZ TO!
│ Root Password: aB3$xK9mP2qL            │  ← ZAPISZ TO!
│ Status:        Running                  │
└─────────────────────────────────────────┘
```

**⚠️ WAŻNE**: Hasło wyświetli się tylko raz! Zapisz je w bezpiecznym miejscu.

---

## FAZA 2: Połączenie z VPS (5 min)

### 2.1. Otwórz Terminal

**Mac/Linux:**
```bash
# Otwórz Terminal.app lub terminal
ssh root@159.69.123.45
```

**Windows:**
1. Pobierz PuTTY: https://www.putty.org/
2. Otwórz PuTTY
3. Host Name: `159.69.123.45`
4. Port: `22`
5. Kliknij "Open"

### 2.2. Zaloguj się

1. Wpisz **root password** (który zapisałeś)
2. System może poprosić o zmianę hasła:
   ```
   Enter new password: [wpisz nowe, silne hasło]
   Retype new password: [powtórz]
   ```
3. **Sukces!** Zobaczysz:
   ```
   root@wawerpolisy-prod:~#
   ```

---

## FAZA 3: Instalacja Dependencies (5 min)

### 3.1. Update system

```bash
apt update && apt upgrade -y
```

Czas: ~2 min

### 3.2. Zainstaluj Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Czas: ~1 min

**Sprawdź:**
```bash
node --version    # Powinno pokazać: v20.x.x
npm --version     # Powinno pokazać: 10.x.x
```

### 3.3. Zainstaluj Git

```bash
apt install -y git
```

Czas: <1 min

**Sprawdź:**
```bash
git --version     # Powinno pokazać: git version 2.x.x
```

### 3.4. Zainstaluj Puppeteer Dependencies

**Skopiuj całą komendę (wszystkie linie):**

```bash
apt install -y \
  chromium-browser \
  libnspr4 \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libcups2 \
  libxss1 \
  libxtst6 \
  fonts-liberation \
  libnss3-dev \
  libgdk-pixbuf2.0-0 \
  libxshmfence1
```

Czas: ~2 min

**✅ System gotowy!**

---

## FAZA 4: Clone Repo i Install App (10 min)

### 4.1. Clone repository

```bash
cd /root
git clone https://github.com/wawerpolisy-max/wawerpolisy.git
cd wawerpolisy
```

**Sprawdź:**
```bash
ls -la
# Powinno pokazać pliki: package.json, app/, services/, etc.
```

### 4.2. Checkout branch

```bash
git checkout genspark_ai_developer
```

**Output:**
```
Branch 'genspark_ai_developer' set up to track remote branch...
Switched to a new branch 'genspark_ai_developer'
```

### 4.3. Install npm packages

```bash
npm install
```

Czas: ~3-5 min (pobiera ~300 packages)

**Output końcowy powinien zawierać:**
```
added 300 packages, and audited 307 packages in 3m
```

### 4.4. Utwórz .env.local (credentials)

**⚠️ TUTAJ WPISZ SWOJE DANE!**

```bash
nano .env.local
```

**Wklej (zaktualizuj z prawdziwymi danymi):**

```env
# PZU Portal
PZU_AGENT_LOGIN=twoj.email@wawerpolisy.pl
PZU_AGENT_PASSWORD=twoje_haslo_pzu
PZU_AGENT_PHONE=+48123456789

# Generali Portal
GENERALI_AGENT_LOGIN=twoj.email@wawerpolisy.pl
GENERALI_AGENT_PASSWORD=twoje_haslo_generali
GENERALI_AGENT_CODE=AGT12345

# Uniqa Portal
UNIQA_AGENT_LOGIN=twoj.email@wawerpolisy.pl
UNIQA_AGENT_PASSWORD=twoje_haslo_uniqa

# n8n
N8N_WEBHOOK_URL=https://wawerpolisy.app.n8n.cloud/webhook/insurance-quote

# Gmail
GMAIL_ADDRESS=wawerpolisy@gmail.com
```

**Zapisz i wyjdź:**
- Naciśnij `Ctrl + X`
- Naciśnij `Y` (yes)
- Naciśnij `Enter`

**Sprawdź:**
```bash
cat .env.local
# Powinno pokazać Twoje credentials
```

---

## FAZA 5: Build & Deploy (10 min)

### 5.1. Build Next.js

```bash
npm run build
```

Czas: ~2-5 min

**Output końcowy powinien być:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    123 kB
├ ○ /api/insurance/calculate             0 B
├ ○ /api/apk/parse-and-calculate         0 B
...
○  (Static)  prerendered as static content
```

**✅ Build gotowy!**

### 5.2. Zainstaluj PM2 (Process Manager)

```bash
npm install -g pm2
```

Czas: <1 min

**Sprawdź:**
```bash
pm2 --version    # Powinno pokazać: 5.x.x
```

### 5.3. Start aplikacji z PM2

```bash
pm2 start npm --name "wawerpolisy-api" -- start
```

**Output:**
```
[PM2] Starting /usr/bin/npm in fork_mode (1 instance)
[PM2] Done.
┌─────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ mode        │ ↺       │ status  │ cpu      │
├─────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ wawerpolisy-api    │ fork        │ 0       │ online  │ 0%       │
└─────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┘
```

**✅ Aplikacja uruchomiona!**

### 5.4. Zapisz konfigurację PM2

```bash
pm2 save
```

### 5.5. Auto-start PM2 przy reboot

```bash
pm2 startup
```

**Skopiuj komendę która się wyświetli** (przykład):
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Wklej i uruchom tę komendę.**

**✅ PM2 auto-start skonfigurowany!**

---

## FAZA 6: Testowanie (5 min)

### 6.1. Sprawdź status PM2

```bash
pm2 status
```

**Powinno pokazać:**
```
┌─────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ mode        │ ↺       │ status  │ cpu      │
├─────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ wawerpolisy-api    │ fork        │ 0       │ online  │ 0%       │
└─────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┘
```

**Status musi być: `online` (zielony)**

### 6.2. Sprawdź logi

```bash
pm2 logs wawerpolisy-api --lines 20
```

**Powinno pokazać:**
```
0|wawerpo | ▲ Next.js 15.0.10
0|wawerpo | - Local:        http://localhost:3000
0|wawerpo | 
0|wawerpo | ✓ Ready in 2.5s
```

**Naciśnij `Ctrl + C` aby wyjść z logów.**

### 6.3. Test API - Lista towarzystw

```bash
curl http://localhost:3000/api/insurance/calculate?action=companies
```

**Powinno zwrócić:**
```json
{
  "success": true,
  "data": {
    "companies": ["pzu", "generali", "uniqa"],
    "count": 3
  }
}
```

**✅ API działa lokalnie!**

### 6.4. Test API - Cache stats

```bash
curl http://localhost:3000/api/insurance/calculate?action=stats
```

**Powinno zwrócić:**
```json
{
  "success": true,
  "data": {
    "keys": 0,
    "stats": {
      "hits": 0,
      "misses": 0,
      "keys": 0
    }
  }
}
```

**✅ Cache działa!**

### 6.5. Test API - APK parser

```bash
curl http://localhost:3000/api/apk/parse-and-calculate?test=true
```

**Powinno zwrócić JSON z:**
```json
{
  "success": true,
  "test": true,
  "data": {
    "apkData": {
      "name": "Mateusz Pawelec",
      "email": "mateuszppawelec@gmail.com",
      ...
    }
  }
}
```

**✅ APK parser działa!**

---

## FAZA 7: Konfiguracja Firewall & Dostęp Zewnętrzny (5 min)

### 7.1. Sprawdź publiczny dostęp

Z **Twojego lokalnego komputera** (nie z VPS!):

**Mac/Linux Terminal:**
```bash
curl http://159.69.123.45:3000/api/insurance/calculate?action=companies
```

**Windows CMD/PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://159.69.123.45:3000/api/insurance/calculate?action=companies"
```

**Zamień `159.69.123.45` na Twoje IP VPS!**

**Jeśli działa** → Gotowe! Przejdź do Fazy 8.

**Jeśli nie działa** (timeout/connection refused) → Otwórz port w firewall:

### 7.2. Otwórz port 3000 w UFW (firewall)

```bash
ufw allow 3000/tcp
ufw allow 22/tcp    # SSH (ważne!)
ufw enable
```

**Sprawdź:**
```bash
ufw status
```

**Powinno pokazać:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
3000/tcp                   ALLOW       Anywhere
```

### 7.3. Test ponownie z lokalnego komputera

```bash
curl http://159.69.123.45:3000/api/insurance/calculate?action=companies
```

**✅ Jeśli zwraca JSON - gotowe!**

---

## FAZA 8: Zapisz ważne informacje

### 8.1. Zapisz URL API

**Twój publiczny URL API:**
```
http://159.69.123.45:3000
```

**Endpoints:**
- Lista towarzystw: `http://159.69.123.45:3000/api/insurance/calculate?action=companies`
- Cache stats: `http://159.69.123.45:3000/api/insurance/calculate?action=stats`
- APK parser: `http://159.69.123.45:3000/api/apk/parse-and-calculate`
- Kalkulacja: `http://159.69.123.45:3000/api/insurance/calculate`

**⚠️ Zamień `159.69.123.45` na Twoje IP!**

### 8.2. Zapisz komendy zarządzania

**PM2 komendy:**
```bash
pm2 status                      # Status aplikacji
pm2 logs wawerpolisy-api        # Logi (Ctrl+C aby wyjść)
pm2 restart wawerpolisy-api     # Restart aplikacji
pm2 stop wawerpolisy-api        # Stop aplikacji
pm2 start wawerpolisy-api       # Start aplikacji
```

**Git komendy (aktualizacja kodu):**
```bash
cd /root/wawerpolisy
git pull origin genspark_ai_developer
npm install                     # jeśli były zmiany w package.json
npm run build                   # rebuild Next.js
pm2 restart wawerpolisy-api     # restart aplikacji
```

---

## ✅ DEPLOYMENT ZAKOŃCZONY!

### Co masz teraz:

- ✅ **VPS Hetzner**: 159.69.123.45 (Twoje IP)
- ✅ **Aplikacja uruchomiona**: PM2 auto-restart
- ✅ **API dostępne publicznie**: http://159.69.123.45:3000
- ✅ **3 scrapers**: PZU, Generali, Uniqa
- ✅ **Cache**: 1h TTL
- ✅ **Logs**: `pm2 logs wawerpolisy-api`

### Następny krok:

**Skonfiguruj n8n!** Użyj URL: `http://159.69.123.45:3000`

Instrukcja: `FINAL_DEPLOYMENT_GUIDE.md` → Faza 3

---

## 🆘 TROUBLESHOOTING

### Problem: npm install fails

**Rozwiązanie:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problem: Build fails

**Rozwiązanie:**
```bash
rm -rf .next
npm run build
```

### Problem: PM2 pokazuje "errored" status

**Rozwiązanie:**
```bash
pm2 logs wawerpolisy-api --lines 50    # Zobacz błąd
pm2 delete wawerpolisy-api
pm2 start npm --name "wawerpolisy-api" -- start
```

### Problem: Port 3000 zajęty

**Sprawdź co używa portu:**
```bash
lsof -i :3000
```

**Kill proces:**
```bash
kill -9 [PID]
```

**Restart PM2:**
```bash
pm2 restart wawerpolisy-api
```

### Problem: Nie mogę połączyć się z VPS (SSH)

**Sprawdź:**
1. Czy IP jest poprawne?
2. Czy hasło jest poprawne?
3. Czy VPS jest włączony? (sprawdź w Hetzner Console)

**Reset hasła:**
1. Hetzner Console → Server → Actions → Reset root password
2. Nowe hasło wyświetli się w konsoli

---

## 📞 DALSZE WSPARCIE

**Logi PM2:**
```bash
pm2 logs wawerpolisy-api
```

**Status systemu:**
```bash
htop              # CPU/RAM usage (Ctrl+C aby wyjść)
df -h             # Disk usage
free -h           # Memory usage
```

**Restart całego serwera:**
```bash
reboot
# Poczekaj 1-2 min, potem ssh root@159.69.123.45
```

---

## 🎉 GRATULACJE!

Backend jest **LIVE** na produkcji! 🚀

**Koszt**: 22 PLN/mies  
**Status**: Online 24/7  
**Auto-restart**: Yes (PM2)  

**Następny krok**: Skonfiguruj n8n z nowym URL! 😊
