import { time, timeStamp } from 'console';

import { NextResponse } from 'next/server';

const apiRouteInfo = {
  name: 'Health Check',
  description: 'Returns the health status of the API.',
  method: 'GET',
  timeStamp: timeStamp(),
  time: time(),
};

export async function GET() {
  return NextResponse.json({ ...apiRouteInfo, status: 'ok' }, { status: 200 });
}
