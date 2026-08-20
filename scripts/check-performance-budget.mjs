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

const heroBytes = sizeOf(join(imagesDir, 'hero-cultural.avif'));
const heroFallbackBytes = sizeOf(join(imagesDir, 'hero-cultural.jpg'));
const textureBytes = sizeOf(join(imagesDir, 'saree-texture-light.avif'));
const galleryBytes = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  .reduce((total, number) => total + sizeOf(join(imagesDir, `saree-${number}.avif`)), 0);
const chromeGalleryBytes = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  .reduce((total, number) => total + sizeOf(join(imagesDir, `saree-${number}-chrome.jpg`)), 0);
const chromeCategoryImages = readdirSync(imagesDir).filter(name => name.startsWith('shop-') && name.endsWith('-chrome.jpg'));
const chromeCategoryBytes = chromeCategoryImages.reduce((total, name) => total + sizeOf(join(imagesDir, name)), 0);
const kalyaniJpegImages = readdirSync(imagesDir).filter(name => /^shop-kalyani-\d{2}-[ab]\.jpg$/.test(name));
const kalyaniJpegBytes = kalyaniJpegImages.reduce((total, name) => total + sizeOf(join(imagesDir, name)), 0);
const tissuePrintedJpegImages = readdirSync(imagesDir).filter(name => /^shop-tissue-printed-soft-cotton-\d{2}\.jpg$/.test(name));
const tissuePrintedJpegBytes = tissuePrintedJpegImages.reduce((total, name) => total + sizeOf(join(imagesDir, name)), 0);
const shopSourceJpegs = readdirSync(imagesDir).filter(name => name.startsWith('shop-') && !name.includes(' 2.') && name.endsWith('.jpeg'));
const shopCompatibilityJpegs = shopSourceJpegs.map(name => `${name.slice(0, -5)}.jpg`);
const shopCompatibilityJpegBytes = shopCompatibilityJpegs.reduce((total, name) => total + sizeOf(join(imagesDir, name)), 0);
const largestCompatibilityJpeg = Math.max(...shopCompatibilityJpegs.map(name => sizeOf(join(imagesDir, name))), 0);

if (heroBytes > 350 * 1024) failures.push(`hero image is ${(heroBytes / 1048576).toFixed(2)} MB; budget is 0.35 MB`);
if (heroFallbackBytes > 650 * 1024) failures.push(`hero JPEG fallback is ${(heroFallbackBytes / 1048576).toFixed(2)} MB; budget is 0.65 MB`);
if (textureBytes > 350 * 1024) failures.push(`about texture is ${(textureBytes / 1048576).toFixed(2)} MB; budget is 0.35 MB`);
if (galleryBytes > 1800 * 1024) failures.push(`home gallery is ${(galleryBytes / 1048576).toFixed(2)} MB; budget is 1.80 MB`);
if (chromeGalleryBytes > 2 * 1048576) failures.push(`Chrome home gallery is ${(chromeGalleryBytes / 1048576).toFixed(2)} MB; budget is 2.00 MB`);
if (chromeCategoryBytes > 3 * 1048576) failures.push(`Chrome category cards are ${(chromeCategoryBytes / 1048576).toFixed(2)} MB; budget is 3.00 MB`);
if (kalyaniJpegImages.length < 42) failures.push(`only ${kalyaniJpegImages.length} Kalyani JPEG compatibility images found; expected 42`);
if (kalyaniJpegBytes > 9 * 1048576) failures.push(`Kalyani JPEG compatibility images are ${(kalyaniJpegBytes / 1048576).toFixed(1)} MB; budget is 9 MB`);
if (tissuePrintedJpegImages.length < 18) failures.push(`only ${tissuePrintedJpegImages.length} Tissue Printed JPEG compatibility images found; expected 18`);
if (tissuePrintedJpegBytes > 5 * 1048576) failures.push(`Tissue Printed JPEG compatibility images are ${(tissuePrintedJpegBytes / 1048576).toFixed(1)} MB; budget is 5 MB`);
if (shopCompatibilityJpegs.length < 270) failures.push(`only ${shopCompatibilityJpegs.length} catalogue JPEG compatibility images found; expected 270`);
if (shopCompatibilityJpegBytes > 55 * 1048576) failures.push(`catalogue JPEG compatibility images are ${(shopCompatibilityJpegBytes / 1048576).toFixed(1)} MB; budget is 55 MB`);
if (largestCompatibilityJpeg > 350 * 1024) failures.push(`largest catalogue JPEG is ${(largestCompatibilityJpeg / 1024).toFixed(0)} KB; budget is 350 KB`);

const shopImages = readdirSync(imagesDir).filter(name =>
  name.startsWith('shop-') && name.endsWith('.avif') && !/ \d+\.avif$/.test(name));
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

console.log(`Performance budget passed: hero AVIF ${(heroBytes / 1024).toFixed(0)} KB, hero JPEG ${(heroFallbackBytes / 1024).toFixed(0)} KB, Chrome gallery ${(chromeGalleryBytes / 1024).toFixed(0)} KB, Chrome categories ${(chromeCategoryBytes / 1024).toFixed(0)} KB, catalogue JPEGs ${(shopCompatibilityJpegBytes / 1048576).toFixed(1)} MB, shop catalogue ${(shopBytes / 1048576).toFixed(1)} MB.`);
