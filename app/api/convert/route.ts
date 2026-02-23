import { NextResponse } from 'next/server';

interface ExchangeRateResponse {
  result: string;
  conversion_rates: {
    [key: string]: number;
  };
}



export async function GET() {
  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }


  const supported = ["EUR", "RSD", "USD", "CHF", "GBP", "AUD", "CAD", "BAM"];

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`;

  try {
    const response = await fetch(url);
    const data: ExchangeRateResponse = await response.json();

    if (data.result === "success") {

      const filteredRates: { [key: string]: number } = {};

      supported.forEach((code) => {
        if (data.conversion_rates[code]) {
          filteredRates[code] = data.conversion_rates[code];
        }
      });
      
      return NextResponse.json(filteredRates);
    } else {
      return NextResponse.json({ error: 'Greška pri preuzimanju kursa' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}