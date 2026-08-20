import { readFile } from 'node:fs/promises';

const [main, styles] = await Promise.all([
  readFile(new URL('../src/main.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
]);

const heroStart = main.indexOf('function Hero()');
const heroEnd = main.indexOf('\nconst facts', heroStart);
const hero = main.slice(heroStart, heroEnd);

const failures = [];
const requirePattern = (pattern, message) => {
  if (!pattern.test(hero + '\n' + styles)) failures.push(message);
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

requirePattern(/<picture className="hero__portrait"/, 'Hero needs a responsive cultural portrait.');
requirePattern(/hero-cultural\.avif/, 'Hero needs an optimized AVIF source.');
requirePattern(/hero-cultural\.jpg/, 'Hero needs a JPEG fallback for older Firefox.');
requirePattern(/hero--lite-motion/, 'Hero needs a low-power animation mode.');
requirePattern(/prefers-reduced-motion:\s*reduce/, 'Hero motion needs a reduced-motion fallback.');
requirePattern(/height:\s*100vh;\s*height:\s*100svh/, 'Hero needs a 100vh fallback for older Firefox.');

if (failures.length) {
  console.error(`Hero compatibility failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Hero compatibility passed.');
