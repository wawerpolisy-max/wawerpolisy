/**
 * Utility functions dla systemu kalkulacji ubezpieczeń
 */

import type { InsuranceQuote, ScraperResult } from '@/services/insurance-scrapers/types';

/**
 * Formatuje cenę do formatu PLN
 */
export function formatPrice(price: number, currency: string = 'PLN'): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Sortuje oferty według ceny (od najtańszej)
 */
export function sortQuotesByPrice(results: ScraperResult[]): ScraperResult[] {
  return results
    .filter(r => r.success && r.quote)
    .sort((a, b) => {
      const priceA = a.quote?.totalPrice || Infinity;
      const priceB = b.quote?.totalPrice || Infinity;
      return priceA - priceB;
    });
}

/**
 * Znajduje najtańszą ofertę
 */
export function findCheapestQuote(results: ScraperResult[]): ScraperResult | null {
  const sorted = sortQuotesByPrice(results);
  return sorted[0] || null;
}

/**
 * Oblicza średnią cenę z dostępnych ofert
 */
export function calculateAveragePrice(results: ScraperResult[]): number {
  const validResults = results.filter(r => r.success && r.quote);
  if (validResults.length === 0) return 0;

  const sum = validResults.reduce((acc, r) => acc + (r.quote?.totalPrice || 0), 0);
  return sum / validResults.length;
}

/**
 * Oblicza ile można zaoszczędzić wybierając najtańszą ofertę
 */
export function calculateSavings(results: ScraperResult[]): {
  cheapest: number;
  average: number;
  savings: number;
  savingsPercent: number;
} {
  const cheapest = findCheapestQuote(results);
  const average = calculateAveragePrice(results);
  
  if (!cheapest || !cheapest.quote) {
    return { cheapest: 0, average: 0, savings: 0, savingsPercent: 0 };
  }

  const cheapestPrice = cheapest.quote.totalPrice;
  const savings = average - cheapestPrice;
  const savingsPercent = average > 0 ? (savings / average) * 100 : 0;

  return {
    cheapest: cheapestPrice,
    average,
    savings,
    savingsPercent,
  };
}

/**
 * Generuje podsumowanie ofert
 */
export function generateQuoteSummary(results: ScraperResult[]): {
  total: number;
  successful: number;
  failed: number;
  quotes: InsuranceQuote[];
  cheapest?: InsuranceQuote;
  average: number;
  savings: {
    amount: number;
    percent: number;
  };
} {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const quotes = successful.map(r => r.quote!).filter(Boolean);
  
  const cheapestResult = findCheapestQuote(results);
  const savings = calculateSavings(results);

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    quotes,
    cheapest: cheapestResult?.quote,
    average: savings.average,
    savings: {
      amount: savings.savings,
      percent: savings.savingsPercent,
    },
  };
}

/**
 * Sprawdza czy oferta jest nadal ważna
 */
export function isQuoteValid(quote: InsuranceQuote): boolean {
  if (!quote.validUntil) return true;
  return new Date() < new Date(quote.validUntil);
}

/**
 * Filtruje tylko ważne oferty
 */
export function filterValidQuotes(results: ScraperResult[]): ScraperResult[] {
  return results.filter(r => {
    if (!r.success || !r.quote) return false;
    return isQuoteValid(r.quote);
  });
}

/**
 * Helper do tworzenia przykładowego request
 */
export function createSampleRequest() {
  return {
    vehicle: {
      registrationNumber: 'WA12345',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2020,
      engineCapacity: 1600,
      fuelType: 'benzyna' as const,
    },
    driver: {
      age: 35,
      drivingLicenseDate: new Date('2005-06-15'),
      accidentHistory: 0,
    },
    options: {
      ocOnly: false,
      acIncluded: true,
      assistance: true,
      nnw: false,
      acValue: 45000,
    },
  };
}
