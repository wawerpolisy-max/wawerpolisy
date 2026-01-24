import { NextRequest, NextResponse } from 'next/server';

/**
 * TEST endpoint - zwraca mock data bez scrapowania
 */
export async function GET(request: NextRequest) {
  const mockQuotes = [
    {
      company: 'pzu',
      quote: {
        ocPrice: 850,
        acPrice: 1200,
        totalPrice: 2050,
        coverage: 'OC+AC'
      },
      success: true
    },
    {
      company: 'generali',
      quote: {
        ocPrice: 920,
        acPrice: 1350,
        totalPrice: 2270,
        coverage: 'OC+AC'
      },
      success: true
    },
    {
      company: 'uniqa',
      quote: {
        ocPrice: 780,
        acPrice: 1100,
        totalPrice: 1880,
        coverage: 'OC+AC'
      },
      success: true
    }
  ];

  const sortedQuotes = mockQuotes.sort((a, b) => 
    a.quote.totalPrice - b.quote.totalPrice
  );

  const cheapest = sortedQuotes[0];
  const mostExpensive = sortedQuotes[sortedQuotes.length - 1];

  return NextResponse.json({
    success: true,
    test: true,
    data: {
      apkData: {
        name: 'Mateusz Pawelec',
        email: 'mateuszppawelec@gmail.com',
        phone: '+48501221133',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2019,
        insuranceType: 'OC+AC'
      },
      quotes: sortedQuotes,
      summary: {
        total: sortedQuotes.length,
        cheapest: {
          company: cheapest.company,
          price: cheapest.quote.totalPrice
        },
        mostExpensive: {
          company: mostExpensive.company,
          price: mostExpensive.quote.totalPrice
        },
        savings: mostExpensive.quote.totalPrice - cheapest.quote.totalPrice
      }
    }
  });
}
