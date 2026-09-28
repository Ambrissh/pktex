import React, { CSSProperties, useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

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
    return () => document.body.classList.remove('navigation-open');
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  return <header className={`header ${onLightPage ? 'header--light-page' : ''} ${scrolled ? 'header--scrolled' : ''} ${open ? 'header--menu-open' : ''}`}>
    <a className="brand" href="#home" aria-label="PK TEX home" onClick={() => setOpen(false)}><span>PK</span><i/><span>TEX</span></a>
    <nav className={open ? 'nav nav--open' : 'nav'} id="main-navigation" aria-label="Main navigation">
      {navItems.map(([label, href], index) => <a key={href} href={href} style={{ '--i': index } as CSSProperties} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav__visit" href="#contact" style={{ '--i': navItems.length } as CSSProperties} onClick={() => setOpen(false)}>Contact Us <ArrowUpRight size={15}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(value => !value)} aria-controls="main-navigation" aria-expanded={open} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>;
}

export function Hero() {
  const [liteMotion, setLiteMotion] = useState(true);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clientNavigator = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const updateMotionMode = () => {
      const limitedCpu = clientNavigator.hardwareConcurrency > 0 && clientNavigator.hardwareConcurrency <= 4;
      const limitedMemory = typeof clientNavigator.deviceMemory === 'number' && clientNavigator.deviceMemory <= 4;
      setLiteMotion(motionPreference.matches || limitedCpu || limitedMemory || Boolean(clientNavigator.connection?.saveData));
    };

    updateMotionMode();
    if (motionPreference.addEventListener) motionPreference.addEventListener('change', updateMotionMode);
    else motionPreference.addListener(updateMotionMode);
    return () => {
      if (motionPreference.removeEventListener) motionPreference.removeEventListener('change', updateMotionMode);
      else motionPreference.removeListener(updateMotionMode);
    };
  }, []);

  return <section className={`hero ${liteMotion ? 'hero--lite-motion' : ''}`} id="home">
    <picture className="hero__portrait">
      <source srcSet="/images/hero-cultural.avif" type="image/avif" />
      <img src="/images/hero-cultural.jpg" alt="A smiling Tamil woman in a crimson silk saree beside brass lamps and folded sarees, with a Thanjavur temple tower in warm evening light" width="1672" height="941" loading="eager" fetchPriority="high" decoding="async" />
    </picture>
    <div className="hero__veil" aria-hidden="true" />
    <div className="hero__silk-motion" aria-hidden="true"><span/><span/></div>
    <div className="hero__zari-border" aria-hidden="true" />
    <div className="hero__content">
      <p className="hero__kicker intro intro--1">Handloom heritage <i/> Elampillai</p>
      <h1 className="wordmark" aria-label="PK TEX"><span className="intro intro--2">PK</span><em className="intro intro--3">TEX</em></h1>
      <div className="hero__origin intro intro--4">
        <p className="hero__place">Elampillai</p>
        <p className="hero__since">Since 1998</p>
      </div>
      <p className="hero__story intro intro--5">Woven by tradition.<br/>Made for today.</p>
      <a className="hero__cta intro intro--5" href="#shop">Shop Sarees <ArrowUpRight size={18}/></a>
    </div>
  </section>;
}
