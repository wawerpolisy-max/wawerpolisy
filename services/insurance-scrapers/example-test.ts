/**
 * Przykład testowy systemu kalkulacji ubezpieczeń
 * 
 * Uruchom: npx tsx services/insurance-scrapers/example-test.ts
 * Lub: node --loader ts-node/esm services/insurance-scrapers/example-test.ts
 */

import { 
  calculateInsurance, 
  calculateInMultipleCompanies,
  getAvailableCompanies,
  getCacheStats,
  closeAllBrowsers
} from './index';

async function main() {
  console.log('🚗 System Kalkulacji Ubezpieczeń - Test\n');

  // 1. Lista dostępnych towarzystw
  console.log('📋 Dostępne towarzystwa:');
  const companies = getAvailableCompanies();
  console.log(companies.join(', '));
  console.log(`Razem: ${companies.length} towarzystw\n`);

  // 2. Przykładowe dane do kalkulacji
  const testData = {
    vehicle: {
      registrationNumber: 'WA12345', // Opcjonalnie
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2020,
      engineCapacity: 1600,
      fuelType: 'benzyna' as const,
    },
    driver: {
      age: 35,
      drivingLicenseDate: new Date('2005-06-15'),
      accidentHistory: 0, // Brak szkód
    },
    options: {
      ocOnly: false,
      acIncluded: true, // Z autocasco
      assistance: true,
      nnw: false,
      acValue: 45000, // Wartość pojazdu dla AC
    },
  };

  console.log('📝 Dane testowe:');
  console.log(`Pojazd: ${testData.vehicle.brand} ${testData.vehicle.model} (${testData.vehicle.year})`);
  console.log(`Kierowca: ${testData.driver.age} lat, prawo jazdy od ${testData.driver.drivingLicenseDate.getFullYear()}`);
  console.log(`Opcje: OC + AC (${testData.options.acValue} PLN), Assistance\n`);

  // 3. Test pojedynczego towarzystwa (szybki test)
  console.log('🔍 TEST 1: Kalkulacja dla PZU');
  console.log('─'.repeat(50));
  
  try {
    const pzuResult = await calculateInsurance({
      ...testData,
      insuranceCompany: 'pzu',
    });

    if (pzuResult.success && pzuResult.quote) {
      console.log('✅ Sukces!');
      console.log(`OC: ${pzuResult.quote.ocPrice} PLN`);
      console.log(`AC: ${pzuResult.quote.acPrice} PLN`);
      console.log(`TOTAL: ${pzuResult.quote.totalPrice} PLN`);
      console.log(`Czas wykonania: ${pzuResult.executionTime}ms`);
      console.log(`Z cache: ${pzuResult.cached ? 'TAK' : 'NIE'}`);
    } else {
      console.log('❌ Błąd:', pzuResult.error);
    }
  } catch (error: any) {
    console.error('❌ Wyjątek:', error.message);
  }

  console.log('\n');

  // 4. Test cache (ten sam request powinien być z cache)
  console.log('🔍 TEST 2: Ponowna kalkulacja (test cache)');
  console.log('─'.repeat(50));
  
  try {
    const cachedResult = await calculateInsurance({
      ...testData,
      insuranceCompany: 'pzu',
    });

    if (cachedResult.success && cachedResult.quote) {
      console.log('✅ Sukces!');
      console.log(`TOTAL: ${cachedResult.quote.totalPrice} PLN`);
      console.log(`Czas wykonania: ${cachedResult.executionTime}ms`);
      console.log(`Z cache: ${cachedResult.cached ? 'TAK ⚡' : 'NIE'}`);
    }
  } catch (error: any) {
    console.error('❌ Wyjątek:', error.message);
  }

  console.log('\n');

  // 5. Statystyki cache
  console.log('📊 Statystyki cache:');
  console.log('─'.repeat(50));
  const stats = getCacheStats();
  console.log(`Liczba wpisów: ${stats.keys}`);
  console.log(`Hits: ${stats.stats.hits}`);
  console.log(`Misses: ${stats.stats.misses}`);
  console.log(`Hit rate: ${stats.stats.hits > 0 ? ((stats.stats.hits / (stats.stats.hits + stats.stats.misses)) * 100).toFixed(2) : 0}%`);
  
  console.log('\n');

  // 6. Test multi-company (UWAGA: To zajmie więcej czasu!)
  console.log('🔍 TEST 3: Kalkulacja we wszystkich towarzystwach');
  console.log('─'.repeat(50));
  console.log('⚠️  To może potrwać 10-30 sekund...\n');

  try {
    const multiResults = await calculateInMultipleCompanies(testData);

    console.log('\n📊 Wyniki:');
    console.log('─'.repeat(50));

    const successful = multiResults.filter(r => r.success);
    const failed = multiResults.filter(r => !r.success);

    // Wyświetl udane
    if (successful.length > 0) {
      console.log('\n✅ Udane kalkulacje:');
      successful
        .sort((a, b) => (a.quote?.totalPrice || Infinity) - (b.quote?.totalPrice || Infinity))
        .forEach((result, index) => {
          const quote = result.quote!;
          console.log(`  ${index + 1}. ${quote.company.toUpperCase()}: ${quote.totalPrice} PLN`);
        });

      // Najtańsza oferta
      const cheapest = successful[0];
      console.log(`\n💰 Najtańsza oferta: ${cheapest.quote?.company} - ${cheapest.quote?.totalPrice} PLN`);

      // Średnia cena
      const avgPrice = successful.reduce((sum, r) => sum + (r.quote?.totalPrice || 0), 0) / successful.length;
      console.log(`📈 Średnia cena: ${avgPrice.toFixed(2)} PLN`);

      // Oszczędności
      const savings = avgPrice - (cheapest.quote?.totalPrice || 0);
      const savingsPercent = (savings / avgPrice) * 100;
      console.log(`💵 Oszczędności: ${savings.toFixed(2)} PLN (${savingsPercent.toFixed(1)}%)`);
    }

    // Wyświetl błędy
    if (failed.length > 0) {
      console.log('\n❌ Nieudane kalkulacje:');
      failed.forEach(result => {
        console.log(`  - ${result.error}`);
      });
    }

    console.log('\n📊 Podsumowanie:');
    console.log(`  Razem: ${multiResults.length}`);
    console.log(`  Sukces: ${successful.length}`);
    console.log(`  Błędy: ${failed.length}`);

  } catch (error: any) {
    console.error('❌ Wyjątek:', error.message);
  }

  // 7. Zamknij przeglądarki
  console.log('\n🔒 Zamykam przeglądarki...');
  await closeAllBrowsers();
  
  console.log('\n✅ Test zakończony!');
}

// Uruchom test
main().catch(console.error);
