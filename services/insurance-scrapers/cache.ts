import NodeCache from 'node-cache';
import crypto from 'crypto';
import type { CalculationRequest, ScraperResult } from './types';

/**
 * Cache Layer dla kalkulacji ubezpieczeń
 * TTL (Time To Live): 1 godzina (3600 sekund)
 * 
 * Cache pomaga:
 * - Zmniejszyć liczbę requestów do stron TU
 * - Przyspieszyć odpowiedzi dla identycznych zapytań
 * - Uniknąć blokowania IP przez TU
 */

class InsuranceCache {
  private cache: NodeCache;
  private readonly DEFAULT_TTL = 3600; // 1 godzina

  constructor(ttlSeconds: number = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: 600, // sprawdzaj co 10 minut
      useClones: false, // lepsze performance
    });
  }

  /**
   * Generuje unikalny klucz cache na podstawie danych kalkulacji
   */
  private generateCacheKey(request: CalculationRequest): string {
    const normalized = {
      company: request.insuranceCompany.toLowerCase(),
      vehicle: {
        brand: request.vehicle.brand.toLowerCase(),
        model: request.vehicle.model.toLowerCase(),
        year: request.vehicle.year,
        fuel: request.vehicle.fuelType,
      },
      driver: {
        age: request.driver.age,
        license: request.driver.drivingLicenseDate.toISOString().split('T')[0],
        accidents: request.driver.accidentHistory || 0,
      },
      options: request.options,
    };

    const dataString = JSON.stringify(normalized);
    return crypto.createHash('md5').update(dataString).digest('hex');
  }

  /**
   * Pobiera wynik z cache
   */
  get(request: CalculationRequest): ScraperResult | undefined {
    const key = this.generateCacheKey(request);
    const cached = this.cache.get<ScraperResult>(key);
    
    if (cached) {
      console.log(`[Cache HIT] ${request.insuranceCompany} - ${key.substring(0, 8)}...`);
      return {
        ...cached,
        cached: true,
      };
    }
    
    console.log(`[Cache MISS] ${request.insuranceCompany} - ${key.substring(0, 8)}...`);
    return undefined;
  }

  /**
   * Zapisuje wynik do cache
   */
  set(request: CalculationRequest, result: ScraperResult, ttl?: number): boolean {
    const key = this.generateCacheKey(request);
    const success = this.cache.set(key, result, ttl || this.DEFAULT_TTL);
    
    if (success) {
      console.log(`[Cache SET] ${request.insuranceCompany} - ${key.substring(0, 8)}... (TTL: ${ttl || this.DEFAULT_TTL}s)`);
    }
    
    return success;
  }

  /**
   * Usuwa konkretny wpis z cache
   */
  delete(request: CalculationRequest): boolean {
    const key = this.generateCacheKey(request);
    const deleted = this.cache.del(key) > 0;
    
    if (deleted) {
      console.log(`[Cache DELETE] ${request.insuranceCompany} - ${key.substring(0, 8)}...`);
    }
    
    return deleted;
  }

  /**
   * Czyści cały cache
   */
  flush(): void {
    this.cache.flushAll();
    console.log('[Cache FLUSH] Wszystkie wpisy usunięte');
  }

  /**
   * Zwraca statystyki cache
   */
  getStats() {
    return {
      keys: this.cache.keys().length,
      stats: this.cache.getStats(),
    };
  }
}

// Singleton instance
export const insuranceCache = new InsuranceCache();

export default InsuranceCache;
