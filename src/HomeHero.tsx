import React, { CSSProperties, useEffect, useState } from 'react';
import { Heart, MapPin, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import './home-storefront.css';

const navItems = [
  ['Home', '#home'], ['About Us', '#our-story'], ['Shop Sarees', '#shop'], ['Soft Silk Sarees', '#shop'], ['Cotton Sarees', '#shop'], ['Wedding Sarees', '#shop'], ['Contact Us', '#contact'],
];

export function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('navigation-open', open);
    return () => document.body.classList.remove('navigation-open');
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  return <header className={`storefront-header ${scrolled ? 'storefront-header--scrolled' : ''} ${open ? 'storefront-header--open' : ''}`}>
    <div className="storefront-topbar">
      <p><MapPin size={13} fill="currentColor"/> Elampillai, Tamil Nadu 637502</p>
      <p className="storefront-topbar__contact">+91 99945 36855 <i/> info@pktex.in</p>
      <div><a href="#shop">Track Order</a><a href="#contact">Contact Us</a></div>
    </div>
    <div className="storefront-mainbar">
      <a className="storefront-logo" href="#home" aria-label="PK TEX home"><img src="/pktex-logo.jpg" alt="PK TEX" width="1078" height="1078" decoding="async"/></a>
      <a className="storefront-search" href="#shop"><Search size={18}/><span>Search for sarees</span></a>
      <div className="storefront-tools" aria-label="Shop tools"><a href="#contact" aria-label="Account"><UserRound size={20}/></a><a href="#shop" aria-label="Wishlist"><Heart size={20}/></a><a href="#shop" aria-label="Shopping bag"><ShoppingBag size={20}/><sup>0</sup></a></div>
      <button className="storefront-menu" onClick={() => setOpen(value => !value)} aria-controls="storefront-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</button>
    </div>
    <nav className="storefront-nav" id="storefront-navigation" aria-label="Main navigation">
      {navItems.map(([label, href], index) => <a key={`${label}-${href}`} href={href} className={route.startsWith(href) ? 'is-current' : undefined} style={{ '--i': index } as CSSProperties} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
  </header>;
}

export function Hero() {
  return <section className="storefront-hero" id="home" aria-labelledby="storefront-title">
    <div className="storefront-hero__texture" aria-hidden="true"/>
    <div className="storefront-hero__copy">
      <p className="storefront-hero__eyebrow">ELAMPILLAI’S SAREE HOUSE</p>
      <h1 id="storefront-title"><span>PK</span> TEX</h1>
      <p className="storefront-hero__subtitle">SAREES</p>
      <p className="storefront-hero__tagline">Grace in every weave, elegance in every drape.</p>
      <a className="storefront-hero__cta" href="#shop">SHOP THE COLLECTION</a>
    </div>
    <figure className="storefront-hero__portrait">
      <picture>
        <source srcSet="/images/hero-cultural.avif" type="image/avif" />
        <img src="/images/hero-cultural.jpg" alt="A woman in a traditional silk saree" width="1672" height="941" loading="eager" fetchPriority="high" decoding="async" />
      </picture>
    </figure>
    <div className="storefront-hero__promise" aria-label="PK TEX service promises">
      <span>Premium sarees</span><i/><span>Timeless tradition</span><i/><span>Trusted quality</span>
    </div>
  </section>;
}
