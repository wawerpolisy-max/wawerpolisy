import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  calculateInsurance, 
  calculateInMultipleCompanies,
  getAvailableCompanies,
  getCacheStats,
  clearCache,
  type InsuranceCompany 
} from '@/services/insurance-scrapers';

/**
 * API Route dla kalkulacji ubezpieczeń
 * 
 * Endpoints:
 * - POST /api/insurance/calculate - Kalkulacja dla jednego towarzystwa
 * - POST /api/insurance/calculate?multi=true - Kalkulacja dla wielu towarzystw
 * - GET /api/insurance/calculate?action=companies - Lista dostępnych towarzystw
 * - GET /api/insurance/calculate?action=stats - Statystyki cache
 * - POST /api/insurance/calculate?action=clearCache - Wyczyść cache
 */

// Zod schemas dla walidacji
const VehicleSchema = z.object({
  registrationNumber: z.string().optional(),
  brand: z.string(),
  model: z.string(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  engineCapacity: z.number().optional(),
  fuelType: z.enum(['benzyna', 'diesel', 'lpg', 'elektryczny', 'hybryda']).optional(),
  firstRegistrationDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

const DriverSchema = z.object({
  age: z.number().min(18).max(100),
  drivingLicenseDate: z.string().transform(val => new Date(val)),
  pesel: z.string().optional(),
  previousInsuranceCompany: z.string().optional(),
  accidentHistory: z.number().min(0).default(0),
});

const InsuranceOptionsSchema = z.object({
  ocOnly: z.boolean().optional().default(false),
  acIncluded: z.boolean().optional().default(false),
  assistance: z.boolean().optional().default(false),
  nnw: z.boolean().optional().default(false),
  acValue: z.number().optional(),
});

const CalculationRequestSchema = z.object({
  vehicle: VehicleSchema,
  driver: DriverSchema,
  options: InsuranceOptionsSchema,
  insuranceCompany: z.string().optional(), // Opcjonalne dla multi-company
  companies: z.array(z.string()).optional(), // Dla multi-company
});

/**
 * GET - Akcje pomocnicze
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'companies':
        // Lista dostępnych towarzystw
        const companies = getAvailableCompanies();
        return NextResponse.json({
          success: true,
          data: {
            companies,
            count: companies.length,
          },
        });

      case 'stats':
        // Statystyki cache
        const stats = getCacheStats();
        return NextResponse.json({
          success: true,
          data: stats,
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action. Available actions: companies, stats',
        }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST - Kalkulacja ubezpieczenia
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const multi = searchParams.get('multi') === 'true';

  try {
    // Akcja czyszczenia cache
    if (action === 'clearCache') {
      clearCache();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully',
      });
    }

    // Parse i walidacja body
    const body = await request.json();
    const validatedData = CalculationRequestSchema.parse(body);

    // Kalkulacja w wielu towarzystwach
    if (multi) {
      const companies = validatedData.companies as InsuranceCompany[] | undefined;
      
      const results = await calculateInMultipleCompanies({
        vehicle: validatedData.vehicle,
        driver: validatedData.driver,
        options: validatedData.options,
      }, companies);

      // Filtruj wyniki - zwróć sukces i błędy osobno
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return NextResponse.json({
        success: true,
        data: {
          results: successful,
          errors: failed,
          summary: {
            total: results.length,
            successful: successful.length,
            failed: failed.length,
          },
        },
      });
    }

    // Kalkulacja dla pojedynczego towarzystwa
    if (!validatedData.insuranceCompany) {
      return NextResponse.json({
        success: false,
        error: 'insuranceCompany is required for single calculation',
      }, { status: 400 });
    }

    const result = await calculateInsurance({
      vehicle: validatedData.vehicle,
      driver: validatedData.driver,
      options: validatedData.options,
      insuranceCompany: validatedData.insuranceCompany,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('[API] Error:', error);

    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * OPTIONS - CORS handling
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
