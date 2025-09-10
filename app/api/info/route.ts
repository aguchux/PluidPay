import { NextResponse } from 'next/server';

const apiRouteInfo = {
  name: 'All Api Info',
  description: 'Returns information about all API routes.',
  routes: [
    { name: 'Health Check', method: 'GET', path: '/api/health' },
    { name: 'Info', method: 'GET', path: '/api/info' },
  ],
  timeStamp: new Date().toISOString(),
  time: Date.now(),
};

export async function GET() {
  return NextResponse.json({ ...apiRouteInfo, status: 'ok' }, { status: 200 });
}
