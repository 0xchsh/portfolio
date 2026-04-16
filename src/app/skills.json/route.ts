import { NextResponse } from 'next/server';
import skills from '@/data/skills.json';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(skills, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
