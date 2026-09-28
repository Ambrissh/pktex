import { readFile } from 'node:fs/promises';

const [main, styles, storefrontStyles] = await Promise.all([
  readFile(new URL('../src/HomeHero.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/home-storefront.css', import.meta.url), 'utf8'),
]);

const heroStart = main.indexOf('function Hero()');
const heroEnd = main.length;
const hero = main.slice(heroStart, heroEnd);

const failures = [];
const requirePattern = (pattern, message) => {
  if (!pattern.test(hero + '\n' + styles + '\n' + storefrontStyles)) failures.push(message);
};

if (/addEventListener\(['"]scroll['"]/.test(hero)) {
  failures.push('Hero must not run a scroll-linked animation loop.');
}

if (/\.intro\s*\{[^}]*opacity\s*:\s*0/s.test(styles)) {
  failures.push('Hero content must be visible before animation starts.');
}

if (/\.hero__image\s*\{[^}]*background-image[^}]*url\(/s.test(styles)) {
  failures.push('Hero artwork must use a real image element with a browser fallback.');
}

requirePattern(/className="storefront-hero__portrait"/, 'Hero needs the reference-style portrait panel.');
requirePattern(/hero-cultural\.avif/, 'Hero needs an optimized AVIF source.');
requirePattern(/hero-cultural\.jpg/, 'Hero needs a JPEG fallback for older Firefox.');
requirePattern(/storefront-topbar/, 'Home needs the reference-style information bar.');
requirePattern(/storefront-nav/, 'Home needs the reference-style category navigation.');
requirePattern(/prefers-reduced-motion:\s*reduce/, 'Hero motion needs a reduced-motion fallback.');
requirePattern(/height:\s*calc\(100svh - 170px\)/, 'Hero needs a full-screen storefront layout.');
requirePattern(/Cormorant Garamond/, 'Hero needs the editorial serif display font.');

if (failures.length) {
  console.error(`Hero compatibility failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Hero compatibility passed.');
