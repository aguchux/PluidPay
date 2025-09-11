import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: number }> }) {
  const { code } = await params;

  console.log('Fetching currency for code:', code);
  const res = await fetch('https://api.sandbox.transferwise.tech/v1/currencies', {
    headers: {
      Authorization: `Bearer ${process.env.WISE_SANDBOX_TOKEN}`,
      Accept: 'application/json',
    },
    // avoid static caching
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  const currency = data.find((c: { code: string }) => c.code === String(code));
  if (!currency) {
    return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
  }
  console.log('Fetched currency:', currency);
  return NextResponse.json(currency, { status: 200 });
}
