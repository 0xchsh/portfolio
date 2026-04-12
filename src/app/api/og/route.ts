import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ image: null }, { status: 400 });

  try {
    const res = await fetch(`https://${url}`, {
      headers: { 'User-Agent': 'bot' },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    let image = match?.[1] ?? null;
    if (image && !image.startsWith('http')) {
      image = `https://${url}/${image.replace(/^\//, '')}`;
    }
    return NextResponse.json({ image });
  } catch {
    return NextResponse.json({ image: null });
  }
}
