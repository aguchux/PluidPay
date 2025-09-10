import { GET } from '@api/health/route';

describe('/api/health GET', () => {
  it('returns a 200 response on health status', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});
