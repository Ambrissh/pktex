import { cpSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const publicDir = join(projectRoot, 'public');
const outputDir = join(projectRoot, 'dist');
const sourceOnlyAssets = new Set([
  'hero-silk-bright.png',
  'images/hero-cultural.png',
  'images/saree-3-4k.png',
  'images/saree-texture-light-4k.png',
]);

function isDeployablePublicAsset(sourcePath: string) {
  const publicPath = relative(publicDir, sourcePath);
  if (!publicPath) return true;

  const fileName = basename(sourcePath);
  if (/ \d+\.(?:avif|jpe?g|png|webp)$/i.test(fileName)) return false;
  if (/\.jpeg$/i.test(fileName)) return false;
  return !sourceOnlyAssets.has(publicPath);
}

export default defineConfig(({ command }) => ({
  publicDir: command === 'build' ? false : 'public',
  plugins: [
    react(),
    {
      name: 'copy-deployable-public-assets',
      apply: 'build',
      closeBundle() {
        mkdirSync(outputDir, { recursive: true });
        cpSync(publicDir, outputDir, { recursive: true, filter: isDeployablePublicAsset });
      },
    },
  ],
}));
