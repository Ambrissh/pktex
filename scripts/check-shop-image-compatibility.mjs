import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(projectRoot, 'public', 'images');
const mainSource = readFileSync(join(projectRoot, 'src', 'main.tsx'), 'utf8');
const failures = [];

const jpegStartOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function readJpegDimensions(filePath) {
  const bytes = readFileSync(filePath);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 3 < bytes.length) {
    while (offset < bytes.length && bytes[offset] !== 0xff) offset += 1;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;

    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 1 >= bytes.length) break;

    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) break;
    if (jpegStartOfFrameMarkers.has(marker) && segmentLength >= 7) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }

  return null;
}

function validateJpeg(name) {
  const filePath = join(imagesDir, name);
  if (!existsSync(filePath)) {
    failures.push(`missing JPEG image: ${name}`);
    return;
  }

  const dimensions = readJpegDimensions(filePath);
  if (!dimensions || dimensions.width < 200 || dimensions.height < 200) {
    failures.push(`unreadable or undersized JPEG image: ${name}`);
  }
}

const shopSources = readdirSync(imagesDir)
  .filter(name => name.startsWith('shop-') && extname(name).toLowerCase() === '.jpeg' && !name.includes(' 2.'));
const shopJpegs = readdirSync(imagesDir)
  .filter(name => name.startsWith('shop-') && extname(name).toLowerCase() === '.jpg' && !name.includes(' 2.') && !name.endsWith('-chrome.jpg'));

for (const sourceName of shopSources) {
  const jpgName = `${sourceName.slice(0, -5)}.jpg`;
  const jpgPath = join(imagesDir, jpgName);
  if (!existsSync(jpgPath)) {
    failures.push(`missing JPEG compatibility image: ${jpgName}`);
    continue;
  }
  if (statSync(jpgPath).size < 8 * 1024) failures.push(`invalid or empty JPEG compatibility image: ${jpgName}`);
}

for (const jpgName of shopJpegs) validateJpeg(jpgName);

const categoriesStart = mainSource.indexOf('const shopCategories');
const categoriesEnd = mainSource.indexOf('\nconst kalyaniColors', categoriesStart);
const categoryImageNames = [...mainSource.slice(categoriesStart, categoriesEnd).matchAll(/image:\s*'\/images\/([^']+\.jpg)'/g)]
  .map(match => match[1]);

if (categoryImageNames.length !== 15) {
  failures.push(`found ${categoryImageNames.length} category thumbnail references; expected 15`);
}
for (const imageName of categoryImageNames) validateJpeg(imageName);

const productsStart = mainSource.indexOf('const shopProducts');
const productsEnd = mainSource.indexOf('\ntype ReliableImageProps', productsStart);
const productsSource = mainSource.slice(productsStart, productsEnd);
const avifGalleryReferences = productsSource.match(/images:\s*\[[^\]]*\.avif[^\]]*\]/g) ?? [];

if (avifGalleryReferences.length) {
  failures.push(`${avifGalleryReferences.length} product gallery definitions still use AVIF as the primary source`);
}

if (!/images:\s*\[[^\]]*\.jpg/.test(productsSource)) {
  failures.push('product galleries do not use browser-safe JPEG images');
}

if (shopSources.length < 270) failures.push(`only ${shopSources.length} shop source images found; expected at least 270`);

const categoryRequirements = [
  ['Kalyani Cotton Sarees', /^shop-kalyani-\d{2}-[ab]\.jpg$/, 42],
  ['Korvai Checked Cotton Sarees', /^shop-korvai-checked-cotton-\d{2}\.jpg$/, 11],
  ['Maheshwari Cotton Sarees', /^shop-maheshwari-cotton-\d{2}\.jpg$/, 23],
  ['Palaku Design Sarees', /^shop-palaku-\d{2}\.jpg$/, 15],
  ['Kadhi Cotton Sarees', /^shop-kadhi-\d{2}\.jpg$/, 27],
  ['120 Count Mul Mul Cotton Sarees', /^shop-mulmul-\d{2}\.jpg$/, 25],
  ['Rainbow Mul Mul Cotton Sarees', /^shop-rainbow-mulmul-\d{2}\.jpg$/, 5],
  ['Soft Silk Sarees', /^shop-softsilk-\d{2}\.jpg$/, 21],
  ['Arani Soft Silk Sarees', /^shop-arani-soft-silk-\d{2}\.jpg$/, 6],
  ['Fancy Silk Sarees', /^shop-fancy-silk-\d{2}\.jpg$/, 36],
  ['Tissue Printed Soft Cotton Sarees', /^shop-tissue-printed-soft-cotton-\d{2}\.jpg$/, 18],
  ['Sunflower Khadi Cotton Sarees', /^shop-sunflower-khadi-\d{2}\.jpg$/, 12],
  ['Kerala Cotton Sarees', /^shop-kerala-cotton-\d{2}\.jpg$/, 11],
  ['Kerala Checked Cotton Sarees', /^shop-kerala-checked-\d{2}\.jpg$/, 10],
];

for (const [category, pattern, expected] of categoryRequirements) {
  const actual = shopJpegs.filter(name => pattern.test(name)).length;
  if (actual !== expected) failures.push(`${category} has ${actual} JPEG gallery images; expected ${expected}`);
}

const devotionalImages = [
  'shop-swami-gold-devotional.jpg',
  'shop-swami-gold-folded.jpg',
  'shop-amman-pink-devotional.jpg',
  'shop-amman-pink-folded.jpg',
  'shop-amman-red-devotional.jpg',
  'shop-amman-red-folded.jpg',
  'shop-amman-green-devotional.jpg',
  'shop-amman-green-folded.jpg',
  'shop-amman-light-green-devotional.jpg',
  'shop-amman-light-green-folded.jpg',
];
for (const name of devotionalImages) {
  if (!shopJpegs.includes(name)) failures.push(`Swami & Amman Temple Sarees is missing ${name}`);
}

if (failures.length) {
  console.error(`Shop image compatibility failed:\n- ${failures.slice(0, 30).join('\n- ')}${failures.length > 30 ? `\n- ...and ${failures.length - 30} more` : ''}`);
  process.exit(1);
}

console.log(`Shop image compatibility passed: all 15 category thumbnails and 271 active gallery images are readable JPEGs; ${shopSources.length} source images have direct JPEG coverage.`);
