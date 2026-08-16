import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Globe2, Headphones, MapPin, Menu, MessageCircle, RotateCcw, ShieldCheck, Truck, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExpandingSareeAboutSection from './ExpandingSareeAboutSection';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const navItems = [['Home', '#home'], ['Shop', '#shop'], ['Reviews', '#reviews']];
const customerPhone = '9994536855';
const customerPhoneDisplay = '+91 99945 36855';
const whatsAppOrderLink = `https://wa.me/91${customerPhone}?text=Hi%20PK%20TEX%2C%20I%20want%20to%20place%20an%20order.`;

function useReveal(route: string) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .15 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [route]);
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
    <a className="brand" href="#home" aria-label="PK TEX home"><span>PK</span><i/><span>TEX</span></a>
    <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
      {navItems.map(([label, href], i) => <a key={href} href={href} style={{ '--i': i } as CSSProperties} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav__visit" href="#contact" onClick={() => setOpen(false)}>Contact Us <ArrowUpRight size={15}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>;
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => heroRef.current?.style.setProperty('--scroll', `${Math.min(window.scrollY, window.innerHeight)}px`);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <section className="hero" id="home" ref={heroRef}>
    <div className="hero__image" aria-hidden="true"/><div className="hero__grain" aria-hidden="true"/>
    <div className="hero__content">
      <h1 className="wordmark" aria-label="PK TEX"><span className="intro intro--2">PK</span><em className="intro intro--3">TEX</em></h1>
      <div className="hero__origin intro intro--4">
        <p className="hero__place">Elampillai</p>
        <p className="hero__since">Since 1998</p>
      </div>
      <a className="hero__cta intro intro--5" href="#shop">Shop Sarees <ArrowUpRight size={18}/></a>
    </div>
  </section>;
}

const facts = [
  ['30', '+', 'Years of Experience'], ['400', '+', 'Production Looms'], ['10', 'K+', 'Happy Customers'],
  ['3', 'rd', 'Generation Family Business'], ['5', '+', 'Countries Served Worldwide'], ['Worldwide', '', 'Shipping Available']
];

function Heritage() {
  const section = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = section.current; if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.heritage__line');
      gsap.set(lines, { yPercent: 120 });
      gsap.set('.heritage__final', { autoAlpha: 0, y: 48 });
      gsap.set('.heritage__kicker', { autoAlpha: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: '+=260%', pin: true, scrub: 1, anticipatePin: 1 }
      });
      tl.to(lines, { yPercent: 0, duration: 1.15, stagger: .14, ease: 'power3.out' })
        .to('.heritage__silk', { scale: 1.035, xPercent: 1.2, duration: 2, ease: 'none' }, 0)
        .to('.heritage__statement', { scale: .28, yPercent: -155, transformOrigin: 'center top', duration: 1.4, ease: 'power2.inOut' }, 1.45)
        .to('.heritage__statement', { autoAlpha: 0, duration: .35 }, 2.45)
        .to('.heritage__kicker', { autoAlpha: 1, duration: .4 }, 2.45)
        .to('.heritage__final', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 2.55);
      document.querySelectorAll<HTMLElement>('.fact__number[data-count]').forEach(node => {
        const target = Number(node.dataset.count); const state = { value: 0 };
        gsap.to(state, { value: target, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: node, start: 'top 85%', once: true }, onUpdate: () => { node.textContent = Math.round(state.value).toString(); } });
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return <section className="heritage" id="shop" ref={section}>
    <div className="heritage__silk" aria-hidden="true"><i/><i/><i/></div>
    <div className="heritage__statement" aria-label="PK TEX sarees">
      <div className="heritage__mask"><span className="heritage__line">PK TEX</span></div>
      <div className="heritage__mask"><span className="heritage__line heritage__line--accent">Sarees</span></div>
    </div>
    <p className="heritage__kicker">ABOUT PK TEX <span>02</span></p>
    <div className="heritage__final">
      <div className="heritage__story">
        <h2>PK TEX<br/><em>Elampillai.</em></h2>
        <div className="heritage__copy">
          <p>PK TEX makes sarees in Elampillai, Salem.</p>
          <p>We have more than 30 years of experience and over 400 looms.</p>
          <p>Our sarees are available across India and worldwide.</p>
        </div>
        <a className="heritage__button" href="#contact">Contact Us <ArrowUpRight size={17}/></a>
      </div>
      <div className="heritage__facts" id="reviews">
        {facts.map(([value, suffix, label]) => <article className="fact" key={label}>
          <div>{value === 'Worldwide' ? <strong className="fact__word">Worldwide</strong> : <><strong className="fact__number" data-count={value}>0</strong><sup>{suffix}</sup></>}</div>
          <p>{label}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

const collectionDirections = [
  [-72, -72], [0, -86], [72, -72],
  [-86, 0], [0, 0], [86, 0],
  [-72, 72], [0, 86], [72, 72]
];

function Collection() {
  const section = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = section.current; if (!el) return;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('.collection__tile');
      const center = tiles[4];
      const others = tiles.filter((_, i) => i !== 4);
      const rect = center.getBoundingClientRect();
      const sectionRect = el.getBoundingClientRect();
      const scale = Math.max(window.innerWidth / Math.max(rect.width, 1), window.innerHeight / Math.max(rect.height, 1)) * 1.02;
      const centerInSectionX = rect.left - sectionRect.left + rect.width / 2;
      const centerInSectionY = rect.top - sectionRect.top + rect.height / 2;
      const heroX = el.clientWidth / 2 - centerInSectionX;
      const heroY = el.clientHeight / 2 - centerInSectionY;
      gsap.set(center, { scale, x: heroX, y: heroY, zIndex: 4, borderRadius: 0 });
      others.forEach(tile => {
        const i = Number(tile.dataset.index);
        const [x, y] = collectionDirections[i];
        gsap.set(tile, { autoAlpha: 0, xPercent: x, yPercent: y, scale: .9 });
      });
      gsap.set('.collection__heading', { autoAlpha: 0, y: 25 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=230%', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } });
      tl.to('.collection__campaign-label', { autoAlpha: 0, y: -18, duration: .35, ease: 'power2.out' }, .18)
        .to(center, { scale: 1, x: 0, y: 0, borderRadius: 20, duration: 1.45, ease: 'power2.inOut' }, .3)
        .to('.collection__heading', { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, 1.08)
        .to(others, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: .85, stagger: .055, ease: 'power3.out' }, 1.1)
        .to('.collection__tile img', { yPercent: -2, duration: .9, ease: 'none' }, 1.5);
    }, el);
    return () => ctx.revert();
  }, []);
  return <section className="collection" id="collection" ref={section}>
    <div className="collection__campaign-label"><span>PK TEX</span><p>Sarees</p></div>
    <header className="collection__heading">
      <div><p>SAREES</p><span>03</span></div>
      <h2>Choose your<br/><em>favourite saree.</em></h2>
      <p>Browse cotton, silk, checked, temple, and festive sarees.</p>
    </header>
    <div className="collection__grid">
      {Array.from({ length: 9 }, (_, i) => {
        const imageNumber = i === 4 ? 3 : i === 2 ? 5 : i + 1;
        const imageSrc = `/images/saree-${imageNumber}-chrome.jpg`;
        return <a className={`collection__tile ${i === 4 ? 'collection__tile--featured' : ''}`} data-index={i} href="#shop" key={i} aria-label={`View saree collection ${i + 1} in the shop`}>
        <img src={imageSrc} alt={`PK TEX saree ${imageNumber}`} loading="eager" decoding="async" width="1280" height="853"/>
        <span className="collection__hover">Shop now <ArrowUpRight size={16}/></span>
      </a>})}
    </div>
  </section>;
}

const serviceHighlights = [
  { icon: Truck, title: 'Doorstep Delivery', detail: 'Delivered to your address.' },
  { icon: Globe2, title: 'Worldwide Shipping', detail: 'Shipping across India and abroad.' },
  { icon: RotateCcw, title: 'Free Returns', detail: 'Available with unboxing video proof.' },
  { icon: Headphones, title: '24/7 Support', detail: `Call Us: ${customerPhoneDisplay}`, href: `tel:+91${customerPhone}` },
  { icon: ShieldCheck, title: 'Secure Orders', detail: 'Your order details are secure with us.' },
  { icon: MessageCircle, title: 'WhatsApp Ordering', detail: 'Send the saree photo to place your order.', href: whatsAppOrderLink },
];

function ServiceHighlights() {
  return <section className="service-highlights" id="service" aria-labelledby="service-title">
    <header data-reveal>
      <h2 id="service-title">Order support</h2>
    </header>
    <div className="service-highlights__grid">
      {serviceHighlights.map(item => {
        const Icon = item.icon;
        return <article key={item.title} data-reveal>
          <Icon size={23} strokeWidth={1.6}/>
          <h3>{item.title}</h3>
          {item.href
            ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.detail}</a>
            : <p>{item.detail}</p>}
        </article>;
      })}
    </div>
  </section>;
}

const shopCategories = [
  {
    name: 'Swami & Amman Temple Sarees',
    description: 'Six-meter devotional sarees in Swami and Amman designs.',
    image: '/images/shop-swami-gold-devotional.jpg',
    count: 3,
  },
  {
    name: 'Kalyani Cotton Sarees',
    description: 'Kanchipuram-inspired cotton sarees with temple borders, breathable drape, and rich traditional colour pairings.',
    image: '/images/shop-kalyani-01-a-chrome.jpg',
    count: 21,
  },
  {
    name: 'Korvai Checked Cotton Sarees',
    description: 'Checked cotton sarees with bold korvai contrast borders, gold zari bands, and bright festive colour pairings.',
    image: '/images/shop-korvai-checked-cotton-01-chrome.jpg',
    count: 11,
  },
  {
    name: 'Maheshwari Cotton Sarees',
    description: 'Offer-ready Maheshwari cotton sarees with woven texture, small zari buttas, tassel edges, and contrast colour pairings.',
    image: '/images/shop-maheshwari-cotton-01-chrome.jpg',
    count: 23,
  },
  {
    name: 'Palaku Design Sarees',
    description: 'Single-view folded sarees with ornate palaku-inspired motifs, silver zari highlights, and rich festive colours.',
    image: '/images/shop-palaku-02-chrome.jpg',
    count: 15,
  },
  {
    name: 'Kadhi Cotton Sarees',
    description: 'Soft khadi cotton drapes with floral handwork, daisy and embroidered flower motifs, fringe detailing, and fresh everyday boutique colours.',
    image: '/images/shop-kadhi-01-chrome.jpg',
    count: 27,
  },
  {
    name: '120 Count Mul Mul Cotton Sarees',
    description: 'Weightless 120-count mul mul cotton sarees with airy stripes, soft tassels, and borderless everyday elegance.',
    image: '/images/shop-mulmul-01-chrome.jpg',
    count: 25,
  },
  {
    name: 'Rainbow Mul Mul Cotton Sarees',
    description: 'Soft rainbow-check mul mul cotton sarees with playful tassels, contrast blouse pieces, and airy summer colourways.',
    image: '/images/shop-rainbow-mulmul-01-chrome.jpg',
    count: 5,
  },
  {
    name: 'Soft Silk Sarees',
    description: 'Premium soft silk sarees with luminous zari motifs, rich contrast pallus, and festive boutique colour pairings.',
    image: '/images/shop-softsilk-01-chrome.jpg',
    count: 21,
  },
  {
    name: 'Arani Soft Silk Sarees',
    description: 'Arani soft silk sarees with neat pleated presentation, fine zari line work, contrast pallus, and smooth festive colours.',
    image: '/images/shop-arani-soft-silk-01-chrome.jpg',
    count: 6,
  },
  {
    name: 'Fancy Silk Sarees',
    description: 'Shopping-ready fancy silk sarees with geometric embroidery, peacock-inspired motifs, glossy borders, and rich boutique colours.',
    image: '/images/shop-fancy-silk-01-chrome.jpg',
    count: 36,
  },
  {
    name: 'Tissue Printed Soft Cotton Sarees',
    description: 'Lightweight soft cotton sarees with tissue-inspired shimmer, delicate linear prints, and rich contrast pallus.',
    image: '/images/shop-tissue-printed-soft-cotton-01-chrome.jpg',
    count: 6,
  },
  {
    name: 'Sunflower Khadi Cotton Sarees',
    description: 'Fresh khadi cotton sarees with cheerful sunflower motifs, soft tassels, and artisanal studio styling.',
    image: '/images/shop-sunflower-khadi-01-chrome.jpg',
    count: 12,
  },
    {
      name: 'Kerala Cotton Sarees',
      description: 'Onam-ready Kerala cotton sarees in warm ivory tones with temple-inspired borders, festive motifs, and celebration styling.',
      image: '/images/shop-kerala-cotton-01-chrome.jpg',
      count: 11,
    },
    {
      name: 'Kerala Checked Cotton Sarees',
      description: 'Checked Kerala cotton sarees in festive ivory and kasavu tones with printed floral borders, Onam styling, and blouse-inclusive 6.25m drapes.',
      image: '/images/shop-kerala-checked-01-chrome.jpg',
      count: 10,
    },
  ];

const kalyaniColors = [
  'Peacock Blue & Rani Pink',
  'Mustard Gold & Black',
  'Olive Gold & Maroon',
  'Steel Grey & Maroon',
  'Burnt Orange & Teal',
  'Temple Green & Black',
  'Royal Blue & Magenta',
  'Lime Green & Maroon',
  'Aqua Green & Wine',
  'Emerald Green & Rose',
  'Leaf Green & Silver',
  'Maroon & Silver',
  'Deep Blue & Red',
  'Ruby Pink & Navy',
  'Coral Pink & Bottle Green',
  'Magenta & Black',
  'Turmeric Gold & Maroon',
  'Sand Beige & Royal Blue',
  'Navy Blue & Sky Blue',
  'Royal Blue & Green',
  'Teal Blue & Maroon',
];

const korvaiCheckedCottonColors = [
  'Rose Pink & Royal Blue Border',
  'Lime Green & Royal Blue Border',
  'Mustard Yellow & Plum Border',
  'Olive Green & Royal Blue Border',
  'Yellow & Purple Border',
  'Blush Pink & Rani Pink Border',
  'Aqua Green & Maroon Border',
  'Orange & Purple Border',
  'Ivory Cream & Rani Pink Border',
  'Ivory Cream & Royal Blue Border',
  'Sand Cream & Royal Blue Border',
];

const maheshwariCottonColors = [
  'Emerald Green & Royal Blue',
  'Deep Teal & Rani Pink',
  'Orange & Bottle Green',
  'Ivory Cream & Red',
  'Rose Pink & Turquoise Blue',
  'Orange & Deep Plum',
  'Rust Orange & Royal Blue',
  'Antique Gold & Black',
  'Mustard Gold & Navy Blue',
  'Wine Maroon & Olive Green',
  'Royal Blue & Olive Green',
  'Copper Brown & Wine Maroon',
  'Charcoal Black & Antique Gold',
  'Forest Green & Rani Pink',
  'Rust Orange & Coffee Brown',
  'Leaf Green & Plum',
  'Lime Gold & Black',
  'Rani Pink & Black',
  'Plum & Olive Green',
  'Lavender & Maroon',
  'Baby Pink & Olive Green',
  'Sky Blue & Maroon',
  'Black & Rani Pink',
];

const palakuColors = [
  'Deep Red & Silver',
  'Mint Green & Gold',
  'Powder Blue & Peach',
  'Rose Red & Silver',
  'Royal Blue & Silver',
  'Lime Green & Gold',
  'Champagne Peach & Silver',
  'Teal Green & Silver',
  'Rani Pink & Silver',
  'Peacock Blue & Silver',
  'Copper Brown & Silver',
  'Forest Green & Silver',
  'Lotus Pink & Silver',
  'Chocolate Brown & Silver',
  'Lavender Purple & Silver',
];

const kadhiColors = [
  'Deep Teal Daisy',
  'Classic Black Daisy',
  'Navy Blue Daisy',
  'Sky Blue Daisy',
  'Rani Pink Daisy',
  'Royal Blue Daisy',
  'Sunshine Yellow Daisy',
  'Lime Green Daisy',
  'Soft Cream Daisy',
  'Purple Daisy',
  'Baby Pink Daisy',
  'Wine Plum Daisy',
  'Bright Yellow Embroidered Floral',
  'Maroon Embroidered Floral',
  'Forest Green Embroidered Floral',
  'Navy Blue Embroidered Floral',
  'Soft Peach Embroidered Floral',
  'Black Embroidered Floral',
  'Classic Red Embroidered Floral',
  'Charcoal Embroidered Floral',
  'Lavender Embroidered Floral',
  'Royal Blue Yellow Tassel Floral',
  'Ivory Embroidered Floral',
  'Sky Blue Yellow Tassel Floral',
  'Rani Pink Embroidered Floral',
  'Teal Embroidered Floral',
  'Baby Pink Embroidered Floral',
];

const mulmulColors = [
  'Pink Yellow Borderless Stripe',
  'Olive Orange Comfort Stripe',
  'Purple Tonal Borderless',
  'Grey Blue Unbordered Stripe',
  'Pastel Multicolour Stripe',
  'Emerald Green Tonal Stripe',
  'Maroon Black Heritage Stripe',
  'Orange Pink Stripe',
  'Aqua Pink Yellow Stripe',
  'Saffron Orange Stripe',
  'Blue Purple Heritage Stripe',
  'Black Grey Unbordered',
  'Mustard Earth Folded Stripe',
  'Violet White Tassel Stripe',
  'Pastel Sky Multicolour',
  'Blue Purple Lime Stripe',
  'White Mustard Pink Stripe',
  'Grey Black Stripe',
  'Maroon Black Gold Stripe',
  'Emerald Green Stripe',
  'Pastel Rainbow Tassel',
  'Grey Blue Tassel Stripe',
  'Rani Orange Stripe',
  'Royal Blue Pink Gold Stripe',
  'Olive Orange Tassel Stripe',
];

const rainbowMulmulColors = [
  'Rainbow Check & White Blouse',
  'Rainbow Check & Ocean Blue Blouse',
  'Rainbow Check & Deep Teal Blouse',
  'Rainbow Check & Black Blouse',
  'Rainbow Check & Navy Blue Blouse',
];

const softSilkColors = [
  'Pink & Sky Blue Zari',
  'Peach & Violet Zari',
  'Mustard & Royal Blue',
  'Turquoise & Ivory Zari',
  'Lavender & White Zari',
  'Olive & Coral Pink',
  'Magenta & Deep Teal',
  'Hot Pink & Antique Gold',
  'Bottle Green & Ivory',
  'Periwinkle & Powder Blue',
  'Coral & Aqua Blue',
  'Aqua & Royal Purple',
  'Magenta & Navy Blue',
  'Turquoise & Rani Pink',
  'Leaf Green & Royal Blue',
  'Violet & Wine',
  'Rani Pink & Emerald',
  'Purple & Teal',
  'Baby Pink & Sage Green',
  'Rani Pink & Sky Blue',
  'Teal & Royal Blue',
];

const araniSoftSilkColors = [
  'Lavender Pink & Deep Purple Pallu',
  'Pista Green & Bottle Green Pallu',
  'Seafoam Blue & Deep Teal Pallu',
  'Silver Grey & Navy Pallu',
  'Black & Mustard Yellow Pallu',
  'Mustard Yellow & Olive Green Pallu',
];

const fancySilkColors = [
  'Rose Pink Geometric Motif',
  'Silver Grey Blue Geometry',
  'Mustard Gold Geometric Motif',
  'Ice Grey Royal Blue Geometry',
  'Sage Green Brown Geometry',
  'Lavender Purple Geometry',
  'Olive Green Rani Pink Geometry',
  'Lime Green Teal Geometry',
  'Taupe Rose Geometric Motif',
  'Powder Blue Rani Pink Geometry',
  'Teal Peacock Motif',
  'Mustard Gold Peacock Motif',
  'Sky Blue Navy Peacock Motif',
  'Silver Grey Red Peacock Motif',
  'Mint Green Peacock Motif',
  'Lotus Pink Peacock Motif',
  'Navy Blue Gold Peacock Motif',
  'Lime Green Plum Peacock Motif',
  'Rani Pink Teal Peacock Motif',
  'Deep Plum Green Peacock Motif',
  'Sand Beige Rani Peacock Motif',
  'Lavender Purple Paisley Motif',
  'Leaf Green Purple Peacock Motif',
  'Charcoal Black Gold Peacock Motif',
];

const fancySilkPrintedColors = [
  'Aqua Blue Stripe & Floral Printed Set',
  'Coral Pink Stripe & Floral Printed Set',
  'Soft Peach Shimmer Printed Set',
  'Lavender Shimmer Printed Set',
  'Sage Green Stripe & Floral Printed Set',
  'Powder Blue Stripe & Floral Printed Set',
  'Rose Pink Stripe & Floral Printed Set',
  'Ice Blue Shimmer Printed Set',
  'Pista Green Shimmer Printed Set',
  'Lilac Shimmer Printed Set',
  'Blush Pink Shimmer Printed Set',
  'Mustard Yellow Shimmer Printed Set',
];

const tissuePrintedSoftCottonColors = [
  'Lilac & Deep Plum',
  'Mint Green & Forest Green',
  'Powder Blue & Deep Teal',
  'Silver Grey & Navy Blue',
  'Black & Mustard Gold',
  'Mustard Gold & Olive Green',
];

const sunflowerKhadiColors = [
  'Royal Purple Sunflower',
  'Seafoam Green Sunflower',
  'Deep Violet Sunflower',
  'Lavender Grey Sunflower',
  'Indigo Blue Sunflower',
  'Black Yellow Sunflower',
  'Rani Pink Sunflower',
  'Lime Yellow Sunflower',
  'Dusty Lilac Sunflower',
  'Classic Red Sunflower',
  'Wine Plum Sunflower',
  'Royal Blue Sunflower',
];

const keralaCottonColors = [
  'Ivory & Rose Temple Border',
  'Ivory & Terracotta Border',
  'Ivory & Pink Floral Border',
  'Ivory & Mauve Temple Border',
  'Ivory & Green Festival Border',
  'Ivory & Magenta Paisley',
  'Ivory & Maroon Onam Border',
  'Ivory & Rust Peacock Motif',
  'Ivory & Deep Green Motif',
  'Ivory & Wine Floral Border',
  'Ivory & Gold Kasavu Check',
];

const keralaCheckedCottonColors = [
  'Ivory & Blue Floral Checked Border',
  'Ivory & Purple Floral Checked Border',
  'Ivory & Pink Floral Checked Border',
  'Ivory & Magenta Floral Checked Border',
  'Ivory & Multicolour Floral Checked Border',
  'Temple Printed Ivory Cotton',
  'Yellow Kasavu Printed Cotton',
  'Rust Peacock Printed Cotton',
  'Green Floral Printed Cotton',
  'Wine Floral Printed Cotton',
];

const maheshwariOfferPrice = {
  mrp: 1499,
  sale: 899,
  label: 'Limited offer',
};

const devotionalOfferPrice = {
  mrp: 999,
  sale: 399,
  label: 'Limited offer',
};

const kalyaniOfferPrice = {
  mrp: 1699,
  sale: 999,
  label: 'Limited offer',
};

const korvaiCheckedCottonOfferPrice = {
  mrp: 2499,
  sale: 1049,
  label: 'Limited offer',
};

const palakuOfferPrice = {
  mrp: 2499,
  sale: 1099,
  label: 'Limited offer',
};

const kadhiOfferPrice = {
  mrp: 999,
  sale: 699,
  label: 'Limited offer',
};

const mulmulOfferPrice = {
  mrp: 2199,
  sale: 899,
  label: 'Limited offer',
};

const rainbowMulmulOfferPrice = {
  mrp: 2199,
  sale: 899,
  label: 'Limited offer',
};

const softSilkOfferPrice = {
  mrp: 1499,
  sale: 999,
  label: 'Limited offer',
};

const araniSoftSilkOfferPrice = {
  mrp: 2199,
  sale: 1199,
  label: 'Limited offer',
};

const fancyOfferPrice = {
  mrp: 999,
  sale: 499,
  label: 'Limited offer',
};

const fancySilkPrintedOfferPrice = {
  mrp: 999,
  sale: 599,
  label: 'Limited offer',
};

const tissuePrintedSoftCottonOfferPrice = {
  mrp: 1499,
  sale: 799,
  label: 'Limited offer',
};

const sunflowerKhadiOfferPrice = {
  mrp: 899,
  sale: 549,
  label: 'Limited offer',
};

const keralaCottonOfferPrice = {
  mrp: 1499,
  sale: 699,
  label: 'Onam offer',
};

const pureCottonOfferPrice = {
  mrp: 999,
  sale: 499,
  label: 'Limited offer',
};

const shopProducts = [
  {
    id: 'swami-gold',
    title: 'Swami Kattu Putta Saree',
    category: 'Swami & Amman Temple Sarees',
    length: '6 meters',
    color: 'Turmeric Gold',
    price: devotionalOfferPrice,
    images: ['/images/shop-swami-gold-devotional.jpg', '/images/shop-swami-gold-folded.avif'],
  },
  {
    id: 'amman-pink',
    title: 'Amman Temple Saree',
    category: 'Swami & Amman Temple Sarees',
    length: '6 meters',
    color: 'Kumkum Pink',
    price: devotionalOfferPrice,
    images: ['/images/shop-amman-pink-devotional.jpg', '/images/shop-amman-pink-folded.avif'],
  },
  {
    id: 'amman-green',
    title: 'Amman Temple Saree',
    category: 'Swami & Amman Temple Sarees',
    length: '6 meters',
    color: 'Parrot Green',
    price: devotionalOfferPrice,
    images: ['/images/shop-amman-green-devotional.avif', '/images/shop-amman-green-folded.avif'],
  },
  ...kalyaniColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `kalyani-${item}`,
      title: 'Kalyani Cotton Saree',
      category: 'Kalyani Cotton Sarees',
      length: '6 meters',
      color,
      price: kalyaniOfferPrice,
      images: [`/images/shop-kalyani-${item}-a.avif`, `/images/shop-kalyani-${item}-b.avif`],
    };
  }),
  ...korvaiCheckedCottonColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `korvai-checked-cotton-${item}`,
      title: 'Korvai Checked Cotton Saree',
      category: 'Korvai Checked Cotton Sarees',
      length: '6 meters',
      color,
      price: korvaiCheckedCottonOfferPrice,
      images: [`/images/shop-korvai-checked-cotton-${item}.avif`],
    };
  }),
  ...maheshwariCottonColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `maheshwari-cotton-${item}`,
      title: 'Maheshwari Cotton Saree',
      category: 'Maheshwari Cotton Sarees',
      length: '6 meters',
      color,
      price: maheshwariOfferPrice,
      images: [`/images/shop-maheshwari-cotton-${item}.avif`],
    };
  }),
  ...palakuColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `palaku-${item}`,
      title: 'Palaku Design Saree',
      category: 'Palaku Design Sarees',
      length: '6 meters',
      color,
      price: palakuOfferPrice,
      images: [`/images/shop-palaku-${item}.avif`],
    };
  }),
  ...kadhiColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `kadhi-${item}`,
      title: 'Kadhi Cotton Saree',
      category: 'Kadhi Cotton Sarees',
      length: '6 meters',
      color,
      price: kadhiOfferPrice,
      images: [`/images/shop-kadhi-${item}.avif`],
    };
  }),
  ...mulmulColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `mulmul-${item}`,
      title: '120 Count Mul Mul Cotton Saree',
      category: '120 Count Mul Mul Cotton Sarees',
      length: '6 meters',
      color,
      price: mulmulOfferPrice,
      images: [`/images/shop-mulmul-${item}.avif`],
    };
  }),
  ...rainbowMulmulColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `rainbow-mulmul-${item}`,
      title: 'Rainbow Mul Mul Cotton Saree',
      category: 'Rainbow Mul Mul Cotton Sarees',
      length: '6 meters',
      color,
      price: rainbowMulmulOfferPrice,
      images: [`/images/shop-rainbow-mulmul-${item}.avif`],
    };
  }),
  ...softSilkColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `softsilk-${item}`,
      title: 'Soft Silk Saree',
      category: 'Soft Silk Sarees',
      length: '6 meters',
      color,
      price: softSilkOfferPrice,
      images: [`/images/shop-softsilk-${item}.avif`],
    };
  }),
  ...araniSoftSilkColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `arani-soft-silk-${item}`,
      title: 'Arani Soft Silk Saree',
      category: 'Arani Soft Silk Sarees',
      length: '6 meters',
      color,
      price: araniSoftSilkOfferPrice,
      images: [`/images/shop-arani-soft-silk-${item}.avif`],
    };
  }),
  ...fancySilkColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `fancy-silk-${item}`,
      title: 'Fancy Silk Saree',
      category: 'Fancy Silk Sarees',
      length: '6 meters',
      color,
      price: fancyOfferPrice,
      images: [`/images/shop-fancy-silk-${item}.avif`],
    };
  }),
  ...fancySilkPrintedColors.map((color, index) => {
    const item = String(index + 25).padStart(2, '0');
    return {
      id: `fancy-silk-${item}`,
      title: 'Fancy Silk Saree',
      category: 'Fancy Silk Sarees',
      length: '6 meters',
      color,
      price: fancySilkPrintedOfferPrice,
      images: [`/images/shop-fancy-silk-${item}.avif`],
    };
  }),
  ...tissuePrintedSoftCottonColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `tissue-printed-soft-cotton-${item}`,
      title: 'Tissue Printed Soft Cotton Saree',
      category: 'Tissue Printed Soft Cotton Sarees',
      length: '6 meters',
      color,
      price: tissuePrintedSoftCottonOfferPrice,
      images: [`/images/shop-tissue-printed-soft-cotton-${item}.avif`],
    };
  }),
  ...sunflowerKhadiColors.map((color, index) => {
    const item = String(index + 1).padStart(2, '0');
    return {
      id: `sunflower-khadi-${item}`,
      title: 'Sunflower Khadi Cotton Saree',
      category: 'Sunflower Khadi Cotton Sarees',
      length: '6 meters',
      color,
      price: sunflowerKhadiOfferPrice,
      images: [`/images/shop-sunflower-khadi-${item}.avif`],
    };
  }),
    ...keralaCottonColors.map((color, index) => {
      const item = String(index + 1).padStart(2, '0');
      return {
        id: `kerala-cotton-${item}`,
      title: 'Kerala Cotton Saree',
      category: 'Kerala Cotton Sarees',
      length: '6.25 meters',
      color,
      price: keralaCottonOfferPrice,
      images: [`/images/shop-kerala-cotton-${item}.avif`],
    };
  }),
    ...keralaCheckedCottonColors.map((color, index) => {
      const item = String(index + 1).padStart(2, '0');
      return {
        id: `kerala-checked-${item}`,
        title: 'Kerala Checked Cotton Saree',
        category: 'Kerala Checked Cotton Sarees',
        length: '6.25 meters',
        color,
        price: pureCottonOfferPrice,
        images: [`/images/shop-kerala-checked-${item}.avif`],
      };
    }),
  ];

type ShopProduct = typeof shopProducts[number];

function isOfferPrice(price: ShopProduct['price']): price is typeof maheshwariOfferPrice {
  return typeof price === 'object' && price !== null && 'sale' in price;
}

function formatRupees(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function ProductPrice({ price }: { price: ShopProduct['price'] }) {
  if (isOfferPrice(price)) {
    return <span className="shop-product__offer">
      <small>{price.label}</small>
      <del>MRP {formatRupees(price.mrp)}</del>
      <strong>{formatRupees(price.sale)}</strong>
    </span>;
  }

  return <span>Price on request</span>;
}

function ImageSlider({ product }: { product: ShopProduct }) {
  const [active, setActive] = useState(0);
  const next = () => setActive(index => (index + 1) % product.images.length);
  const prev = () => setActive(index => (index - 1 + product.images.length) % product.images.length);
  const hasMultipleImages = product.images.length > 1;

  return <div className="shop-slider">
    <img src={product.images[active]} alt={`${product.title} ${product.color} view ${active + 1}`} loading="lazy" decoding="async" />
    <div className="shop-slider__veil" />
    {hasMultipleImages && <div className="shop-slider__controls">
      <button onClick={prev} aria-label={`Previous image for ${product.title}`}><ChevronLeft size={17}/></button>
      <span>{active + 1}/{product.images.length}</span>
      <button onClick={next} aria-label={`Next image for ${product.title}`}><ChevronRight size={17}/></button>
    </div>}
    {hasMultipleImages && <div className="shop-slider__dots" aria-hidden="true">
      {product.images.map((_, index) => <i key={index} className={active === index ? 'is-active' : ''}/>)}
    </div>}
  </div>;
}

function ShopPage() {
  const [category, setCategory] = useState<string | null>(null);
  const productSection = useRef<HTMLElement>(null);
  const selectedCategory = category ? shopCategories.find(item => item.name === category) ?? null : null;
  const getCategoryProducts = (categoryName: string) => shopProducts.filter(product => product.category === categoryName);
  const visibleProducts = category ? getCategoryProducts(category) : [];
  const whatsappNumber = `91${customerPhone}`;

  useEffect(() => {
    if (!category) return;
    const timer = window.setTimeout(() => productSection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => window.clearTimeout(timer);
  }, [category]);

  const showAllCollections = () => {
    setCategory(null);
    window.setTimeout(() => document.getElementById('shop-collections')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
  };

  const buildWhatsAppLink = (product: ShopProduct) => {
    const priceText = isOfferPrice(product.price)
      ? ` Offer price ${formatRupees(product.price.sale)}. MRP ${formatRupees(product.price.mrp)}.`
      : '';
    const message = `Hi PK TEX, I want to place an order for ${product.title} - ${product.color} (${product.length}).${priceText}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return <section className="shop-page" id="shop">
    <div className="shop-showcase" data-reveal>
      <img className="shop-showcase__image" src="/images/shop-rainbow-mulmul-02.avif" alt="Rainbow Mul Mul cotton saree from the PK TEX collection" loading="eager" fetchPriority="high" decoding="async" />
      <div className="shop-showcase__veil" aria-hidden="true" />
      <div className="shop-showcase__copy">
        <p className="shop-eyebrow">PK TEX SHOP</p>
        <h2>Saree<br/><em>collections.</em></h2>
        <p>Cotton, silk, temple, and festive sarees from PK TEX, Elampillai.</p>
        <div className="shop-showcase__actions">
          <a href="#shop-collections">View categories <ArrowUpRight size={17}/></a>
          <a href={whatsAppOrderLink} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a>
        </div>
      </div>
      <div className="shop-showcase__marquee" aria-hidden="true">
        <div className="shop-showcase__track">
          {[0, 1].map(copy => <div className="shop-showcase__group" key={copy}>
            {shopCategories.map(item => <React.Fragment key={`${copy}-${item.name}`}><span>{item.name}</span><i/></React.Fragment>)}
          </div>)}
        </div>
      </div>
    </div>

    <section className="shop-collection-index" id="shop-collections" data-reveal>
      <header className="shop-collection-index__head">
        <div>
          <p className="shop-eyebrow">CATEGORIES</p>
          <h2>Shop by category</h2>
        </div>
      </header>

      <div className="shop-collection-grid">
        {shopCategories.map(item => {
          const products = getCategoryProducts(item.name);
          const price = products[0]?.price;
          return <button
            type="button"
            className={category === item.name ? 'shop-collection-card is-active' : 'shop-collection-card'}
            onClick={() => setCategory(item.name)}
            key={item.name}
          >
            <span className="shop-collection-card__media">
              <img src={item.image} alt={`${item.name} collection`} loading="eager" decoding="async" />
              <small>{item.count} styles</small>
            </span>
            <span className="shop-collection-card__body">
              <strong>{item.name}</strong>
              <span className="shop-collection-card__footer">
                {price && isOfferPrice(price) && <span className="shop-collection-card__price">
                  <span><small>MRP</small><del>{formatRupees(price.mrp)}</del></span>
                  <span><small>Offer price</small><b>{formatRupees(price.sale)}</b></span>
                </span>}
                <i aria-hidden="true"><ArrowUpRight size={18}/></i>
              </span>
            </span>
          </button>;
        })}
      </div>
    </section>

    {selectedCategory && <section className="shop-products-view" ref={productSection}>
      <header className="shop-products-view__head">
        <button type="button" onClick={showAllCollections}><ArrowLeft size={17}/> All collections</button>
        <p className="shop-eyebrow">NOW VIEWING</p>
        <h2>{selectedCategory.name}</h2>
        <div>
          <span>{visibleProducts.length} styles available</span>
        </div>
      </header>
      <div className="shop-grid">
        {visibleProducts.map((product) => <article className="shop-product" key={product.id}>
          <ImageSlider product={product}/>
          <div className="shop-product__body">
            <p>{product.category}</p>
            <h3>{product.title}</h3>
            <div className="shop-product__meta">
              <span>{product.length}</span>
              <span>{product.color}</span>
              <ProductPrice price={product.price} />
            </div>
            <a href={buildWhatsAppLink(product)} target="_blank" rel="noreferrer">
              Order on WhatsApp <ArrowUpRight size={15}/>
            </a>
          </div>
        </article>)}
      </div>
    </section>}
  </section>;
}

function ContactSection() {
  return <section className="contact" id="contact">
    <div data-reveal>
      <p className="section-kicker">PK TEX, ELAMPILLAI</p>
      <h2>Contact us<br/><em>for your order.</em></h2>
    </div>
    <div className="contact__card" data-reveal>
      <MapPin size={22}/>
      <p>Kadyampetty, Elampillai<br/>Edaganasalai, Tamil Nadu 637502</p>
      <a href="https://maps.google.com/?q=PK+TEX+Elampillai" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16}/></a>
      <a href={whatsAppOrderLink} target="_blank" rel="noreferrer">Order on WhatsApp <MessageCircle size={16}/></a>
    </div>
    <a className="call" href={`tel:+91${customerPhone}`} data-reveal><small>CALL US</small><span>{customerPhoneDisplay}</span></a>
  </section>;
}

const customerReviews = [
  { name: 'Venkatesh Sivaramakrishnan', text: 'Good quality products with affordable price.', age: 'Edited 3 years ago' },
  { name: 'BOOBALAN A', text: 'Good', age: '9 years ago' },
  { name: 'Thiyagu R', text: '', age: '4 years ago' },
  { name: 'Selva Kumar', text: '', age: '5 years ago' },
  { name: 'Somasundaram O', text: '', age: '7 years ago' },
  { name: 'Bala Kumar', text: '', age: '9 years ago' },
];

function ReviewsPage() {
  return <section className="reviews-page" id="reviews">
    <header className="reviews-page__head">
      <p className="shop-eyebrow">CUSTOMER REVIEWS</p>
      <h1>What customers say</h1>
      <p>Reviews from Google.</p>
    </header>
    <div className="reviews-page__grid">
      {customerReviews.map(review => <article className="review-card" key={review.name}>
        <div className="review-card__top">
          <strong>{review.name}</strong>
          <span>{review.age}</span>
          <span className="review-card__stars" aria-label="5 star rating">★★★★★</span>
        </div>
        {review.text ? <p>“{review.text}”</p> : <p className="review-card__rating">5-star Google review</p>}
      </article>)}
    </div>
  </section>;
}

function App() {
  const [route, setRoute] = useState(window.location.hash || '#home');
  const isShop = route.startsWith('#shop');
  const isReviews = route.startsWith('#reviews');
  useReveal(route);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (route === '#home' || route === '#shop') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
      document.getElementById(route.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [route]);

  return <><Header/><main>{isShop
    ? <ShopPage/>
    : isReviews
      ? <ReviewsPage/>
      : <><Hero/><ExpandingSareeAboutSection/><Collection/><ServiceHighlights/><ContactSection/></>}
  </main><footer><a className="brand" href="#home"><span>PK</span><i/><span>TEX</span></a><p>Elampillai, Tamil Nadu</p><p>© 2026 PK TEX</p></footer></>;
}

createRoot(document.getElementById('root')!).render(<App/>);
