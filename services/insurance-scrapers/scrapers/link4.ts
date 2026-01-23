import puppeteer, { Browser, Page } from 'puppeteer';
import type { CalculationRequest, InsuranceQuote, ScraperResult } from '../types';

/**
 * Link4 Scraper
 * 
 * Link4 to direct insurer z prostym kalkulatorem online.
 * URL: https://www.link4.pl/kalkulator-oc-ac
 * 
 * UWAGA: Ten scraper jest przykładowy i może wymagać aktualizacji
 * selektorów CSS po zmianach na stronie Link4.
 */

export class Link4Scraper {
  private browser: Browser | null = null;

  /**
   * Inicjalizuje przeglądarkę Puppeteer
   */
  private async initBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    this.browser = await puppeteer.launch({
      headless: true, // zmień na false dla debugowania
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

  /**
   * Główna funkcja scrapingu
   */
  async scrape(request: CalculationRequest): Promise<ScraperResult> {
    const startTime = Date.now();
    let page: Page | null = null;

    try {
      console.log('[Link4] Rozpoczynam kalkulację...');
      
      const browser = await this.initBrowser();
      page = await browser.newPage();

      // Ustawienia strony
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Nawigacja do kalkulatora
      console.log('[Link4] Ładuję stronę kalkulatora...');
      await page.goto('https://www.link4.pl/kalkulator-oc-ac', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Wypełnianie formularza
      console.log('[Link4] Wypełniam formularz...');
      
      // Przykład: numer rejestracyjny (jeśli podany)
      if (request.vehicle.registrationNumber) {
        await page.waitForSelector('input[name="registrationNumber"]', { timeout: 5000 });
        await page.type('input[name="registrationNumber"]', request.vehicle.registrationNumber);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
      } else {
        // Ręczne wprowadzanie danych pojazdu
        await this.fillVehicleData(page, request);
      }

      // Dane kierowcy
      await this.fillDriverData(page, request);

      // Opcje ubezpieczenia
      await this.selectInsuranceOptions(page, request);

      // Kliknięcie przycisku kalkulacji
      console.log('[Link4] Obliczam składkę...');
      await page.click('button[type="submit"], button.calculate-button');
      
      // Czekaj na wyniki
      await page.waitForSelector('.price-result, .quote-price', { timeout: 15000 });
      await page.waitForTimeout(2000);

      // Ekstrakcja danych z wyników
      const quote = await this.extractQuote(page, request);

      const executionTime = Date.now() - startTime;
      console.log(`[Link4] ✅ Kalkulacja zakończona w ${executionTime}ms`);

      return {
        success: true,
        quote,
        executionTime,
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('[Link4] ❌ Błąd:', error.message);

      // Opcjonalnie: zrób screenshot dla debugowania
      if (page) {
        try {
          await page.screenshot({ 
            path: `./logs/link4-error-${Date.now()}.png`,
            fullPage: true 
          });
        } catch (screenshotError) {
          // Ignoruj błędy screenshota
        }
      }

      return {
        success: false,
        error: `Link4 scraping failed: ${error.message}`,
        executionTime,
      };

    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Wypełnia dane pojazdu
   */
  private async fillVehicleData(page: Page, request: CalculationRequest): Promise<void> {
    // Marka
    await page.waitForSelector('select[name="brand"], input[name="brand"]');
    await page.select('select[name="brand"]', request.vehicle.brand);
    await page.waitForTimeout(500);

    // Model
    await page.waitForSelector('select[name="model"]');
    await page.select('select[name="model"]', request.vehicle.model);
    await page.waitForTimeout(500);

    // Rok produkcji
    await page.type('input[name="year"]', request.vehicle.year.toString());
    
    // Pojemność silnika (opcjonalnie)
    if (request.vehicle.engineCapacity) {
      await page.type('input[name="engineCapacity"]', request.vehicle.engineCapacity.toString());
    }
  }

  /**
   * Wypełnia dane kierowcy
   */
  private async fillDriverData(page: Page, request: CalculationRequest): Promise<void> {
    // Wiek kierowcy
    await page.type('input[name="age"]', request.driver.age.toString());

    // Data prawa jazdy
    const licenseYear = request.driver.drivingLicenseDate.getFullYear();
    await page.type('input[name="licenseYear"]', licenseYear.toString());

    // Historia szkód
    if (request.driver.accidentHistory && request.driver.accidentHistory > 0) {
      await page.select('select[name="accidents"]', request.driver.accidentHistory.toString());
    }
  }

  /**
   * Wybiera opcje ubezpieczenia
   */
  private async selectInsuranceOptions(page: Page, request: CalculationRequest): Promise<void> {
    // AC (autocasco)
    if (request.options.acIncluded) {
      const acCheckbox = await page.$('input[name="ac"], input[type="checkbox"][value="ac"]');
      if (acCheckbox) {
        await acCheckbox.click();
        await page.waitForTimeout(500);
        
        // Wartość pojazdu dla AC
        if (request.options.acValue) {
          await page.type('input[name="acValue"]', request.options.acValue.toString());
        }
      }
    }

    // Assistance
    if (request.options.assistance) {
      const assistCheckbox = await page.$('input[name="assistance"]');
      if (assistCheckbox) {
        await assistCheckbox.click();
      }
    }

    // NNW
    if (request.options.nnw) {
      const nnwCheckbox = await page.$('input[name="nnw"]');
      if (nnwCheckbox) {
        await nnwCheckbox.click();
      }
    }
  }

  /**
   * Ekstraktuje ofertę cenową ze strony wyników
   */
  private async extractQuote(page: Page, request: CalculationRequest): Promise<InsuranceQuote> {
    // Cena OC
    const ocPriceText = await page.$eval(
      '.oc-price, .price-oc, [data-testid="oc-price"]',
      el => el.textContent || ''
    ).catch(() => '0');

    // Cena AC (jeśli wybrana)
    let acPriceText = '0';
    if (request.options.acIncluded) {
      acPriceText = await page.$eval(
        '.ac-price, .price-ac, [data-testid="ac-price"]',
        el => el.textContent || ''
      ).catch(() => '0');
    }

    // Całkowita cena
    const totalPriceText = await page.$eval(
      '.total-price, .price-total, [data-testid="total-price"]',
      el => el.textContent || ''
    ).catch(() => '0');

    // Parsowanie cen (usuń wszystko poza cyframi i kropką/przecinkiem)
    const parsePrice = (text: string): number => {
      const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    };

    const ocPrice = parsePrice(ocPriceText);
    const acPrice = request.options.acIncluded ? parsePrice(acPriceText) : undefined;
    const totalPrice = parsePrice(totalPriceText);

    // Opcje płatności (jeśli dostępne)
    let paymentOptions;
    try {
      const monthlyPrice = await page.$eval('.monthly-price', el => el.textContent || '').catch(() => '0');
      const quarterlyPrice = await page.$eval('.quarterly-price', el => el.textContent || '').catch(() => '0');
      
      paymentOptions = {
        annual: totalPrice,
        quarterly: parsePrice(quarterlyPrice),
        monthly: parsePrice(monthlyPrice),
      };
    } catch {
      // Brak informacji o ratach
    }

    return {
      company: 'Link4',
      ocPrice,
      acPrice,
      totalPrice,
      currency: 'PLN',
      paymentOptions,
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dni
    };
  }

  /**
   * Zamyka przeglądarkę
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Link4] Przeglądarka zamknięta');
    }
  }
}

export default Link4Scraper;
