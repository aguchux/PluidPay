import { GET } from '@api/info/route';

describe('/api/info GET', () => {
  it('returns a 200 response on info request', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});
