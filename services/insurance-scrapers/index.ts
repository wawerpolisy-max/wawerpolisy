/**
 * Insurance Scrapers Orchestrator
 * 
 * Główny moduł do zarządzania scrapingiem różnych towarzystw ubezpieczeniowych
 */

import type { CalculationRequest, ScraperResult, InsuranceCompany } from './types';
import { insuranceCache } from './cache';
import PzuScraper from './scrapers/pzu';
import GeneraliScraper from './scrapers/generali';
import UniqaScraper from './scrapers/uniqa';

/**
 * Mapa dostępnych scraperów
 */
const scrapers = {
  pzu: new PzuScraper(),
  generali: new GeneraliScraper(),
  uniqa: new UniqaScraper(),
  // TODO: Dodaj pozostałe towarzystwa
  // warta: new WartaScraper(),
  // link4: new Link4Scraper(),
  // compensa: new CompensaScraper(),
  // wiener: new WienerScraper(),
  // trasti: new TrastiScraper(),
  // proama: new ProamaScraper(),
  // allianz: new AllianzScraper(),
  // tuw: new TuwScraper(),
};

/**
 * Sprawdza czy scraper jest dostępny dla danego towarzystwa
 */
export function isScraperAvailable(company: InsuranceCompany): boolean {
  return company in scrapers;
}

/**
 * Zwraca listę dostępnych towarzystw
 */
export function getAvailableCompanies(): InsuranceCompany[] {
  return Object.keys(scrapers) as InsuranceCompany[];
}

/**
 * Główna funkcja do kalkulacji składki ubezpieczeniowej
 * 
 * @param request - Dane do kalkulacji
 * @param useCache - Czy użyć cache (domyślnie true)
 * @returns Wynik kalkulacji
 */
export async function calculateInsurance(
  request: CalculationRequest,
  useCache: boolean = true
): Promise<ScraperResult> {
  const company = request.insuranceCompany.toLowerCase() as InsuranceCompany;

  console.log(`\n🔍 [Orchestrator] Rozpoczynam kalkulację dla: ${company.toUpperCase()}`);

  // Sprawdź dostępność scrapera
  if (!isScraperAvailable(company)) {
    console.error(`❌ [Orchestrator] Scraper dla ${company} nie jest jeszcze zaimplementowany`);
    return {
      success: false,
      error: `Scraper for ${company} is not yet implemented. Available companies: ${getAvailableCompanies().join(', ')}`,
    };
  }

  // Sprawdź cache (jeśli włączony)
  if (useCache) {
    const cached = insuranceCache.get(request);
    if (cached) {
      console.log(`✅ [Orchestrator] Zwracam wynik z cache`);
      return cached;
    }
  }

  // Wykonaj scraping
  try {
    const scraper = scrapers[company];
    console.log(`🌐 [Orchestrator] Uruchamiam scraper dla ${company}...`);
    
    const result = await scraper.scrape(request);

    // Zapisz do cache jeśli sukces
    if (result.success && useCache) {
      insuranceCache.set(request, result);
    }

    return result;

  } catch (error: any) {
    console.error(`❌ [Orchestrator] Nieoczekiwany błąd:`, error);
    return {
      success: false,
      error: `Unexpected error: ${error.message}`,
    };
  }
}

/**
 * Kalkuluje składki we wszystkich dostępnych towarzystwach
 * 
 * @param baseRequest - Podstawowe dane (bez company)
 * @param companies - Lista towarzystw (domyślnie wszystkie dostępne)
 * @returns Array wyników
 */
export async function calculateInMultipleCompanies(
  baseRequest: Omit<CalculationRequest, 'insuranceCompany'>,
  companies?: InsuranceCompany[]
): Promise<ScraperResult[]> {
  const targetCompanies = companies || getAvailableCompanies();
  
  console.log(`\n🎯 [Orchestrator] Kalkulacja w ${targetCompanies.length} towarzystwach: ${targetCompanies.join(', ')}`);

  const promises = targetCompanies.map(company => 
    calculateInsurance({
      ...baseRequest,
      insuranceCompany: company,
    })
  );

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        error: `Failed to calculate for ${targetCompanies[index]}: ${result.reason}`,
      };
    }
  });
}

/**
 * Zamyka wszystkie aktywne przeglądarki
 */
export async function closeAllBrowsers(): Promise<void> {
  console.log('\n🔒 [Orchestrator] Zamykam wszystkie przeglądarki...');
  
  const closePromises = Object.values(scrapers).map(scraper => 
    scraper.close().catch(err => console.error('Error closing browser:', err))
  );

  await Promise.all(closePromises);
  console.log('✅ [Orchestrator] Wszystkie przeglądarki zamknięte');
}

/**
 * Czyści cache
 */
export function clearCache(): void {
  insuranceCache.flush();
}

/**
 * Zwraca statystyki cache
 */
export function getCacheStats() {
  return insuranceCache.getStats();
}

// Eksport poszczególnych scraperów (dla zaawansowanego użycia)
export { PzuScraper, GeneraliScraper, UniqaScraper };

// Eksport typów
export * from './types';
