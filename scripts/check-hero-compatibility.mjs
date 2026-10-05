import { readFile } from 'node:fs/promises';

const [main, legacyStyles, heroStyles, curtain, renderer] = await Promise.all([
  readFile(new URL('../src/HomeHero.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/hero.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/SilkCurtain.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/silkCurtainRenderer.ts', import.meta.url), 'utf8'),
]);
const styles = `${legacyStyles}\n${heroStyles}`;

const heroStart = main.indexOf('function Hero()');
const heroEnd = main.length;
const hero = main.slice(heroStart, heroEnd);

const failures = [];
const requirePattern = (pattern, message) => {
  if (!pattern.test(hero + '\n' + styles + '\n' + curtain + '\n' + renderer)) failures.push(message);
};

if (/addEventListener\(['"]scroll['"]/.test(hero)) {
  failures.push('Hero must not run a scroll-linked animation loop.');
}

requirePattern(/\.hero \.intro\s*\{[^}]*opacity\s*:\s*1/s, 'Settled hero content must be visible without a running animation.');

if (/\.hero__image\s*\{[^}]*background-image[^}]*url\(/s.test(styles)) {
  failures.push('Hero artwork must use a real image element with a browser fallback.');
}

requirePattern(/<picture className="hero__portrait"/, 'Hero needs a responsive portrait.');
requirePattern(/\.hero__curtain\s*\{[^}]*position:\s*fixed;/s, 'Opening saree must cover the full viewport.');
requirePattern(/artwork\.decode\(\)/, 'Opening saree must wait for its image before falling.');
requirePattern(/hero-campaign-bright\.avif/, 'Hero needs an optimized AVIF source.');
requirePattern(/hero-campaign-bright\.jpg/, 'Hero needs a JPEG fallback for older Firefox.');
requirePattern(/const lite =/, 'Hero needs a low-power animation mode.');
requirePattern(/cancelAnimationFrame/, 'The curtain render loop must be cleaned up.');
requirePattern(/prefers-reduced-motion:\s*reduce/, 'Hero motion needs a reduced-motion fallback.');
requirePattern(/height:\s*100vh;\s*height:\s*100svh/, 'Hero needs a 100vh fallback for older Firefox.');
requirePattern(/Cormorant Garamond/, 'Hero needs the restored editorial serif font.');

if (/hero__kicker-line|hero__kicker-divider/.test(hero + '\n' + heroStyles)) {
  failures.push('Home kicker must not display decorative dashes.');
}

if (failures.length) {
  console.error(`Hero compatibility failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Hero compatibility passed.');
