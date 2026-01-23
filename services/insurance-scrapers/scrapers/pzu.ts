import puppeteer, { Browser, Page } from 'puppeteer';
import type { CalculationRequest, InsuranceQuote, ScraperResult } from '../types';

/**
 * PZU Scraper
 * 
 * PZU - największe towarzystwo ubezpieczeniowe w Polsce
 * URL kalkulatora: https://www.pzu.pl/indywidualni/oferta/samochod-i-komunikacja/ubezpieczenie-oc-ac
 * 
 * PZU ma rozbudowany kalkulator z wieloma krokami.
 */

export class PzuScraper {
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
      console.log('[PZU] Rozpoczynam kalkulację...');
      
      const browser = await this.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log('[PZU] Ładuję stronę kalkulatora...');
      
      // PZU ma kilka możliwych entry points - spróbujmy głównego
      await page.goto('https://www.pzu.pl/indywidualni/oferta/samochod-i-komunikacja/ubezpieczenie-oc-ac', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Czekaj na załadowanie strony
      await page.waitForTimeout(2000);

      // Szukaj przycisku "Kup online" lub "Oblicz składkę"
      const startButtons = [
        'a[href*="kalkulator"]',
        'button:has-text("Kup online")',
        'button:has-text("Oblicz")',
        '.cta-button',
        '[data-testid="calculate-button"]',
      ];

      let buttonClicked = false;
      for (const selector of startButtons) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            buttonClicked = true;
            console.log('[PZU] Kliknięto przycisk startu');
            await page.waitForTimeout(2000);
            break;
          }
        } catch {}
      }

      // Jeśli nie znaleziono przycisku, może już jesteśmy na formularzu
      if (!buttonClicked) {
        console.log('[PZU] Już na formularzu');
      }

      console.log('[PZU] Wypełniam formularz...');

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

      // KROK 4: Przejdź dalej / Oblicz
      console.log('[PZU] Obliczam składkę...');
      
      const nextButtons = [
        'button[type="submit"]',
        'button:has-text("Dalej")',
        'button:has-text("Oblicz")',
        'button:has-text("Pokaż ofertę")',
        '.next-button',
        '.submit-button',
      ];

      for (const selector of nextButtons) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            console.log('[PZU] Kliknięto przycisk obliczenia');
            break;
          }
        } catch {}
      }

      // Czekaj na wyniki - PZU może przekierować na stronę z ofertą
      const resultSelectors = [
        '.offer-price',
        '.premium-amount',
        '.price-summary',
        '[data-testid="price"]',
        '.calculated-price',
      ];

      let resultsFound = false;
      for (const selector of resultSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 15000 });
          resultsFound = true;
          console.log('[PZU] Znaleziono wyniki');
          break;
        } catch {}
      }

      if (!resultsFound) {
        // Czekaj trochę na wyniki
        await page.waitForTimeout(5000);
      }

      // Ekstrakcja oferty
      const quote = await this.extractQuote(page, request);

      const executionTime = Date.now() - startTime;
      console.log(`[PZU] ✅ Kalkulacja zakończona w ${executionTime}ms`);

      return {
        success: true,
        quote,
        executionTime,
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('[PZU] ❌ Błąd:', error.message);

      if (page) {
        try {
          await page.screenshot({ 
            path: `./logs/pzu-error-${Date.now()}.png`,
            fullPage: true 
          });
          console.log('[PZU] Screenshot zapisany w ./logs/');
        } catch {}
      }

      return {
        success: false,
        error: `PZU scraping failed: ${error.message}`,
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
      'input[id*="regNumber"]',
      'input[name="plateNumber"]',
    ];

    for (const selector of regSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.type(request.vehicle.registrationNumber!);
          console.log('[PZU] Wpisano numer rejestracyjny');
          
          // Szukaj przycisku sprawdzenia
          await page.waitForTimeout(1000);
          const checkButton = await page.$('button:has-text("Sprawdź"), button:has-text("Szukaj")');
          if (checkButton) {
            await checkButton.click();
            await page.waitForTimeout(3000);
          } else {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(2000);
          }
          return;
        }
      } catch {}
    }

    console.log('[PZU] Nie znaleziono pola rejestracji, przechodzę na tryb manualny');
    await this.fillVehicleDataManually(page, request);
  }

  private async fillVehicleDataManually(page: Page, request: CalculationRequest): Promise<void> {
    // Przycisk "Wprowadź dane ręcznie"
    try {
      const manualButton = await page.$('button:has-text("ręcznie"), a:has-text("ręcznie")');
      if (manualButton) {
        await manualButton.click();
        await page.waitForTimeout(1000);
      }
    } catch {}

    // Marka pojazdu
    const brandSelectors = [
      'select[name*="brand"]',
      'select[name*="marka"]',
      'select[id*="brand"]',
      'input[name*="brand"]',
    ];

    for (const selector of brandSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            // Najpierw sprawdź czy marka jest w opcjach
            const options = await page.$$eval(`${selector} option`, opts => 
              opts.map(opt => opt.value.toLowerCase())
            );
            const brandLower = request.vehicle.brand.toLowerCase();
            const matchingOption = options.find(opt => opt.includes(brandLower) || brandLower.includes(opt));
            
            if (matchingOption) {
              await page.select(selector, matchingOption);
            } else {
              // Próbuj po prostu wybrać wartość
              await page.select(selector, request.vehicle.brand);
            }
          } else if (tagName === 'INPUT') {
            await element.type(request.vehicle.brand);
            await page.waitForTimeout(500);
            // Może pojawić się dropdown z sugestiami
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
          }
          
          console.log('[PZU] Wybrano markę pojazdu');
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log('[PZU] Błąd przy marce:', e);
      }
    }

    // Model pojazdu
    const modelSelectors = [
      'select[name*="model"]',
      'input[name*="model"]',
    ];

    for (const selector of modelSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await page.waitForTimeout(500);
          const tagName = await page.evaluate(el => el.tagName, element);
          
          if (tagName === 'SELECT') {
            const options = await page.$$eval(`${selector} option`, opts => 
              opts.map(opt => opt.value.toLowerCase())
            );
            const modelLower = request.vehicle.model.toLowerCase();
            const matchingOption = options.find(opt => opt.includes(modelLower) || modelLower.includes(opt));
            
            if (matchingOption) {
              await page.select(selector, matchingOption);
            } else {
              await page.select(selector, request.vehicle.model);
            }
          } else {
            await element.type(request.vehicle.model);
            await page.waitForTimeout(500);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
          }
          
          console.log('[PZU] Wybrano model pojazdu');
          await page.waitForTimeout(1000);
          break;
        }
      } catch {}
    }

    // Rok produkcji
    const yearSelectors = [
      'select[name*="year"]',
      'input[name*="year"]',
      'select[name*="rok"]',
      'input[name*="rok"]',
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
          console.log('[PZU] Ustawiono rok produkcji');
          await page.waitForTimeout(500);
          break;
        }
      } catch {}
    }

    // Pojemność silnika (opcjonalnie)
    if (request.vehicle.engineCapacity) {
      const engineSelectors = [
        'input[name*="engine"]',
        'input[name*="pojemnosc"]',
        'select[name*="engine"]',
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
      'input[name*="wiek"]',
      'input[name*="birthDate"]',
      'input[name*="dataUrodzenia"]',
    ];

    for (const selector of ageSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          // Sprawdź czy to pole daty czy wieku
          const placeholder = await page.evaluate(el => el.placeholder || '', input);
          
          if (placeholder.includes('data') || selector.includes('Date')) {
            // Pole daty urodzenia
            const birthYear = new Date().getFullYear() - request.driver.age;
            await input.type(`01.01.${birthYear}`);
          } else {
            // Pole wieku
            await input.type(request.driver.age.toString());
          }
          
          console.log('[PZU] Uzupełniono wiek');
          await page.waitForTimeout(500);
          break;
        }
      } catch {}
    }

    // Data prawa jazdy
    const licenseSelectors = [
      'input[name*="license"]',
      'input[name*="prawoJazdy"]',
      'select[name*="licenseYear"]',
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
            // Może wymagać pełnej daty lub tylko roku
            const placeholder = await page.evaluate(el => el.placeholder || '', element);
            if (placeholder.includes('.')) {
              await element.type(`01.01.${licenseYear}`);
            } else {
              await element.type(licenseYear.toString());
            }
          }
          
          console.log('[PZU] Uzupełniono datę prawa jazdy');
          await page.waitForTimeout(500);
          break;
        }
      } catch {}
    }

    // Historia szkód
    if (request.driver.accidentHistory !== undefined) {
      const accidentSelectors = [
        'select[name*="accident"]',
        'select[name*="szkod"]',
        'select[name*="claims"]',
        'input[name*="accidents"]',
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
    // AC (Autocasco)
    if (request.options.acIncluded) {
      const acSelectors = [
        'input[name*="ac"]',
        'input[value="AC"]',
        'input[id*="autocasco"]',
        'label:has-text("AC")',
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
              console.log('[PZU] Zaznaczono AC');
              await page.waitForTimeout(1000);
            }

            // Wartość pojazdu dla AC
            if (request.options.acValue) {
              const valueInput = await page.$('input[name*="vehicleValue"], input[name*="wartoscPojazdu"]');
              if (valueInput) {
                await valueInput.click({ clickCount: 3 }); // Zaznacz wszystko
                await valueInput.type(request.options.acValue.toString());
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
      ];

      for (const selector of assistSelectors) {
        try {
          const checkbox = await page.$(selector);
          if (checkbox) {
            await checkbox.click();
            await page.waitForTimeout(300);
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
      ];

      for (const selector of nnwSelectors) {
        try {
          const checkbox = await page.$(selector);
          if (checkbox) {
            await checkbox.click();
            await page.waitForTimeout(300);
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

    // Lista możliwych selektorów dla cen
    const priceSelectors = {
      oc: [
        '.oc-price',
        '[data-product="OC"] .price',
        '.price-oc',
        'div:has-text("OC") .amount',
        '[data-testid="oc-price"]',
      ],
      ac: [
        '.ac-price',
        '[data-product="AC"] .price',
        '.price-ac',
        'div:has-text("AC") .amount',
        '[data-testid="ac-price"]',
      ],
      total: [
        '.total-price',
        '.summary-price',
        '.final-price',
        '.premium-total',
        '[data-testid="total-price"]',
        '.calculated-premium',
      ],
    };

    let ocPrice = 0;
    let acPrice: number | undefined;
    let totalPrice = 0;

    // Szukaj ceny OC
    for (const selector of priceSelectors.oc) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        ocPrice = parsePrice(text);
        if (ocPrice > 0) {
          console.log(`[PZU] OC znaleziono: ${ocPrice} PLN`);
          break;
        }
      } catch {}
    }

    // Szukaj ceny AC (jeśli wybrana)
    if (request.options.acIncluded) {
      for (const selector of priceSelectors.ac) {
        try {
          const text = await page.$eval(selector, el => el.textContent || '');
          acPrice = parsePrice(text);
          if (acPrice && acPrice > 0) {
            console.log(`[PZU] AC znaleziono: ${acPrice} PLN`);
            break;
          }
        } catch {}
      }
    }

    // Szukaj ceny całkowitej
    for (const selector of priceSelectors.total) {
      try {
        const text = await page.$eval(selector, el => el.textContent || '');
        totalPrice = parsePrice(text);
        if (totalPrice > 0) {
          console.log(`[PZU] Total znaleziono: ${totalPrice} PLN`);
          break;
        }
      } catch {}
    }

    // Jeśli nie znaleziono sumy, oblicz
    if (totalPrice === 0) {
      totalPrice = ocPrice + (acPrice || 0);
    }

    return {
      company: 'PZU',
      ocPrice: ocPrice || undefined,
      acPrice,
      totalPrice,
      currency: 'PLN',
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      additionalInfo: {
        note: 'PZU - największe towarzystwo ubezpieczeniowe w Polsce',
      },
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[PZU] Przeglądarka zamknięta');
    }
  }
}

export default PzuScraper;
