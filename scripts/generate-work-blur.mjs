import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlaiceholder } from 'plaiceholder';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JSON_PATH = join(ROOT, 'src/data/work.json');

const data = JSON.parse(await readFile(JSON_PATH, 'utf-8'));

for (const item of data) {
  const blurDataURLs = [];

  for (const src of item.src) {
    if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.webp')) {
      const filePath = join(ROOT, 'public', src);
      const buffer = await readFile(filePath);
      const { base64 } = await getPlaiceholder(buffer, { size: 16 });
      blurDataURLs.push(base64);
      console.log(`✓ ${src}`);
    } else {
      // Videos — no blur placeholder
      blurDataURLs.push(null);
      console.log(`⏭ ${src} (video)`);
    }
  }

  item.blurDataURLs = blurDataURLs;
}

await writeFile(JSON_PATH, JSON.stringify(data, null, 2) + '\n');
console.log('\nDone — blurDataURLs fields written to work.json');
