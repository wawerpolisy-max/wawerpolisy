import puppeteer, { Browser, Page } from 'puppeteer';
import type { CalculationRequest, InsuranceQuote, ScraperResult } from '../types';

/**
 * Generali Scraper
 * 
 * Generali - międzynarodowe towarzystwo ubezpieczeniowe
 * URL kalkulatora: https://www.generali.pl/ubezpieczenia-komunikacyjne/oc-ac
 * 
 * Generali oferuje prosty kalkulator online
 */

export class GeneraliScraper {
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
      console.log('[Generali] Rozpoczynam kalkulację...');
      
      const browser = await this.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log('[Generali] Ładuję stronę kalkulatora...');
      
      // Możliwe URLe wejściowe
      const entryUrls = [
        'https://www.generali.pl/ubezpieczenia-komunikacyjne/oc-ac',
        'https://www.generali.pl/kalkulator',
        'https://kalkulator.generali.pl/',
      ];

      let pageLoaded = false;
      for (const url of entryUrls) {
        try {
          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 20000,
          });
          pageLoaded = true;
          console.log(`[Generali] Załadowano stronę: ${url}`);
          break;
        } catch (error) {
          console.log(`[Generali] Nie udało się załadować: ${url}`);
        }
      }

      if (!pageLoaded) {
        throw new Error('Nie udało się załadować żadnej strony Generali');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Szukaj przycisku startu kalkulatora
      const startButtons = [
        'button:has-text("Oblicz składkę")',
        'button:has-text("Kup online")',
        'a[href*="kalkulator"]',
        '.calculator-start',
        '[data-testid="start-calculator"]',
      ];

      for (const selector of startButtons) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            console.log('[Generali] Kliknięto przycisk startu');
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
          }
        } catch {}
      }

      console.log('[Generali] Wypełniam formularz...');

      // KROK 1: Dane pojazdu
      if (request.vehicle.registrationNumber) {
        await this.fillByRegistration(page, request);
      } else {
        await this.fillVehicleDataManually(page, request);
      }

      // KROK 2: Dane właściciela/kierowcy
      await this.fillDriverData(page, request);

      // KROK 3: Opcje ubezpieczenia
      await this.selectInsuranceOptions(page, request);

      // KROK 4: Oblicz składkę
      console.log('[Generali] Obliczam składkę...');
      
      const submitButtons = [
        'button[type="submit"]',
        'button:has-text("Oblicz")',
        'button:has-text("Dalej")',
        'button:has-text("Zobacz ofertę")',
        '.next-step',
        '.calculate-button',
      ];

      for (const selector of submitButtons) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            console.log('[Generali] Wysłano formularz');
            break;
          }
        } catch {}
      }

      // Czekaj na wyniki
      const resultSelectors = [
        '.offer-price',
        '.premium-value',
        '.price-result',
        '[data-testid="calculated-price"]',
        '.summary-price',
      ];

      let resultsFound = false;
      for (const selector of resultSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 15000 });
          resultsFound = true;
          console.log('[Generali] Znaleziono wyniki');
          break;
        } catch {}
      }

      if (!resultsFound) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Ekstrakcja oferty
      const quote = await this.extractQuote(page, request);

      const executionTime = Date.now() - startTime;
      console.log(`[Generali] ✅ Kalkulacja zakończona w ${executionTime}ms`);

      return {
        success: true,
        quote,
        executionTime,
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('[Generali] ❌ Błąd:', error.message);

      if (page) {
        try {
          await page.screenshot({ 
            path: `./logs/generali-error-${Date.now()}.png`,
            fullPage: true 
          });
          console.log('[Generali] Screenshot zapisany w ./logs/');
        } catch {}
      }

      return {
        success: false,
        error: `Generali scraping failed: ${error.message}`,
        executionTime,
      };

    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async fillByRegistration(page: Page, request: CalculationRequest): Promise<void> {
    const regSelectors = [
      'input[name*="registration"]',
      'input[placeholder*="rejestracyjny"]',
      'input[id*="registration"]',
      'input[name="plateNumber"]',
      'input[data-testid="registration-input"]',
    ];

    for (const selector of regSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.type(request.vehicle.registrationNumber!);
          console.log('[Generali] Wpisano numer rejestracyjny');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Szukaj przycisku sprawdzenia
          const checkButtons = [
            'button:has-text("Sprawdź")',
            'button:has-text("Szukaj")',
            'button[type="button"]',
          ];
          
          for (const btnSelector of checkButtons) {
            try {
              const btn = await page.$(btnSelector);
              if (btn) {
                await btn.click();
                await new Promise(resolve => setTimeout(resolve, 3000));
                return;
              }
            } catch {}
          }
          
          // Jeśli nie ma przycisku, naciśnij Tab/Enter
          await page.keyboard.press('Tab');
          await new Promise(resolve => setTimeout(resolve, 2000));
          return;
        }
      } catch {}
    }

    console.log('[Generali] Nie znaleziono pola rejestracji, przechodzę na tryb manualny');
    await this.fillVehicleDataManually(page, request);
  }

  private async fillVehicleDataManually(page: Page, request: CalculationRequest): Promise<void> {
    // Szukaj opcji "Wpisz dane ręcznie"
    try {
      const manualLink = await page.$('a:has-text("ręcznie"), button:has-text("ręcznie")');
      if (manualLink) {
        await manualLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch {}

    // Marka
    const brandSelectors = [
      'select[name*="brand"]',
      'input[name*="brand"]',
      'select[name*="marka"]',
      '[data-testid="brand-select"]',
    ];

    for (const selector of brandSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            await page.select(selector, request.vehicle.brand);
          } else {
            await element.type(request.vehicle.brand);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
          }
          
          console.log('[Generali] Wybrano markę');
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        }
      } catch (e) {
        console.log('[Generali] Błąd przy marce:', e);
      }
    }

    // Model
    const modelSelectors = [
      'select[name*="model"]',
      'input[name*="model"]',
      '[data-testid="model-select"]',
    ];

    for (const selector of modelSelectors) {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            await page.select(selector, request.vehicle.model);
          } else {
            await element.type(request.vehicle.model);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
          }
          
          console.log('[Generali] Wybrano model');
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        }
      } catch {}
    }

    // Rok produkcji
    const yearSelectors = [
      'select[name*="year"]',
      'input[name*="year"]',
      'select[name*="rok"]',
      '[data-testid="year-select"]',
    ];

    for (const selector of yearSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            await page.select(selector, request.vehicle.year.toString());
          } else {
            await element.type(request.vehicle.year.toString());
          }
          
          console.log('[Generali] Ustawiono rok');
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      } catch {}
    }

    // Pojemność silnika
    if (request.vehicle.engineCapacity) {
      const engineSelectors = [
        'input[name*="engine"]',
        'input[name*="pojemnosc"]',
        'select[name*="capacity"]',
      ];

      for (const selector of engineSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            const tagName = await page.evaluate(el => el.tagName, element);
            
            if (tagName === 'SELECT') {
              await page.select(selector, request.vehicle.engineCapacity.toString());
            } else {
              await element.type(request.vehicle.engineCapacity.toString());
            }
            break;
          }
        } catch {}
      }
    }

    // Rodzaj paliwa
    if (request.vehicle.fuelType) {
      const fuelSelectors = [
        'select[name*="fuel"]',
        'select[name*="paliwo"]',
        '[data-testid="fuel-type"]',
      ];

      for (const selector of fuelSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await page.select(selector, request.vehicle.fuelType);
            break;
          }
        } catch {}
      }
    }
  }

  private async fillDriverData(page: Page, request: CalculationRequest): Promise<void> {
    // Wiek lub data urodzenia
    const ageSelectors = [
      'input[name*="age"]',
      'input[name*="birthDate"]',
      'select[name*="age"]',
      '[data-testid="age-input"]',
    ];

    for (const selector of ageSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            await page.select(selector, request.driver.age.toString());
          } else {
            const type = await page.evaluate(el => (el as HTMLInputElement).type, element);
            
            if (type === 'date' || selector.includes('Date')) {
              const birthYear = new Date().getFullYear() - request.driver.age;
              const birthDate = `${birthYear}-01-01`;
              await element.type(birthDate);
            } else {
              await element.type(request.driver.age.toString());
            }
          }
          
          console.log('[Generali] Uzupełniono wiek');
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      } catch {}
    }

    // Data prawa jazdy
    const licenseSelectors = [
      'input[name*="license"]',
      'select[name*="licenseYear"]',
      'input[name*="drivingLicense"]',
      '[data-testid="license-date"]',
    ];

    for (const selector of licenseSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          const licenseYear = request.driver.drivingLicenseDate.getFullYear();
          
          if (tagName === 'SELECT') {
            await page.select(selector, licenseYear.toString());
          } else {
            const type = await page.evaluate(el => (el as HTMLInputElement).type, element);
            
            if (type === 'date') {
              await element.type(`${licenseYear}-01-01`);
            } else {
              await element.type(licenseYear.toString());
            }
          }
          
          console.log('[Generali] Uzupełniono prawo jazdy');
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      } catch {}
    }

    // Historia szkód
    if (request.driver.accidentHistory !== undefined) {
      const accidentSelectors = [
        'select[name*="accident"]',
        'select[name*="claims"]',
        'input[name*="accidents"]',
        '[data-testid="claims-count"]',
      ];

      for (const selector of accidentSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            const tagName = await page.evaluate(el => el.tagName, element);
            
            if (tagName === 'SELECT') {
              await page.select(selector, request.driver.accidentHistory.toString());
            } else {
              await element.type(request.driver.accidentHistory.toString());
            }
            break;
          }
        } catch {}
      }
    }
  }

  private async selectInsuranceOptions(page: Page, request: CalculationRequest): Promise<void> {
    // AC
    if (request.options.acIncluded) {
      const acSelectors = [
        'input[name*="ac"]',
        'input[value="AC"]',
        'input[id*="autocasco"]',
        '[data-testid="ac-checkbox"]',
      ];

      for (const selector of acSelectors) {
        try {
          const checkbox = await page.$(selector);
          if (checkbox) {
            const isChecked = await page.evaluate(el => {
              if (el.tagName === 'INPUT') {
                return (el as HTMLInputElement).checked;
              }
              return false;
            }, checkbox);
            
            if (!isChecked) {
              await checkbox.click();
              console.log('[Generali] Zaznaczono AC');
              await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Wartość pojazdu
            if (request.options.acValue) {
              const valueSelectors = [
                'input[name*="vehicleValue"]',
                'input[name*="wartoscPojazdu"]',
                'input[name*="acValue"]',
              ];

              for (const valSelector of valueSelectors) {
                try {
                  const valueInput = await page.$(valSelector);
                  if (valueInput) {
                    await valueInput.click({ clickCount: 3 });
                    await valueInput.type(request.options.acValue.toString());
                    break;
                  }
                } catch {}
              }
            }
            break;
          }
        } catch {}
      }
    }

    // Assistance
    if (request.options.assistance) {
      const assistSelectors = [
        'input[name*="assistance"]',
        'input[value*="ASSISTANCE"]',
        '[data-testid="assistance-checkbox"]',
      ];

      for (const selector of assistSelectors) {
        try {
          const checkbox = await page.$(selector);
          if (checkbox) {
            await checkbox.click();
            await new Promise(resolve => setTimeout(resolve, 300));
            break;
          }
        } catch {}
      }
    }

    // NNW
    if (request.options.nnw) {
      const nnwSelectors = [
        'input[name*="nnw"]',
        'input[value="NNW"]',
        '[data-testid="nnw-checkbox"]',
      ];

      for (const selector of nnwSelectors) {
        try {
          const checkbox = await page.$(selector);
          if (checkbox) {
            await checkbox.click();
            await new Promise(resolve => setTimeout(resolve, 300));
            break;
          }
        } catch {}
      }
    }
  }

  private async extractQuote(page: Page, request: CalculationRequest): Promise<InsuranceQuote> {
    const parsePrice = (text: string): number => {
      const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    };

    const priceSelectors = {
      oc: [
        '.oc-price',
        '[data-product="OC"] .price',
        '.price-oc',
        '[data-testid="oc-price"]',
      ],
      ac: [
        '.ac-price',
        '[data-product="AC"] .price',
        '.price-ac',
        '[data-testid="ac-price"]',
      ],
      total: [
        '.total-price',
        '.premium-total',
        '.summary-price',
        '[data-testid="total-price"]',
      ],
    };

    let ocPrice = 0;
    let acPrice: number | undefined;
    let totalPrice = 0;

    // OC
    for (const selector of priceSelectors.oc) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        ocPrice = parsePrice(text);
        if (ocPrice > 0) break;
      } catch {}
    }

    // AC
    if (request.options.acIncluded) {
      for (const selector of priceSelectors.ac) {
        try {
          const text = await page.$eval(selector, el => el.textContent || '');
          acPrice = parsePrice(text);
          if (acPrice && acPrice > 0) break;
        } catch {}
      }
    }

    // Total
    for (const selector of priceSelectors.total) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        totalPrice = parsePrice(text);
        if (totalPrice > 0) break;
      } catch {}
    }

    if (totalPrice === 0) {
      totalPrice = ocPrice + (acPrice || 0);
    }

    return {
      company: 'Generali',
      ocPrice: ocPrice || undefined,
      acPrice,
      totalPrice,
      currency: 'PLN',
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      additionalInfo: {
        note: 'Generali - międzynarodowe towarzystwo ubezpieczeniowe',
      },
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Generali] Przeglądarka zamknięta');
    }
  }
}

export default GeneraliScraper;
