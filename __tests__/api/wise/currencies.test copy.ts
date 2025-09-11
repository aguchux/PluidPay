import { GET } from '@api/wise/currencies/route';

describe('/api/wise/currencies GET', () => {
  it('returns a 200 response on request', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
