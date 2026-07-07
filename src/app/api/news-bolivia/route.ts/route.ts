import { NextResponse } from 'next/server';

const CITIES: Record<string, [number, number]> = {
  'la paz': [-16.50, -68.15],
  'santa cruz': [-17.78, -63.18],
  'cochabamba': [-17.39, -66.16],
  'oruro': [-17.97, -67.11],
  'potosi': [-19.58, -65.75],
  'sucre': [-19.03, -65.26],
  'tarija': [-21.53, -64.73],
  'trinidad': [-14.83, -64.90],
  'cobija': [-11.03, -68.77],
  'el alto': [-16.50, -68.19],
  'beni': [-14.83, -64.90],
  'chapare': [-16.90, -65.50],
  'yungas': [-16.50, -67.50],
};

const RISK = ['bloqueo','protesta','huelga','conflicto','enfrentamiento','incendio','inundacion','alerta','emergencia','accidente','explosion','corte','paro','marcha','disturbio','vandalismo','mineria','telecom','entel','tigo','viva'];

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
    const url = `https://newsapi.org/v2/everything?q=Bolivia&language=es&sortBy=publishedAt&pageSize=50&apiKey=${key}`;
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
        region: 'bolivia',
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
