/**
 * APK Email Parser
 * 
 * Parsuje email z formularza "Analiza Potrzeb Klienta" (APK) 
 * ze strony wawerpolisy.pl
 * 
 * Format emaila:
 * Subject: 🎯 Nowy formularz APK
 * Body: HTML z danymi klienta
 */

export interface APKEmailData {
  // Dane kontaktowe
  name: string;
  phone: string;
  email: string;
  preferredContact: 'telefon' | 'email' | 'inne';
  
  // Szczegóły pojazdu
  insuranceType: 'OC' | 'OC+AC' | 'AC';
  brand: string;
  model: string;
  year: number;
  firstRegistrationDate: string; // DD.MM.YYYY
  licenseDate: string; // DD.MM.YYYY
  engineCapacity: number; // cm³
  enginePower: number; // KM
  usage: 'Prywatnie' | 'Służbowo' | 'Działalność gospodarcza';
  hasAccidents: boolean;
  
  // Priorytety
  priorities: string[];
}

export interface CalculationRequest {
  vehicle: {
    brand: string;
    model: string;
    year: number;
    registrationNumber?: string;
    firstRegistrationDate: string;
    engineCapacity: number;
    enginePower: number;
    usage: string;
  };
  driver: {
    age: number;
    drivingLicenseDate: string;
    accidentHistory: number;
  };
  options: {
    acIncluded: boolean;
    acValue?: number;
    assistanceIncluded: boolean;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
  };
}

/**
 * Parsuje HTML email z APK
 */
export function parseAPKEmail(htmlBody: string): APKEmailData {
  // Pomocnicze funkcje do ekstrakcji danych z HTML
  const extractText = (pattern: RegExp): string => {
    const match = htmlBody.match(pattern);
    return match ? match[1].trim() : '';
  };
  
  const extractNumber = (pattern: RegExp): number => {
    const text = extractText(pattern);
    const num = parseInt(text.replace(/\D/g, ''));
    return isNaN(num) ? 0 : num;
  };
  
  // Parsowanie danych
  return {
    // Dane kontaktowe
    name: extractText(/Imię i nazwisko:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
          extractText(/Imię i nazwisko:\s*(.+?)(?:\n|<)/i),
    
    phone: extractText(/Telefon:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
           extractText(/Telefon:\s*(.+?)(?:\n|<)/i),
    
    email: extractText(/E-mail:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
           extractText(/E-mail:\s*(.+?)(?:\n|<)/i),
    
    preferredContact: extractText(/Preferowana forma kontaktu:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i).includes('telefon') 
      ? 'telefon' 
      : 'email',
    
    // Szczegóły pojazdu
    insuranceType: extractText(/Zakres ochrony:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i).includes('AC') 
      ? (extractText(/Zakres ochrony:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) === 'OC+AC' ? 'OC+AC' : 'AC')
      : 'OC',
    
    brand: extractText(/Marka:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
           extractText(/Marka:\s*(.+?)(?:\n|<)/i),
    
    model: extractText(/Model:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
           extractText(/Model:\s*(.+?)(?:\n|<)/i),
    
    year: extractNumber(/Rok produkcji:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
          extractNumber(/Rok produkcji:\s*(\d{4})/i),
    
    firstRegistrationDate: extractText(/Data pierwszej rejestracji:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
                          extractText(/Data pierwszej rejestracji:\s*([\d\.]+)/i),
    
    licenseDate: extractText(/Data uzyskania prawa jazdy:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
                extractText(/Data uzyskania prawa jazdy:\s*([\d\.]+)/i),
    
    engineCapacity: extractNumber(/Pojemność silnika:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
                   extractNumber(/Pojemność silnika:\s*(\d+)/i),
    
    enginePower: extractNumber(/Moc silnika:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
                extractNumber(/Moc silnika:\s*(\d+)/i),
    
    usage: extractText(/Sposób użytkowania:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
           extractText(/Sposób użytkowania:\s*(.+?)(?:\n|<)/i) as any || 'Prywatnie',
    
    hasAccidents: extractText(/Szkody w ostatnich latach:[\s\S]*?<td[^>]*>([^<]+)<\/td>/i)
      .toLowerCase()
      .includes('tak'),
    
    // Priorytety
    priorities: [
      extractText(/Priorytety klienta[\s\S]*?<td[^>]*>([^<]+)<\/td>/i) || 
      extractText(/🎯 Priorytety klienta\s*(.+?)(?:\n|<)/i) || 
      'Najlepsza cena'
    ],
  };
}

/**
 * Konwertuje dane APK na format API request
 */
export function apkToCalculationRequest(apk: APKEmailData): CalculationRequest {
  return {
    vehicle: {
      brand: apk.brand,
      model: apk.model,
      year: apk.year,
      firstRegistrationDate: convertDateToDMY(apk.firstRegistrationDate),
      engineCapacity: apk.engineCapacity,
      enginePower: apk.enginePower,
      usage: apk.usage,
    },
    driver: {
      age: calculateAgeFromLicenseDate(apk.licenseDate),
      drivingLicenseDate: convertDateToISO(apk.licenseDate),
      accidentHistory: apk.hasAccidents ? 1 : 0,
    },
    options: {
      acIncluded: apk.insuranceType.includes('AC'),
      acValue: apk.insuranceType.includes('AC') 
        ? estimateVehicleValue(apk.brand, apk.model, apk.year) 
        : undefined,
      assistanceIncluded: true,
    },
    customer: {
      name: apk.name,
      email: apk.email,
      phone: apk.phone,
      preferredContact: apk.preferredContact,
    },
  };
}

/**
 * Helper: Konwertuje datę DD.MM.YYYY → YYYY-MM-DD
 */
function convertDateToISO(dateStr: string): string {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Helper: Zachowuje format DD.MM.YYYY
 */
function convertDateToDMY(dateStr: string): string {
  return dateStr; // już jest w formacie DD.MM.YYYY
}

/**
 * Helper: Oblicza wiek na podstawie daty prawa jazdy
 * Zakładamy, że prawo jazdy zdobywa się w wieku 18 lat
 */
function calculateAgeFromLicenseDate(licenseDate: string): number {
  const parts = licenseDate.split('.');
  if (parts.length !== 3) return 35; // domyślnie
  
  const [day, month, year] = parts;
  const licenseYear = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  // Wiek = (obecny rok - rok prawa jazdy) + 18
  const yearsWithLicense = currentYear - licenseYear;
  return 18 + yearsWithLicense;
}

/**
 * Helper: Szacuje wartość pojazdu na podstawie marki, modelu i roku
 */
function estimateVehicleValue(brand: string, model: string, year: number): number {
  // Prosta heurystyka - w prawdziwej aplikacji użyj API (np. OtoMoto, AutoCentrum)
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Bazowa wartość w zależności od marki
  const baseValues: Record<string, number> = {
    'Toyota': 80000,
    'Volkswagen': 85000,
    'BMW': 120000,
    'Mercedes': 130000,
    'Audi': 110000,
    'Skoda': 70000,
    'Ford': 65000,
    'Opel': 60000,
    'Renault': 65000,
    'Peugeot': 65000,
  };
  
  const baseValue = baseValues[brand] || 70000;
  
  // Deprecjacja: 15% rocznie przez pierwsze 3 lata, potem 10%
  let value = baseValue;
  for (let i = 0; i < age; i++) {
    const depreciationRate = i < 3 ? 0.15 : 0.10;
    value *= (1 - depreciationRate);
  }
  
  // Zaokrąglij do 1000 PLN
  return Math.round(value / 1000) * 1000;
}

/**
 * Parsuje plain text email (fallback jeśli nie ma HTML)
 */
export function parseAPKPlainText(text: string): APKEmailData {
  const extractText = (pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };
  
  const extractNumber = (pattern: RegExp): number => {
    const text = extractText(pattern);
    const num = parseInt(text.replace(/\D/g, ''));
    return isNaN(num) ? 0 : num;
  };
  
  return {
    name: extractText(/Imię i nazwisko:\s*(.+?)(?:\n|$)/i),
    phone: extractText(/Telefon:\s*(.+?)(?:\n|$)/i),
    email: extractText(/E-mail:\s*(.+?)(?:\n|$)/i),
    preferredContact: extractText(/Preferowana forma kontaktu:\s*(.+?)(?:\n|$)/i).includes('telefon') 
      ? 'telefon' 
      : 'email',
    
    insuranceType: extractText(/Zakres ochrony:\s*(.+?)(?:\n|$)/i).includes('AC') 
      ? 'OC+AC' 
      : 'OC',
    
    brand: extractText(/Marka:\s*(.+?)(?:\n|$)/i),
    model: extractText(/Model:\s*(.+?)(?:\n|$)/i),
    year: extractNumber(/Rok produkcji:\s*(\d{4})/i),
    firstRegistrationDate: extractText(/Data pierwszej rejestracji:\s*([\d\.]+)/i),
    licenseDate: extractText(/Data uzyskania prawa jazdy:\s*([\d\.]+)/i),
    engineCapacity: extractNumber(/Pojemność silnika:\s*(\d+)/i),
    enginePower: extractNumber(/Moc silnika:\s*(\d+)/i),
    usage: extractText(/Sposób użytkowania:\s*(.+?)(?:\n|$)/i) as any || 'Prywatnie',
    hasAccidents: extractText(/Szkody w ostatnich latach:\s*(.+?)(?:\n|$)/i)
      .toLowerCase()
      .includes('tak'),
    
    priorities: [extractText(/Priorytety klienta\s*(.+?)(?:\n|$)/i) || 'Najlepsza cena'],
  };
}
