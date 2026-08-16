import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(projectRoot, 'public');
const imagesDir = join(publicDir, 'images');
const failures = [];

function sizeOf(path) {
  if (!existsSync(path)) {
    failures.push(`missing optimized image: ${path.replace(`${projectRoot}/`, '')}`);
    return 0;
  }
  return statSync(path).size;
}

const heroBytes = sizeOf(join(publicDir, 'hero-silk-bright.avif'));
const textureBytes = sizeOf(join(imagesDir, 'saree-texture-light.avif'));
const galleryBytes = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  .reduce((total, number) => total + sizeOf(join(imagesDir, `saree-${number}.avif`)), 0);

if (heroBytes > 300 * 1024) failures.push(`hero image is ${(heroBytes / 1048576).toFixed(2)} MB; budget is 0.30 MB`);
if (textureBytes > 350 * 1024) failures.push(`about texture is ${(textureBytes / 1048576).toFixed(2)} MB; budget is 0.35 MB`);
if (galleryBytes > 1800 * 1024) failures.push(`home gallery is ${(galleryBytes / 1048576).toFixed(2)} MB; budget is 1.80 MB`);

const shopImages = readdirSync(imagesDir).filter(name => name.startsWith('shop-') && name.endsWith('.avif'));
if (shopImages.length < 250) failures.push(`only ${shopImages.length} optimized shop images found; expected at least 250`);
const shopSizes = shopImages.map(name => sizeOf(join(imagesDir, name)));
const shopBytes = shopSizes.reduce((total, size) => total + size, 0);
const largestShopImage = Math.max(...shopSizes, 0);
if (shopBytes > 18 * 1048576) failures.push(`optimized shop catalogue is ${(shopBytes / 1048576).toFixed(1)} MB; budget is 18 MB`);
if (largestShopImage > 300 * 1024) failures.push(`largest shop image is ${(largestShopImage / 1024).toFixed(0)} KB; budget is 300 KB`);

const mainSource = readFileSync(join(projectRoot, 'src', 'main.tsx'), 'utf8');
const styleSource = readFileSync(join(projectRoot, 'src', 'styles.css'), 'utf8');
if (/shop-[^'"`]+\.jpeg/.test(mainSource)) failures.push('shop still references unoptimized JPEG images');
if (/saree-(?:3-4k|texture-light-4k)\.png/.test(`${mainSource}\n${styleSource}`)) failures.push('home still references a 4K PNG');

if (failures.length) {
  console.error(`Performance budget failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Performance budget passed: hero ${(heroBytes / 1024).toFixed(0)} KB, deferred gallery ${(galleryBytes / 1024).toFixed(0)} KB, shop catalogue ${(shopBytes / 1048576).toFixed(1)} MB.`);
