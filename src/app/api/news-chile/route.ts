import { NextResponse } from 'next/server';

const FEEDS = [
  { name: 'BioBioChile', url: 'https://www.biobiochile.cl/feed' },
  { name: '24 Horas', url: 'https://www.24horas.cl/feed' },
  { name: 'La Tercera', url: 'https://www.latercera.com/feed' },
  { name: 'Emol', url: 'https://www.emol.com/rss/' },
  { name: 'El Mostrador', url: 'https://www.elmostrador.cl/feed' },
];

const CITIES: Record<string, [number, number]> = {
  'santiago': [-33.45, -70.67], 'valparaiso': [-33.04, -71.62],
  'concepcion': [-36.82, -73.05], 'antofagasta': [-23.65, -70.40],
  'iquique': [-20.21, -70.15], 'temuco': [-38.74, -72.59],
  'rancagua': [-34.17, -70.74], 'talca': [-35.43, -71.65],
  'arica': [-18.48, -70.32], 'puerto montt': [-41.47, -72.94],
  'chillan': [-36.61, -72.10], 'osorno': [-40.57, -73.13],
  'valdivia': [-39.81, -73.24], 'punta arenas': [-53.16, -70.91],
};

const RISK = ['incendio','sismo','terremoto','alerta','emergencia','accidente','crimen','robo','homicidio','explosion','evacuacion','tsunami','derrumbe','inundacion','protesta'];

function geolocate(text: string): [number, number] | null {
  const lower = text.toLowerCase();
  for (const [city, coords] of Object.entries(CITIES)) {
    if (lower.includes(city)) return coords;
  }
  return null;
}

function riskScore(text: string): number {
  const lower = text.toLowerCase();
  return RISK.filter(k => lower.includes(k)).length;
}

export async function GET() {
  const articles: any[] = [];
  await Promise.allSettled(FEEDS.map(async (feed) => {
    try {
      const res = await fetch(feed.url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Keltewe/1.0' } });
      if (!res.ok) return;
      const xml = await res.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
      for (const item of items.slice(0, 10)) {
        const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || '';
        const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
        const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || '';
        const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
        const combined = title + ' ' + desc;
        const coords = geolocate(combined);
        const score = riskScore(combined);
        articles.push({ title, link, description: desc.replace(/<[^>]+>/g, '').slice(0, 200), published: pubDate, source: feed.name, coords, risk_score: score });
      }
    } catch(e) {}
  }));
  const sorted = articles.sort((a, b) => b.risk_score - a.risk_score);
  return NextResponse.json({ news: sorted, total: sorted.length, timestamp: new Date().toISOString() }, {
    headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
  });
}
