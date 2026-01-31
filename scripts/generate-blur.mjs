import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlaiceholder } from 'plaiceholder';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JSON_PATH = join(ROOT, 'src/data/presentation.json');

const data = JSON.parse(await readFile(JSON_PATH, 'utf-8'));

for (const project of data.projects) {
  for (const section of project.sections) {
    for (const mockup of section.mockups) {
      if (!mockup.src.endsWith('.png')) continue;

      const filePath = join(ROOT, 'public', mockup.src);
      const buffer = await readFile(filePath);
      const { base64 } = await getPlaiceholder(buffer, { size: 16 });

      mockup.blurDataURL = base64;
      console.log(`✓ ${mockup.id}`);
    }
  }
}

await writeFile(JSON_PATH, JSON.stringify(data, null, 2) + '\n');
console.log('\nDone — blurDataURL fields written to presentation.json');
