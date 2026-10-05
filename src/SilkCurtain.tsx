import React, { useEffect, useRef } from 'react';
import { createSilkCurtainRenderer } from './silkCurtainRenderer';

export function SilkCurtain({ heroImage, onReveal, onComplete }: { heroImage: React.RefObject<HTMLImageElement | null>; onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = root.current!;
    const artwork = image.current!;
    const surface = canvas.current!;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const client = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lite = client.hardwareConcurrency <= 4 || (client.deviceMemory ?? 8) <= 4 || Boolean(client.connection?.saveData);
    let renderer: ReturnType<typeof createSilkCurtainRenderer> = null;
    let frame = 0;
    let started = false;
    let finished = false;
    let revealed = false;
    let fallbackTimer = 0;
    let startTime = 0;
    const picture = artwork.parentElement!;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallbackTimer);
      onReveal();
      onComplete();
    };

    const draw = (now: number) => {
      if (finished) return;
      const elapsed = now - startTime;
      const progress = Math.max(0, Math.min(1, (elapsed - 480) / 2150));
      if (!revealed && elapsed >= 1000) {
        revealed = true;
        onReveal();
      }
      if (renderer) {
        renderer.render(progress, elapsed / 1000);
      } else {
        // A lightweight curved-edge fallback for browsers without WebGL.
        const fall = Math.pow(progress, 1.42) * 148;
        const wave = Math.sin(progress * Math.PI);
        const edge = Array.from({ length: 25 }, (_, i) => {
          const x = i / 24;
          return `${x * 100}% ${(Math.sin(x * Math.PI) * 19 + Math.sin(x * 13 + elapsed / 700) * 4) * wave}%`;
        });
        picture.style.transform = `translateY(${fall / 1.13}%)`;
        picture.style.clipPath = `polygon(${edge.join(',')},100% 100%,0 100%)`;
      }
      if (progress >= 1) finish();
      else frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (started || finished) return;
      started = true;
      window.clearTimeout(fallbackTimer);
      if (preference.matches) return finish();
      if (artwork.naturalWidth) {
        try { renderer = createSilkCurtainRenderer(surface, artwork, lite); } catch { renderer = null; }
      }
      if (renderer) {
        renderer.render(0, 0);
        element.classList.add('hero__curtain--canvas');
      }
      startTime = performance.now();
      frame = window.requestAnimationFrame(draw);
    };
    const resize = () => renderer?.resize();
    const onPreferenceChange = () => { if (preference.matches) finish(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' || event.key === 'Tab') finish(); };
    const onContextLost = (event: Event) => { event.preventDefault(); finish(); };

    if (preference.matches) finish();
    else {
      // The page behind the fabric should be ready before it is uncovered.
      fallbackTimer = window.setTimeout(start, 2400);
      Promise.allSettled([artwork.decode(), heroImage.current?.decode(), document.fonts.ready]).then(start);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('wheel', finish, { passive: true, once: true });
    window.addEventListener('touchstart', finish, { passive: true, once: true });
    window.addEventListener('keydown', onKey);
    surface.addEventListener('webglcontextlost', onContextLost);
    preference.addEventListener?.('change', onPreferenceChange);

    return () => {
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallbackTimer);
      renderer?.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchstart', finish);
      window.removeEventListener('keydown', onKey);
      surface.removeEventListener('webglcontextlost', onContextLost);
      preference.removeEventListener?.('change', onPreferenceChange);
    };
  }, [heroImage, onReveal, onComplete]);

  return <div ref={root} className="hero__curtain" aria-hidden="true">
    <picture className="hero__curtain-fabric">
      <source srcSet="/images/hero-hanging-silk.avif" type="image/avif" />
      <img ref={image} src="/images/hero-hanging-silk.jpg" alt="" width="1536" height="1024" loading="eager" fetchPriority="high" decoding="sync" />
    </picture>
    <canvas ref={canvas} className="hero__curtain-canvas" />
  </div>;
}
