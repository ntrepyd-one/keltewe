import { NextResponse } from 'next/server';

const CITIES: Record<string, [number, number]> = {
  'lima': [-12.04, -77.03],
  'arequipa': [-16.41, -71.54],
  'trujillo': [-8.11, -79.03],
  'cusco': [-13.53, -71.97],
  'piura': [-5.19, -80.63],
  'chiclayo': [-6.77, -79.84],
  'iquitos': [-3.74, -73.25],
  'huancayo': [-12.07, -75.21],
  'puno': [-15.84, -70.02],
  'tacna': [-18.01, -70.25],
  'moquegua': [-17.19, -70.93],
  'cajamarca': [-7.16, -78.51],
  'chancay': [-11.57, -77.27],
  'las bambas': [-14.20, -72.44],
  'cerro verde': [-16.52, -71.48],
  'antamina': [-9.53, -77.05],
  'toquepala': [-17.36, -70.60],
};

const RISK = [
  'protesta','bloqueo','conflicto','huelga','paro','emergencia','accidente',
  'incendio','inundacion','alerta','sismo','terremoto','explosion','corte',
  'telefonica','osiptel','mtc','entel','bitel','claro',
  'mineria','cobre','zinc','oro','las bambas','antamina','cerro verde',
  'chancay','puerto','logistica','comunidad','reclamo','enfrentamiento'
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
    const url = `https://newsapi.org/v2/everything?q=Peru+mineria+OR+Peru+telefonica+OR+Peru+conflicto+OR+Peru+protesta&language=es&sortBy=publishedAt&pageSize=50&apiKey=${key}`;
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
        region: 'peru',
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
