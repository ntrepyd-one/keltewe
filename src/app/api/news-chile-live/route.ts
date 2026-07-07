import { NextResponse } from 'next/server';

const CITIES: Record<string, [number, number]> = {
  'santiago': [-33.45, -70.67], 'valparaiso': [-33.04, -71.62],
  'concepcion': [-36.82, -73.05], 'antofagasta': [-23.65, -70.40],
  'iquique': [-20.21, -70.15], 'temuco': [-38.74, -72.59],
  'rancagua': [-34.17, -70.74], 'arica': [-18.48, -70.32],
  'puerto montt': [-41.47, -72.94], 'chillan': [-36.61, -72.10],
  'valdivia': [-39.81, -73.24], 'punta arenas': [-53.16, -70.91],
  'calama': [-22.45, -68.93], 'copiapo': [-27.37, -70.33],
  'osorno': [-40.57, -73.13], 'talca': [-35.43, -71.65],
};

const RISK = ['incendio','sismo','terremoto','alerta','emergencia','accidente','crimen','robo','homicidio','explosion','evacuacion','tsunami','derrumbe','inundacion','protesta','ataque','policia','carabineros'];

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
  try {
    const key = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/everything?q=Chile&language=es&sortBy=publishedAt&pageSize=50&apiKey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return NextResponse.json({ news: [], error: 'NewsAPI unavailable' });
    const data = await res.json();
    const articles = (data.articles || []).map((a: any) => {
      const combined = (a.title || '') + ' ' + (a.description || '');
      return {
        id: a.url,
        title: a.title || '',
        description: (a.description || '').slice(0, 200),
        link: a.url || '',
        published: a.publishedAt || '',
        source: a.source?.name || 'NewsAPI',
        coords: geolocate(combined),
        risk_score: riskScore(combined),
        region: 'chile',
      };
    });
    const sorted = articles.sort((a: any, b: any) => b.risk_score - a.risk_score);
    return NextResponse.json({ news: sorted, total: sorted.length, timestamp: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
    });
  } catch (error) {
    return NextResponse.json({ news: [], error: 'Fetch failed' });
  }
}
