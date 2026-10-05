import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Globe2, Menu, Pause, Play, MessageCircle, X } from 'lucide-react';
import './hero.css';

const orderLink = 'https://wa.me/919994536855?text=Hi%20PK%20TEX%2C%20I%20want%20to%20place%20an%20order.';
const navItems = [['Home', '#home'], ['The collections', '#shop'], ['Reviews', '#reviews'], ['Visit us', '#contact']];

export function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('navigation-open');
    navigation.current?.querySelector('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const links = navigation.current?.querySelectorAll('a');
        if (!links?.length) return;
        if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menuButton.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === menuButton.current) { event.preventDefault(); links[0].focus(); }
      }
    };
    const desktop = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.classList.remove('navigation-open');
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);
  useEffect(() => setOpen(false), [route]);
  return <header className={`atelier-header ${scrolled ? 'atelier-header--scrolled' : ''} ${route.startsWith('#reviews') ? 'atelier-header--solid' : ''} ${open ? 'atelier-header--open' : ''}`}>
    <a className="atelier-brand" href="#home" aria-label="PK TEX home" onClick={() => setOpen(false)}>
      <img src="/pktex-logo.jpg" alt="PK TEX" width="1078" height="1078" decoding="async" />
    </a>
    <nav ref={navigation} className="atelier-nav" id="main-navigation" aria-label="Main navigation">
      {navItems.map(([label, href]) => <a key={href} href={href} aria-current={route.startsWith(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}{href === '#contact' && <ArrowUpRight size={13}/>}</a>)}
    </nav>
    <a className="atelier-concierge" href={orderLink} target="_blank" rel="noreferrer" aria-label="Find your saree on WhatsApp"><MessageCircle size={16} strokeWidth={1.4}/><span>Let’s find your saree</span><ArrowUpRight size={14}/></a>
    <button ref={menuButton} className="atelier-menu" onClick={() => setOpen(v => !v)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</button>
  </header>;
}

export function Hero() {
  const [liteMotion, setLiteMotion] = useState(true);
  const [motionPaused, setMotionPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const client = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const update = () => setLiteMotion(preference.matches || (client.hardwareConcurrency > 0 && client.hardwareConcurrency <= 4) || (typeof client.deviceMemory === 'number' && client.deviceMemory <= 4) || Boolean(client.connection?.saveData));
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <section className={`campaign ${liteMotion || motionPaused ? 'campaign--lite-motion' : ''}`} id="home" aria-labelledby="campaign-title">
    <picture className="campaign__silk" aria-hidden="true">
      <source srcSet="/hero-silk-bright.avif" type="image/avif"/>
      <img src="/hero-silk-bright.jpg" alt="" width="1800" height="1013" loading="eager" fetchPriority="high" decoding="async"/>
    </picture>
    <div className="campaign__light" aria-hidden="true"/>
    <div className="campaign__layout">
      <div className="campaign__copy">
        <p className="campaign__eyebrow campaign__enter">PK TEX <span/> Elampillai, since 1998</p>
        <h1 id="campaign-title" className="campaign__title"><span>Tradition,</span><em>in full colour.</em></h1>
        <p className="campaign__description campaign__enter">Rich silks. Beautiful cottons. Sarees to make your own.<br/>From our family in Elampillai to yours.</p>
        <div className="campaign__actions campaign__enter">
          <a className="campaign__shop" href="#shop">Discover our sarees <ArrowUpRight size={20} strokeWidth={1.5}/></a>
          <a className="campaign__story" href="#our-story">The PK TEX story <ArrowUpRight size={15}/></a>
        </div>
        <p className="campaign__collection campaign__enter">SILK <i/> COTTON <i/> CELEBRATION</p>
      </div>
      <figure className="campaign__photo">
        <picture className="campaign__portrait">
          <source srcSet="/images/hero-editorial.avif" type="image/avif" />
          <img src="/images/hero-editorial.jpg" alt="A woman wearing a vivid coral and magenta saree with a gold border, photographed among golden flowers" width="1066" height="1600" loading="eager" decoding="async" />
        </picture>
        <figcaption><span>The colour of celebration</span><span>PK TEX</span></figcaption>
      </figure>
    </div>
    <div className="campaign__bottom">
      <a href="#our-story">Woven in Elampillai <ArrowDown size={14}/></a>
      <span>Three generations. One love for the saree.</span>
      <div><span><Globe2 size={15} strokeWidth={1.3}/> Shipping worldwide</span>{!liteMotion && <button onClick={() => setMotionPaused(value => !value)} aria-label={motionPaused ? 'Play silk animation' : 'Pause silk animation'} aria-pressed={motionPaused}>{motionPaused ? <Play size={14}/> : <Pause size={14}/>}</button>}</div>
    </div>
  </section>;
}
