import puppeteer, { Browser, Page } from 'puppeteer';
import type { CalculationRequest, InsuranceQuote, ScraperResult } from '../types';

/**
 * Uniqa Scraper
 * 
 * URL kalkulatora: https://www.uniqa.pl/quote/start
 * Uniqa oferuje 15% zniżki dla polis kupowanych online
 */

export class UniqaScraper {
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
      console.log('[Uniqa] Rozpoczynam kalkulację...');
      
      const browser = await this.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log('[Uniqa] Ładuję stronę kalkulatora...');
      await page.goto('https://www.uniqa.pl/quote/start', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Czekaj na załadowanie formularza
      await page.waitForSelector('input, select', { timeout: 10000 });

      console.log('[Uniqa] Wypełniam formularz...');

      // KROK 1: Numer rejestracyjny lub dane pojazdu
      if (request.vehicle.registrationNumber) {
        await this.fillByRegistration(page, request);
      } else {
        await this.fillVehicleDataManually(page, request);
      }

      // KROK 2: Dane kierowcy i właściciela
      await this.fillDriverData(page, request);

      // KROK 3: Wybór opcji ubezpieczenia
      await this.selectInsuranceOptions(page, request);

      // KROK 4: Kalkulacja
      console.log('[Uniqa] Obliczam składkę...');
      await page.click('button[type="submit"], .btn-calculate, .next-button');
      
      // Czekaj na wyniki
      await page.waitForSelector('.offer-result, .price-container, .quote-summary', { 
        timeout: 20000 
      });
      await page.waitForTimeout(2000);

      // Ekstrakcja oferty
      const quote = await this.extractQuote(page, request);

      const executionTime = Date.now() - startTime;
      console.log(`[Uniqa] ✅ Kalkulacja zakończona w ${executionTime}ms`);

      return {
        success: true,
        quote,
        executionTime,
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('[Uniqa] ❌ Błąd:', error.message);

      if (page) {
        try {
          await page.screenshot({ 
            path: `./logs/uniqa-error-${Date.now()}.png`,
            fullPage: true 
          });
        } catch {}
      }

      return {
        success: false,
        error: `Uniqa scraping failed: ${error.message}`,
        executionTime,
      };

    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async fillByRegistration(page: Page, request: CalculationRequest): Promise<void> {
    // Szukaj pola numeru rejestracyjnego
    const regNumberInput = await page.$('input[name="registrationNumber"], input[placeholder*="rejestracyjny"]');
    
    if (regNumberInput) {
      await regNumberInput.type(request.vehicle.registrationNumber!);
      
      // Kliknij przycisk "Sprawdź" lub wciśnij Enter
      const checkButton = await page.$('button.check-registration, button[type="button"]');
      if (checkButton) {
        await checkButton.click();
      } else {
        await page.keyboard.press('Enter');
      }
      
      // Czekaj na załadowanie danych pojazdu
      await page.waitForTimeout(3000);
    }
  }

  private async fillVehicleDataManually(page: Page, request: CalculationRequest): Promise<void> {
    // Kliknij "Wprowadź dane ręcznie" jeśli dostępne
    const manualButton = await page.$('button.manual-entry, a[href*="manual"]');
    if (manualButton) {
      await manualButton.click();
      await page.waitForTimeout(1000);
    }

    // Marka pojazdu
    const brandSelector = await page.$('select[name="brand"], select[name="vehicle.brand"]');
    if (brandSelector) {
      await page.select('select[name="brand"], select[name="vehicle.brand"]', request.vehicle.brand);
      await page.waitForTimeout(1000);
    }

    // Model
    const modelSelector = await page.$('select[name="model"]');
    if (modelSelector) {
      await page.select('select[name="model"]', request.vehicle.model);
      await page.waitForTimeout(1000);
    }

    // Rok produkcji
    const yearInput = await page.$('input[name="year"], select[name="year"]');
    if (yearInput) {
      const tagName = await page.evaluate(el => el.tagName, yearInput);
      if (tagName === 'SELECT') {
        await page.select('select[name="year"]', request.vehicle.year.toString());
      } else {
        await yearInput.type(request.vehicle.year.toString());
      }
    }

    // Paliwo
    if (request.vehicle.fuelType) {
      const fuelSelect = await page.$('select[name="fuel"], select[name="fuelType"]');
      if (fuelSelect) {
        await page.select('select[name="fuel"], select[name="fuelType"]', request.vehicle.fuelType);
      }
    }
  }

  private async fillDriverData(page: Page, request: CalculationRequest): Promise<void> {
    // Wiek / Data urodzenia
    const ageInput = await page.$('input[name="age"], input[name="birthdate"]');
    if (ageInput) {
      await ageInput.type(request.driver.age.toString());
    }

    // Data uzyskania prawa jazdy
    const licenseInput = await page.$('input[name="licenseDate"], select[name="licenseYear"]');
    if (licenseInput) {
      const licenseYear = request.driver.drivingLicenseDate.getFullYear().toString();
      const tagName = await page.evaluate(el => el.tagName, licenseInput);
      
      if (tagName === 'SELECT') {
        await page.select('select[name="licenseYear"]', licenseYear);
      } else {
        await licenseInput.type(licenseYear);
      }
    }

    // Historia szkód
    if (request.driver.accidentHistory !== undefined) {
      const accidentsSelect = await page.$('select[name="accidents"], input[name="claimsCount"]');
      if (accidentsSelect) {
        const tagName = await page.evaluate(el => el.tagName, accidentsSelect);
        if (tagName === 'SELECT') {
          await page.select('select[name="accidents"]', request.driver.accidentHistory.toString());
        } else {
          await accidentsSelect.type(request.driver.accidentHistory.toString());
        }
      }
    }
  }

  private async selectInsuranceOptions(page: Page, request: CalculationRequest): Promise<void> {
    // AC (Autocasco)
    if (request.options.acIncluded) {
      const acCheckbox = await page.$('input[name="ac"], input[value="AC"], label:has-text("AC")');
      if (acCheckbox) {
        const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, acCheckbox);
        if (!isChecked) {
          await acCheckbox.click();
          await page.waitForTimeout(500);
        }

        // Wartość pojazdu
        if (request.options.acValue) {
          const acValueInput = await page.$('input[name="vehicleValue"], input[name="acValue"]');
          if (acValueInput) {
            await acValueInput.type(request.options.acValue.toString());
          }
        }
      }
    }

    // Assistance
    if (request.options.assistance) {
      const assistCheckbox = await page.$('input[name="assistance"], input[value="ASSISTANCE"]');
      if (assistCheckbox) {
        await assistCheckbox.click();
        await page.waitForTimeout(300);
      }
    }

    // NNW
    if (request.options.nnw) {
      const nnwCheckbox = await page.$('input[name="nnw"], input[value="NNW"]');
      if (nnwCheckbox) {
        await nnwCheckbox.click();
        await page.waitForTimeout(300);
      }
    }
  }

  private async extractQuote(page: Page, request: CalculationRequest): Promise<InsuranceQuote> {
    const parsePrice = (text: string): number => {
      const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    };

    // Cena OC
    let ocPrice = 0;
    try {
      const ocText = await page.$eval(
        '.oc-price, [data-product="OC"] .price, .price-oc',
        el => el.textContent || ''
      );
      ocPrice = parsePrice(ocText);
    } catch {
      console.log('[Uniqa] Nie znaleziono ceny OC');
    }

    // Cena AC
    let acPrice;
    if (request.options.acIncluded) {
      try {
        const acText = await page.$eval(
          '.ac-price, [data-product="AC"] .price, .price-ac',
          el => el.textContent || ''
        );
        acPrice = parsePrice(acText);
      } catch {
        console.log('[Uniqa] Nie znaleziono ceny AC');
      }
    }

    // Całkowita cena
    let totalPrice = 0;
    try {
      const totalText = await page.$eval(
        '.total-price, .summary-price, .final-price, .offer-price',
        el => el.textContent || ''
      );
      totalPrice = parsePrice(totalText);
    } catch {
      // Jeśli brak, sumuj dostępne ceny
      totalPrice = ocPrice + (acPrice || 0);
    }

    // Opcje płatności
    let paymentOptions;
    try {
      const monthlyText = await page.$eval('.monthly-payment, .price-monthly', el => el.textContent || '').catch(() => '0');
      const quarterlyText = await page.$eval('.quarterly-payment, .price-quarterly', el => el.textContent || '').catch(() => '0');
      
      paymentOptions = {
        annual: totalPrice,
        quarterly: parsePrice(quarterlyText),
        monthly: parsePrice(monthlyText),
      };
    } catch {}

    return {
      company: 'Uniqa',
      ocPrice: ocPrice || undefined,
      acPrice,
      totalPrice,
      currency: 'PLN',
      paymentOptions,
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      additionalInfo: {
        onlineDiscount: '15%', // Uniqa oferuje 15% zniżki online
      },
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Uniqa] Przeglądarka zamknięta');
    }
  }
}

export default UniqaScraper;
