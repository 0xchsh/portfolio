import { NextRequest, NextResponse } from 'next/server';

// Cache successful OG lookups for 1 day, serve stale for up to 7 days while revalidating.
const SUCCESS_CACHE = 'public, s-maxage=86400, stale-while-revalidate=604800';
// Cache failures briefly so a flaky site doesn't get hammered, but recovers quickly.
const FAILURE_CACHE = 'public, s-maxage=300';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ image: null }, { status: 400 });

  try {
    const res = await fetch(`https://${url}`, {
      headers: { 'User-Agent': 'bot' },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    const html = await res.text();

    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    let image = match?.[1] ?? null;
    if (image && !image.startsWith('http')) {
      image = `https://${url}/${image.replace(/^\//, '')}`;
    }
    return NextResponse.json(
      { image },
      { headers: { 'Cache-Control': image ? SUCCESS_CACHE : FAILURE_CACHE } },
    );
  } catch {
    return NextResponse.json(
      { image: null },
      { headers: { 'Cache-Control': FAILURE_CACHE } },
    );
  }
}
