import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STACK_PATH = join(ROOT, 'src/data/stack.json');
const OUT_PATH = join(ROOT, 'src/data/og-cache.json');

const CONCURRENCY = 8;
const TIMEOUT_MS = 5000;

async function fetchOg(url) {
  try {
    const res = await fetch(`https://${url}`, {
      headers: { 'User-Agent': 'bot' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    let image = match?.[1] ?? null;
    if (image && !image.startsWith('http')) {
      image = `https://${url}/${image.replace(/^\//, '')}`;
    }
    return image;
  } catch {
    return null;
  }
}

const stack = JSON.parse(await readFile(STACK_PATH, 'utf-8'));

let existing = {};
try {
  existing = JSON.parse(await readFile(OUT_PATH, 'utf-8'));
} catch {}

const targets = [];
for (const cat of stack.categories) {
  if (cat.name === 'Read') continue;
  for (const item of cat.items) {
    const key = item.href || item.url;
    if (!key) continue;
    if (key.includes('youtube.com')) continue;
    targets.push(key);
  }
}

const unique = Array.from(new Set(targets));
const result = { ...existing };

let cursor = 0;
let done = 0;
async function worker() {
  while (cursor < unique.length) {
    const key = unique[cursor++];
    const image = await fetchOg(key);
    result[key] = image;
    done++;
    process.stdout.write(`\rResolved ${done}/${unique.length}`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

await writeFile(OUT_PATH, JSON.stringify(result, null, 2) + '\n');
console.log(`\nWrote ${Object.keys(result).length} entries to og-cache.json`);
