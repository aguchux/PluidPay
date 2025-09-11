import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sourceCurrency = searchParams.get('sourceCurrency');
  const targetCurrency = searchParams.get('targetCurrency');
  const res = await fetch(
    `https://api.sandbox.transferwise.tech/v1/rates?source=${sourceCurrency}&target=${targetCurrency}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.WISE_SANDBOX_TOKEN}`,
        Accept: 'application/json',
      },
      // avoid static caching
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data[0], { status: 200 });
}
