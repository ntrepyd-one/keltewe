import { NextResponse } from 'next/server';

const CITIES: Record<string, [number, number]> = {
  'buenos aires': [-34.61, -58.38],
  'cordoba': [-31.42, -64.18],
  'rosario': [-32.94, -60.65],
  'mendoza': [-32.89, -68.85],
  'tucuman': [-26.82, -65.22],
  'la plata': [-34.92, -57.95],
  'mar del plata': [-38.00, -57.56],
  'salta': [-24.78, -65.41],
  'santa fe': [-31.63, -60.70],
  'san juan': [-31.54, -68.54],
  'neuquen': [-38.95, -68.06],
  'formosa': [-26.18, -58.18],
  'gba': [-34.61, -58.50],
  'gran buenos aires': [-34.61, -58.50],
  'patagonia': [-45.00, -70.00],
};

const RISK = [
  'protesta','piquete','corte','bloqueo','huelga','paro','conflicto',
  'emergencia','accidente','incendio','inundacion','alerta','tormenta',
  'edenor','edemsa','electricidad','luz','corte de luz','apagon',
  'raizen','shell','combustible','nafta','gasoil','estacion de servicio',
  'enre','regulacion','tarifa','inflacion','devaluacion','dolar',
  'sindicato','gremio','enfrentamiento'
];

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
    const url = `https://newsapi.org/v2/everything?q=Argentina+Edenor+OR+Argentina+Raizen+OR+Argentina+electricidad+OR+Argentina+conflicto&language=es&sortBy=publishedAt&pageSize=50&apiKey=${key}`;
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
        region: 'argentina',
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
