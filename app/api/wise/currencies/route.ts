import { NextResponse } from 'next/server';

export async function GET() {
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
  return NextResponse.json(data, { status: 200 });
}
