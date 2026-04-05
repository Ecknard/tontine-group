import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const raw = await kv.get('tontine');
  res.json({ data: raw || {} });
}
