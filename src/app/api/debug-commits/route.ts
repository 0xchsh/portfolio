import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return NextResponse.json({ error: 'No token', envKeys: Object.keys(process.env).filter(k => k.includes('GIT')) });

  const now = new Date();
  const from = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const to = now.toISOString();

  const query = `
    query($from: DateTime!, $to: DateTime!) {
      user(login: "0xchsh") {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository(maxRepositories: 100) {
            repository { name }
            contributions(first: 100) {
              nodes { occurredAt commitCount }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { from, to } }),
      cache: 'no-store',
    });

    const status = res.status;
    const body = await res.json();
    const repos = body?.data?.user?.contributionsCollection?.commitContributionsByRepository ?? [];

    let totalCommits = 0;
    for (const r of repos) {
      for (const n of r.contributions.nodes) {
        totalCommits += n.commitCount;
      }
    }

    return NextResponse.json({
      tokenLength: token.length,
      tokenPrefix: token.slice(0, 4),
      apiStatus: status,
      repoCount: repos.length,
      totalCommits,
      errors: body.errors ?? null,
      from,
      to,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
