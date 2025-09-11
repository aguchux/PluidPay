import { NextRequest, NextResponse } from 'next/server';

//curl -X GET https://api.wise.com/v4/comparisons/?sourceCurrency=GBP&targetCurrency=EUR&sendAmount=10000

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sourceCurrency = searchParams.get('sourceCurrency');
  const targetCurrency = searchParams.get('targetCurrency');
  const sendAmount = searchParams.get('sendAmount');

  console.log('sourceCurrency', sourceCurrency);
  console.log('targetCurrency', targetCurrency);
  console.log('sendAmount', sendAmount);

  const response = await fetch(
    `https://api.wise.com/v4/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${sendAmount}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.WISE_SANDBOX_TOKEN}`,
        Accept: 'application/json',
      },
      // avoid static caching
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: response.status });
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 200 });
}
