import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { SilkCurtain } from './SilkCurtain';

const navItems = [['Home', '#home'], ['Shop', '#shop'], ['Reviews', '#reviews']];

export function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onLightPage = route.startsWith('#shop') || route.startsWith('#reviews');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('navigation-open', open);
    const desktop = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    desktop.addEventListener?.('change', closeOnDesktop);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('navigation-open');
      desktop.removeEventListener?.('change', closeOnDesktop);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  return <header className={`header ${onLightPage ? 'header--light-page' : ''} ${scrolled ? 'header--scrolled' : ''} ${open ? 'header--menu-open' : ''}`}>
    <a className="brand brand--logo" href="#home" aria-label="PK TEX home" onClick={() => setOpen(false)}>
      <span className="brand__mark"><img src="/pktex-logo.jpg" alt="" width="1078" height="1078" /></span>
    </a>
    <nav className={open ? 'nav nav--open' : 'nav'} id="main-navigation" aria-label="Main navigation">
      {navItems.map(([label, href], index) => <a key={href} href={href} style={{ '--i': index } as CSSProperties} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav__visit" href="#contact" style={{ '--i': navItems.length } as CSSProperties} onClick={() => setOpen(false)}>Contact Us <ArrowUpRight size={15}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(value => !value)} aria-controls="main-navigation" aria-expanded={open} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>;
}

export function Hero() {
  const portrait = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState<'pending' | 'revealing' | 'complete'>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || (window.location.hash && window.location.hash !== '#home') ? 'complete' : 'pending');
  const reveal = useCallback(() => setPhase(current => current === 'complete' ? current : 'revealing'), []);
  const complete = useCallback(() => setPhase('complete'), []);

  useEffect(() => {
    document.body.classList.toggle('hero-intro-pending', phase === 'pending');
    return () => document.body.classList.remove('hero-intro-pending');
  }, [phase]);

  return <><section className={`hero hero--${phase}`} id="home">
    <div className="hero__backdrop" aria-hidden="true" />
    <picture className="hero__portrait">
      <source srcSet="/images/hero-campaign-bright.avif" type="image/avif" />
      <img ref={portrait} src="/images/hero-campaign-bright.jpg" alt="Two women in vibrant red and emerald silk sarees with gold zari in a sunlit Indian courtyard" width="1800" height="794" loading="eager" fetchPriority="high" decoding="async" />
    </picture>
    <div className="hero__veil" aria-hidden="true" />
    <div className="hero__zari-border" aria-hidden="true" />
    <div className="hero__content">
      <p className="hero__kicker intro intro--1">PK TEX <span>ELAMPILLAI SILKS</span></p>
      <h1 className="hero__headline intro intro--2">Silk in<br/><em>full colour.</em></h1>
      <p className="hero__story intro intro--3">Vivid silk sarees, intricate gold zari and the craft of Elampillai in every drape.</p>
      <div className="hero__actions intro intro--4">
        <a className="hero__cta" href="#shop">Explore sarees <ArrowUpRight size={18}/></a>
        <a className="hero__secondary" href="#our-story">Our story <span aria-hidden="true">↗</span></a>
      </div>
      <p className="hero__provenance intro intro--5">Woven in Elampillai <span>Since 1998</span></p>
    </div>
  </section>
    {phase !== 'complete' && <SilkCurtain heroImage={portrait} onReveal={reveal} onComplete={complete} />}
  </>;
}
