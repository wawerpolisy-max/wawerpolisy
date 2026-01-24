import { NextRequest, NextResponse } from 'next/server';
import { parseAPKEmail, parseAPKPlainText, apkToCalculationRequest } from '@/lib/apk-parser';
import { calculateInsurance } from '@/services/insurance-scrapers';

/**
 * APK Parser & Calculator API
 * 
 * Endpoint do parsowania emaili APK i automatycznego generowania kalkulacji
 * 
 * POST /api/apk/parse-and-calculate
 * Body: { emailBody: string, companies?: string[] }
 * 
 * Returns: { success: true, apkData: {...}, quotes: [...] }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailBody, emailSubject, companies } = body;
    
    if (!emailBody) {
      return NextResponse.json(
        { success: false, error: 'Missing emailBody' },
        { status: 400 }
      );
    }
    
    // 1. Parse APK email
    console.log('📧 Parsing APK email...');
    const isHTML = emailBody.includes('<html') || emailBody.includes('<table');
    const apkData = isHTML 
      ? parseAPKEmail(emailBody)
      : parseAPKPlainText(emailBody);
    
    console.log('✅ APK parsed:', {
      customer: apkData.name,
      vehicle: `${apkData.brand} ${apkData.model} ${apkData.year}`,
      insuranceType: apkData.insuranceType,
    });
    
    // 2. Convert to calculation request
    const calculationRequest = apkToCalculationRequest(apkData);
    
    // 3. Get quotes from insurance companies
    console.log('🚗 Calculating insurance quotes...');
    const targetCompanies = companies || ['pzu', 'generali', 'uniqa'];
    
    const quotes = await Promise.all(
      targetCompanies.map((company: string) => 
        calculateInsurance({ ...calculationRequest, insuranceCompany: company })
      )
    );
    
    // 4. Sort by price (cheapest first)
    const sortedQuotes = quotes
      .filter(q => q.success)
      .map(q => q.data!)
      .sort((a, b) => a.quote.totalPrice - b.quote.totalPrice);
    
    // 5. Calculate savings
    const cheapest = sortedQuotes[0];
    const mostExpensive = sortedQuotes[sortedQuotes.length - 1];
    const savings = mostExpensive 
      ? mostExpensive.quote.totalPrice - cheapest.quote.totalPrice 
      : 0;
    
    console.log('✅ Quotes calculated:', {
      count: sortedQuotes.length,
      cheapest: `${cheapest.company} - ${cheapest.quote.totalPrice} PLN`,
      savings: `${savings} PLN`,
    });
    
    // 6. Return response
    return NextResponse.json({
      success: true,
      data: {
        apkData,
        calculationRequest,
        quotes: sortedQuotes,
        summary: {
          total: sortedQuotes.length,
          cheapest: {
            company: cheapest.company,
            price: cheapest.quote.totalPrice,
          },
          mostExpensive: mostExpensive ? {
            company: mostExpensive.company,
            price: mostExpensive.quote.totalPrice,
          } : null,
          savings,
        },
      },
    });
    
  } catch (error: any) {
    console.error('❌ APK parsing/calculation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * Test endpoint
 * GET /api/apk/parse-and-calculate?test=true
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get('test');
  
  if (test !== 'true') {
    return NextResponse.json({
      success: false,
      error: 'Use POST method to parse APK emails',
      usage: {
        endpoint: 'POST /api/apk/parse-and-calculate',
        body: {
          emailBody: 'HTML or plain text email body',
          emailSubject: 'Email subject (optional)',
          companies: ['pzu', 'generali', 'uniqa'], // optional
        },
      },
    });
  }
  
  // Test data based on your example
  const testEmailBody = `
🎯 Nowy formularz APK
Analiza Potrzeb Klienta - wawerpolisy.pl

Rodzaj ubezpieczenia
🚗 Ubezpieczenie komunikacyjne

👤 Dane kontaktowe
Imię i nazwisko:	Mateusz Pawelec
Telefon:	+48501221133
E-mail:	mateuszppawelec@gmail.com
Preferowana forma kontaktu:	📞 telefon

🚗 Szczegóły pojazdu
Zakres ochrony:	OC
Marka:	Toyota
Model:	Corolla
Rok produkcji:	2019
Data pierwszej rejestracji:	03.09.2019
Data uzyskania prawa jazdy:	09.10.2006
Pojemność silnika:	1598 cm³
Moc silnika:	120 KM
Sposób użytkowania:	Prywatnie
Szkody w ostatnich latach:	Nie

🎯 Priorytety klienta
Najlepsza cena
  `;
  
  console.log('🧪 Running test with sample APK email...');
  
  // Parse test data
  const apkData = parseAPKPlainText(testEmailBody);
  const calculationRequest = apkToCalculationRequest(apkData);
  
  return NextResponse.json({
    success: true,
    test: true,
    message: 'Test parsing successful (no actual calculation performed)',
    data: {
      apkData,
      calculationRequest,
      note: 'To run actual calculations, use POST method with emailBody',
    },
  });
}
