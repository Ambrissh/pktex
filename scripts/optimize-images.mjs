import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(projectRoot, 'public');
const imagesDir = join(publicDir, 'images');
const force = process.argv.includes('--force');

const imageJobs = [
  { source: join(imagesDir, 'hero-cultural.png'), output: join(imagesDir, 'hero-cultural.avif'), maxSize: 1600, quality: 62 },
  { source: join(imagesDir, 'hero-cultural.png'), output: join(imagesDir, 'hero-cultural.jpg'), maxSize: 1800, quality: 70, format: 'jpeg' },
  { source: join(publicDir, 'hero-silk-bright.png'), output: join(publicDir, 'hero-silk-bright.avif'), maxSize: 1600, quality: 70 },
  { source: join(publicDir, 'hero-silk-bright.png'), output: join(publicDir, 'hero-silk-bright.jpg'), maxSize: 1800, quality: 72, format: 'jpeg' },
  { source: join(imagesDir, 'saree-texture-light-4k.png'), output: join(imagesDir, 'saree-texture-light.avif'), maxSize: 1600, quality: 64 },
  { source: join(imagesDir, 'saree-3-4k.png'), output: join(imagesDir, 'saree-3.avif'), maxSize: 1600, quality: 68 },
  ...[1, 2, 4, 5, 6, 7, 8, 9].map(number => ({
    source: join(imagesDir, `saree-${number}.jpg`),
    output: join(imagesDir, `saree-${number}.avif`),
    maxSize: 1280,
    quality: 66,
  })),
  ...readdirSync(imagesDir)
    .filter(name => name.startsWith('shop-') && extname(name).toLowerCase() === '.jpeg')
    .map(name => ({
      source: join(imagesDir, name),
      output: join(imagesDir, `${name.slice(0, -5)}.avif`),
      maxSize: 1200,
      quality: 45,
    })),
  ...readdirSync(imagesDir)
    .filter(name => name.startsWith('shop-') && !name.includes(' 2.') && extname(name).toLowerCase() === '.jpeg')
    .map(name => ({
      source: join(imagesDir, name),
      output: join(imagesDir, `${name.slice(0, -5)}.jpg`),
      maxSize: 1100,
      quality: 58,
      format: 'jpeg',
    })),
];

let converted = 0;
let skipped = 0;

for (const job of imageJobs) {
  if (!existsSync(job.source)) throw new Error(`Missing source image: ${job.source}`);
  const outputIsCurrent = !force && existsSync(job.output) && statSync(job.output).mtimeMs >= statSync(job.source).mtimeMs;
  if (outputIsCurrent) {
    skipped += 1;
    continue;
  }

  execFileSync('sips', [
    '-s', 'format', job.format ?? 'avif',
    '-s', 'formatOptions', String(job.quality),
    '-Z', String(job.maxSize),
    job.source,
    '--out', job.output,
  ], { stdio: 'ignore' });
  converted += 1;
}

console.log(`Optimized ${converted} images; ${skipped} already current.`);
