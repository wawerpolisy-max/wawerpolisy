import puppeteer, { Browser, Page } from 'puppeteer';
import type { CalculationRequest, InsuranceQuote, ScraperResult } from '../types';

/**
 * TUZ Scraper
 * 
 * URL kalkulatora: https://tuz.pl/kalkulator-oc-ac/
 * TUZ (Towarzystwo Ubezpieczeń Zdrowotnych) oferuje ubezpieczenia komunikacyjne
 */

export class TuzScraper {
  private browser: Browser | null = null;

  private async initBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    return this.browser;
  }

  async scrape(request: CalculationRequest): Promise<ScraperResult> {
    const startTime = Date.now();
    let page: Page | null = null;

    try {
      console.log('[TUZ] Rozpoczynam kalkulację...');
      
      const browser = await this.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log('[TUZ] Ładuję stronę kalkulatora...');
      await page.goto('https://tuz.pl/kalkulator-oc-ac/', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Czekaj na formularz
      await page.waitForSelector('form, input', { timeout: 10000 });

      console.log('[TUZ] Wypełniam formularz...');

      // KROK 1: Numer rejestracyjny lub dane manualne
      if (request.vehicle.registrationNumber) {
        await this.fillByRegistration(page, request);
      } else {
        await this.fillVehicleDataManually(page, request);
      }

      // KROK 2: Dane osobowe i historia ubezpieczenia
      await this.fillDriverData(page, request);

      // KROK 3: Opcje ubezpieczenia
      await this.selectInsuranceOptions(page, request);

      // KROK 4: Oblicz składkę
      console.log('[TUZ] Obliczam składkę...');
      
      // Szukaj przycisku kalkulacji
      const calculateButton = await page.$(
        'button[type="submit"], .calculate-button, .btn-calculate, input[type="submit"]'
      );
      
      if (calculateButton) {
        await calculateButton.click();
      } else {
        // Próba wysłania formularza enterem
        await page.keyboard.press('Enter');
      }

      // Czekaj na wyniki
      await page.waitForSelector(
        '.result, .offer, .price-result, .quote-result', 
        { timeout: 20000 }
      );
      await page.waitForTimeout(2000);

      // Ekstrakcja oferty
      const quote = await this.extractQuote(page, request);

      const executionTime = Date.now() - startTime;
      console.log(`[TUZ] ✅ Kalkulacja zakończona w ${executionTime}ms`);

      return {
        success: true,
        quote,
        executionTime,
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('[TUZ] ❌ Błąd:', error.message);

      if (page) {
        try {
          await page.screenshot({ 
            path: `./logs/tuz-error-${Date.now()}.png`,
            fullPage: true 
          });
        } catch {}
      }

      return {
        success: false,
        error: `TUZ scraping failed: ${error.message}`,
        executionTime,
      };

    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async fillByRegistration(page: Page, request: CalculationRequest): Promise<void> {
    try {
      const regInput = await page.$(
        'input[name*="registration"], input[placeholder*="rejestracyjny"], input[id*="reg"]'
      );
      
      if (regInput) {
        await regInput.type(request.vehicle.registrationNumber!);
        
        // Kliknij "Sprawdź" lub wyślij
        const checkBtn = await page.$('button:has-text("Sprawdź"), button.check-reg');
        if (checkBtn) {
          await checkBtn.click();
          await page.waitForTimeout(3000);
        } else {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.log('[TUZ] Nie udało się wypełnić przez numer rejestracyjny, przechodzę na tryb manualny');
      await this.fillVehicleDataManually(page, request);
    }
  }

  private async fillVehicleDataManually(page: Page, request: CalculationRequest): Promise<void> {
    // Sprawdź czy jest przycisk "Wpisz dane ręcznie"
    const manualBtn = await page.$('a:has-text("ręcznie"), button:has-text("ręcznie")');
    if (manualBtn) {
      await manualBtn.click();
      await page.waitForTimeout(1000);
    }

    // Marka
    try {
      await page.waitForSelector('select[name*="brand"], select[name*="marka"]', { timeout: 3000 });
      await page.select('select[name*="brand"], select[name*="marka"]', request.vehicle.brand);
      await page.waitForTimeout(800);
    } catch (e) {
      console.log('[TUZ] Nie znaleziono selecta marki');
    }

    // Model
    try {
      await page.waitForSelector('select[name*="model"]', { timeout: 3000 });
      await page.select('select[name*="model"]', request.vehicle.model);
      await page.waitForTimeout(800);
    } catch (e) {
      console.log('[TUZ] Nie znaleziono selecta modelu');
    }

    // Rok
    try {
      const yearField = await page.$('input[name*="year"], select[name*="rok"]');
      if (yearField) {
        const tagName = await page.evaluate(el => el.tagName, yearField);
        if (tagName === 'SELECT') {
          await page.select('select[name*="rok"]', request.vehicle.year.toString());
        } else {
          await yearField.type(request.vehicle.year.toString());
        }
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('[TUZ] Nie znaleziono pola roku');
    }

    // Pojemność silnika
    if (request.vehicle.engineCapacity) {
      try {
        const engineField = await page.$('input[name*="engine"], input[name*="pojemnosc"]');
        if (engineField) {
          await engineField.type(request.vehicle.engineCapacity.toString());
        }
      } catch (e) {
        console.log('[TUZ] Nie znaleziono pola pojemności silnika');
      }
    }

    // Rodzaj paliwa
    if (request.vehicle.fuelType) {
      try {
        const fuelSelect = await page.$('select[name*="fuel"], select[name*="paliwo"]');
        if (fuelSelect) {
          await page.select('select[name*="fuel"], select[name*="paliwo"]', request.vehicle.fuelType);
        }
      } catch (e) {
        console.log('[TUZ] Nie znaleziono selecta paliwa');
      }
    }
  }

  private async fillDriverData(page: Page, request: CalculationRequest): Promise<void> {
    // Wiek kierowcy
    try {
      const ageField = await page.$('input[name*="age"], input[name*="wiek"]');
      if (ageField) {
        await ageField.type(request.driver.age.toString());
        await page.waitForTimeout(300);
      }
    } catch {}

    // Data prawa jazdy
    try {
      const licenseYear = request.driver.drivingLicenseDate.getFullYear();
      const licenseField = await page.$('input[name*="license"], select[name*="prawo"]');
      
      if (licenseField) {
        const tagName = await page.evaluate(el => el.tagName, licenseField);
        if (tagName === 'SELECT') {
          await page.select('select[name*="prawo"]', licenseYear.toString());
        } else {
          await licenseField.type(licenseYear.toString());
        }
        await page.waitForTimeout(300);
      }
    } catch {}

    // Liczba szkód
    if (request.driver.accidentHistory !== undefined && request.driver.accidentHistory > 0) {
      try {
        const accidentsField = await page.$('select[name*="accident"], select[name*="szkod"]');
        if (accidentsField) {
          await page.select('select[name*="accident"], select[name*="szkod"]', 
            request.driver.accidentHistory.toString()
          );
          await page.waitForTimeout(300);
        }
      } catch {}
    }
  }

  private async selectInsuranceOptions(page: Page, request: CalculationRequest): Promise<void> {
    // AC
    if (request.options.acIncluded) {
      try {
        const acCheckbox = await page.$('input[type="checkbox"][name*="ac"], input[value*="AC"]');
        if (acCheckbox) {
          const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, acCheckbox);
          if (!isChecked) {
            await acCheckbox.click();
            await page.waitForTimeout(500);
          }

          // Wartość pojazdu dla AC
          if (request.options.acValue) {
            const valueField = await page.$('input[name*="value"], input[name*="wartosc"]');
            if (valueField) {
              await valueField.type(request.options.acValue.toString());
            }
          }
        }
      } catch {}
    }

    // Assistance
    if (request.options.assistance) {
      try {
        const assistCheckbox = await page.$('input[name*="assistance"], input[value*="ASSISTANCE"]');
        if (assistCheckbox) {
          await assistCheckbox.click();
          await page.waitForTimeout(300);
        }
      } catch {}
    }

    // NNW
    if (request.options.nnw) {
      try {
        const nnwCheckbox = await page.$('input[name*="nnw"], input[value*="NNW"]');
        if (nnwCheckbox) {
          await nnwCheckbox.click();
          await page.waitForTimeout(300);
        }
      } catch {}
    }
  }

  private async extractQuote(page: Page, request: CalculationRequest): Promise<InsuranceQuote> {
    const parsePrice = (text: string): number => {
      const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    };

    // Próbuj znaleźć ceny w różnych miejscach
    let ocPrice = 0;
    let acPrice;
    let totalPrice = 0;

    // Szukaj ceny OC
    const ocSelectors = [
      '.oc-price',
      '[data-product="OC"] .price',
      '.price-oc',
      '.oc-value',
      'div:has-text("OC") + .price',
    ];

    for (const selector of ocSelectors) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        ocPrice = parsePrice(text);
        if (ocPrice > 0) break;
      } catch {}
    }

    // Szukaj ceny AC (jeśli wybrana)
    if (request.options.acIncluded) {
      const acSelectors = [
        '.ac-price',
        '[data-product="AC"] .price',
        '.price-ac',
        '.ac-value',
      ];

      for (const selector of acSelectors) {
        try {
          const text = await page.$eval(selector, el => el.textContent || '');
          acPrice = parsePrice(text);
          if (acPrice && acPrice > 0) break;
        } catch {}
      }
    }

    // Szukaj ceny całkowitej
    const totalSelectors = [
      '.total-price',
      '.summary-price',
      '.final-price',
      '.offer-price',
      '.price-total',
    ];

    for (const selector of totalSelectors) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        totalPrice = parsePrice(text);
        if (totalPrice > 0) break;
      } catch {}
    }

    // Jeśli nie znaleziono sumy, oblicz ją
    if (totalPrice === 0) {
      totalPrice = ocPrice + (acPrice || 0);
    }

    return {
      company: 'TUZ',
      ocPrice: ocPrice || undefined,
      acPrice,
      totalPrice,
      currency: 'PLN',
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[TUZ] Przeglądarka zamknięta');
    }
  }
}

export default TuzScraper;
