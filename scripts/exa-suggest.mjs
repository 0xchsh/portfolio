// Find new sites for each stack list using Exa search.
//
//   EXA_API_KEY=... node scripts/exa-suggest.mjs [--category "Fun Sites"] [--top 10]
//
// Each item in a list becomes a semantic Exa query built from its description
// ("Here is a great typography site, similar to Fontshare — Free quality fonts:").
// Results are pooled per list and ranked by how many items surfaced them, so sites
// that fit the list as a whole float up. Anything already in the stack is dropped.
// Output is written for review to .context/stack-suggestions.{json,md} — src/data
// is never modified.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STACK_PATH = join(ROOT, 'src/data/stack.json');
const OUT_DIR = join(ROOT, '.context');
const OUT_JSON = join(OUT_DIR, 'stack-suggestions.json');
const OUT_MD = join(OUT_DIR, 'stack-suggestions.md');

const API_KEY = process.env.EXA_API_KEY;
if (!API_KEY) {
  console.error('Missing EXA_API_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};
const ONLY_CATEGORY = argValue('--category');
const TOP_N = Number(argValue('--top') ?? 10);
const RESULTS_PER_QUERY = 15;
const CONCURRENCY = 6;

// Lists that aren't websites, or where "more like this" doesn't make sense.
const SKIP_CATEGORIES = new Set(['Read', 'On Repeat', 'Hardware']);
// Lists where a specific page is the thing (an article, an experiment), not a homepage.
const PAGE_CATEGORIES = new Set(['Articles', 'Fun Sites']);

// Socials, aggregators, editorial roundups and code hosts — they write *about* sites.
const BLOCKED_DOMAINS = [
  'linkedin.com', 'x.com', 'twitter.com', 'facebook.com', 'instagram.com', 'youtube.com',
  'reddit.com', 'medium.com', 'substack.com', 'producthunt.com', 'ycombinator.com',
  'crunchbase.com', 'exa.ai', 'sota2.com', 'wikipedia.org', 'github.com', 'gitlab.com',
  'githubusercontent.com', 'npmjs.com', 'apps.apple.com', 'play.google.com',
  'chromewebstore.google.com', 'tiktok.com', 'pinterest.com', 'dribbble.com', 'behance.net',
  'bsky.app', 'threads.net', 'tracxn.com', 'pitchbook.com', 'g2.com', 'capterra.com',
  'theresanaiforthat.com', 'futurepedia.io', 'saasworthy.com', 'alternativeto.net', 'f6s.com',
  'wellfound.com', 'microlaunch.net', 'dev.to', 'hashnode.dev', 'creativebloq.com',
  'commarts.com', 'csswinner.com', 'awwwards.com', 'cssdesignawards.com', 'smashingmagazine.com',
  'quora.com', 'stackoverflow.com', 'hackernoon.com', 'freecodecamp.org', '21st.dev',
];

const SUMMARY_PROMPT = 'In 6 words or fewer, what is this site or product? No trailing period.';

const hostOf = (url) => {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname
      .replace(/^www\./, '')
      .toLowerCase();
  } catch {
    return null;
  }
};
const normUrl = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();
// "neave.com" vs "neave.tv" → same brand label "neave".
const brandOf = (host) => {
  const parts = host.split('.');
  return (parts.length > 2 && parts.at(-2).length <= 3 ? parts.at(-3) : parts.at(-2)) ?? host;
};
const isBlocked = (host) => BLOCKED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
const isHomepage = (url) => {
  try {
    const u = new URL(url);
    return !u.search && /^\/?(index\.html?)?$/.test(u.pathname);
  } catch {
    return false;
  }
};
// Page titles are often taglines ("Find your perfect font."); fall back to the domain.
const cleanTitle = (title, host) => {
  const t = title?.split(/\s+[|\-–—·]\s+|:\s+/)[0].trim();
  return t && t.length <= 28 && !/[.!?]$/.test(t) ? t : host;
};

async function search(query) {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      query,
      type: 'auto',
      numResults: RESULTS_PER_QUERY,
      contents: { summary: { query: SUMMARY_PROMPT } },
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return (await res.json()).results ?? [];
}

const queryFor = (category, item) =>
  `Here is a great ${category.toLowerCase()} site, similar to ${item.name} — ${item.description}:`;

async function pool(items, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

const stack = JSON.parse(await readFile(STACK_PATH, 'utf-8'));

// Everything already in the stack, so we never suggest a duplicate or a sibling domain.
const existingUrls = new Set();
const existingHosts = new Set();
const existingNames = new Set();
for (const cat of stack.categories) {
  for (const item of cat.items) {
    const raw = item.href ?? item.url;
    const host = raw && hostOf(raw);
    if (!host) continue;
    existingUrls.add(normUrl(raw));
    // Shared hosts (github.com, etc.) hold many unrelated items — only dedupe those by URL.
    if (!isBlocked(host)) existingHosts.add(host);
    if (item.name) existingNames.add(item.name.toLowerCase());
  }
}
const existingBrands = new Set([...existingHosts].map(brandOf));

const categories = stack.categories.filter(
  (c) => !SKIP_CATEGORIES.has(c.name) && (!ONLY_CATEGORY || c.name === ONLY_CATEGORY),
);
if (ONLY_CATEGORY && categories.length === 0) {
  console.error(`No list named "${ONLY_CATEGORY}"`);
  process.exit(1);
}

// When refreshing a single list, keep the other lists' previous suggestions.
let report = {};
if (ONLY_CATEGORY) {
  try {
    report = JSON.parse(await readFile(OUT_JSON, 'utf-8'));
  } catch {}
}

for (const cat of categories) {
  const items = cat.items.filter((i) => i.url && i.description);
  process.stdout.write(`${cat.name} (${items.length} items)… `);

  const perItem = await pool(items, async (item) => {
    try {
      return { item, results: await search(queryFor(cat.name, item)) };
    } catch (err) {
      console.warn(`\n  ! ${item.name}: ${err.message}`);
      return { item, results: [] };
    }
  });

  const pageMode = PAGE_CATEGORIES.has(cat.name);
  const listNames = items.map((i) => i.name.toLowerCase()).filter((n) => n.length > 3);
  const candidates = new Map();

  for (const { item, results } of perItem) {
    for (const r of results) {
      const host = hostOf(r.url);
      if (!host || isBlocked(host)) continue;
      if (existingHosts.has(host) || existingBrands.has(brandOf(host))) continue;
      if (!pageMode && !isHomepage(r.url)) continue;
      const title = r.title?.trim();
      // Pages *about* something already in the list (mirrors, reviews) aren't new finds.
      if (!title || listNames.some((n) => title.toLowerCase().includes(n))) continue;

      const key = pageMode ? normUrl(r.url) : host;
      if (existingUrls.has(key)) continue;

      const c = candidates.get(key) ?? {
        host,
        url: r.url,
        title,
        summary: r.summary?.trim().replace(/\.$/, '') ?? '',
        surfacedBy: new Set(),
        scoreSum: 0,
      };
      c.surfacedBy.add(item.name);
      c.scoreSum += r.score ?? 0;
      candidates.set(key, c);
    }
  }

  // In page lists one site can contribute many pages — keep only its best one.
  const seenHosts = new Set();
  const ranked = [...candidates.values()]
    .filter((c) => !existingNames.has(cleanTitle(c.title, c.host).toLowerCase()))
    .sort((a, b) => b.surfacedBy.size - a.surfacedBy.size || b.scoreSum - a.scoreSum)
    .filter((c) => !seenHosts.has(c.host) && seenHosts.add(c.host))
    .slice(0, TOP_N)
    .map((c) => ({
      name: cleanTitle(c.title, c.host),
      url: pageMode ? normUrl(c.url) : c.host,
      href: c.url,
      description: c.summary,
      favicon: `https://www.google.com/s2/favicons?domain=${c.host}&sz=64`,
      surfacedBy: [...c.surfacedBy],
    }));

  report[cat.name] = ranked;
  console.log(`${ranked.length} suggestions`);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_JSON, JSON.stringify(report, null, 2) + '\n');

const md = Object.entries(report)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, items]) => {
    const lines = items.map((s) => {
      const via = s.surfacedBy.slice(0, 3).join(', ');
      const more = s.surfacedBy.length > 3 ? ` +${s.surfacedBy.length - 3}` : '';
      return `- **${s.name}** — [${s.url}](${s.href}) — ${s.description} _(via ${via}${more})_`;
    });
    return `## ${name}\n\n${lines.join('\n')}`;
  })
  .join('\n\n');
await writeFile(OUT_MD, `# Stack suggestions (via Exa)\n\n${md}\n`);

console.log(`\nWrote ${OUT_JSON.replace(ROOT + '/', '')} and ${OUT_MD.replace(ROOT + '/', '')}`);
