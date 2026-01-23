/**
 * Typy danych dla systemu kalkulacji ubezpieczeń
 */

export interface VehicleData {
  registrationNumber?: string;
  brand: string;
  model: string;
  year: number;
  engineCapacity?: number;
  fuelType?: 'benzyna' | 'diesel' | 'lpg' | 'elektryczny' | 'hybryda';
  firstRegistrationDate?: Date;
}

export interface DriverData {
  age: number;
  drivingLicenseDate: Date;
  pesel?: string;
  previousInsuranceCompany?: string;
  accidentHistory?: number; // liczba szkód w ostatnich latach
}

export interface InsuranceOptions {
  ocOnly?: boolean; // tylko OC
  acIncluded?: boolean; // z AC
  assistance?: boolean;
  nnw?: boolean; // następstwa nieszczęśliwych wypadków
  acValue?: number; // wartość pojazdu dla AC
}

export interface CalculationRequest {
  vehicle: VehicleData;
  driver: DriverData;
  options: InsuranceOptions;
  insuranceCompany: string;
}

export interface InsuranceQuote {
  company: string;
  ocPrice?: number;
  acPrice?: number;
  totalPrice: number;
  currency: string;
  paymentOptions?: {
    annual?: number;
    quarterly?: number;
    monthly?: number;
  };
  calculatedAt: Date;
  validUntil?: Date;
  additionalInfo?: Record<string, any>;
}

export interface ScraperResult {
  success: boolean;
  quote?: InsuranceQuote;
  error?: string;
  executionTime?: number; // w milisekundach
  cached?: boolean;
}

export type InsuranceCompany = 
  | 'pzu'
  | 'warta'
  | 'link4'
  | 'generali'
  | 'compensa'
  | 'wiener'
  | 'trasti'
  | 'uniqa'
  | 'proama'
  | 'tuz'
  | 'allianz'
  | 'tuw';
