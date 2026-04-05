import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    const data = await redis.get('tontine') || {};
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { pwd, data } = req.body;
    if (pwd !== 'tontine2025') return res.status(401).json({ error: 'Non autorisé' });
    await redis.set('tontine', data);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
