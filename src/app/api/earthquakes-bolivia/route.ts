import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&minlatitude=-22.9&maxlatitude=-9.7&minlongitude=-69.6&maxlongitude=-57.5&orderby=time&limit=100';
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return NextResponse.json({ earthquakes: [], error: 'USGS unavailable' });
    const data = await res.json();
    const earthquakes = (data.features || []).map((f: any) => {
      const coords = f.geometry?.coordinates || [0, 0, 0];
      const props = f.properties || {};
      return {
        id: f.id, lat: coords[1], lng: coords[0], depth: coords[2],
        magnitude: props.mag, place: props.place, time: props.time,
        url: props.url, tsunami: props.tsunami, type: props.type,
        felt: props.felt, alert: props.alert, region: 'bolivia',
      };
    });
    return NextResponse.json({ earthquakes, total: earthquakes.length, timestamp: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    return NextResponse.json({ earthquakes: [], error: 'Fetch failed' });
  }
}