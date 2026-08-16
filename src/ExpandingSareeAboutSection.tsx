import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { target: 24, suffix: '+', label: 'Product Categories' },
  { target: 10, suffix: 'K+', label: 'Happy Customers' },
  { target: 400, suffix: '+', label: 'Production Looms' },
  { target: 30, suffix: '+', label: 'Years Experience' },
  { target: 3, suffix: 'rd', label: 'Generation Family Business' },
  { target: 5, suffix: '+', label: 'Countries Served' },
];

function StatItem({ target, suffix, label, progress, index }: { target: number; suffix: string; label: string; progress: MotionValue<number>; index: number }) {
  const start = .82 + index * .022;
  const end = Math.min(start + .06, .985);
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const y = useTransform(progress, [start, end, 1], [34, 0, 0]);
  const x = useTransform(progress, [start, end, 1], [index % 2 === 0 ? -38 : 38, 0, 0]);
  const [displayValue, setDisplayValue] = useState(0);
  const hasStarted = useRef(false);
  const frame = useRef<number | null>(null);

  useMotionValueEvent(progress, 'change', latest => {
    if (latest < start || hasStarted.current) return;
    hasStarted.current = true;
    const startedAt = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayValue(Math.round(target * eased));
      if (elapsed < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  });

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  return <motion.article className="expanding-about__stat" style={{ opacity, x, y }}>
    <strong>{displayValue}<sup>{suffix}</sup></strong>
    <p>{label}</p>
  </motion.article>;
}

export default function ExpandingSareeAboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 720;
  const swatchWidth = useTransform(scrollYProgress, [0, .4, .72], [220, viewportWidth * .56, viewportWidth]);
  const swatchHeight = useTransform(scrollYProgress, [0, .4, .72], [220, viewportHeight * .58, viewportHeight]);
  const panelOpacity = useTransform(scrollYProgress, [.72, .79, 1], [0, 1, 1]);
  const panelY = useTransform(scrollYProgress, [.72, .79, 1], [28, 0, 0]);
  const panelScale = useTransform(scrollYProgress, [.72, .79, 1], [.975, 1, 1]);
  const labelOpacity = useTransform(scrollYProgress, [.69, .76, 1], [0, 1, 1]);
  const headingOpacity = useTransform(scrollYProgress, [.74, .82, 1], [0, 1, 1]);
  const headingY = useTransform(scrollYProgress, [.74, .82, 1], [42, 0, 0]);
  const headingX = useTransform(scrollYProgress, [.74, .82, 1], [58, 0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [.79, .88, 1], [0, 1, 1]);
  const copyY = useTransform(scrollYProgress, [.79, .88, 1], [34, 0, 0]);
  const copyX = useTransform(scrollYProgress, [.79, .88, 1], [-52, 0, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [.86, .94, 1], [0, 1, 1]);
  const buttonY = useTransform(scrollYProgress, [.86, .94, 1], [24, 0, 0]);
  const buttonX = useTransform(scrollYProgress, [.86, .94, 1], [38, 0, 0]);
  const statsFrameOpacity = useTransform(scrollYProgress, [.81, .86, 1], [0, 1, 1]);
  const bridgeOpacity = useTransform(scrollYProgress, [.88, 1], [0, .46]);

  return <section className="expanding-about" id="about" ref={sectionRef}>
    <div className="expanding-about__sticky">
      <motion.div className="expanding-about__swatch" style={{ width: swatchWidth, height: swatchHeight }} aria-hidden="true" />
      <motion.div className="expanding-about__bridge" style={{ opacity: bridgeOpacity }} aria-hidden="true" />
      <motion.div className="expanding-about__layout" style={{ opacity: panelOpacity, y: panelY, scale: panelScale }}>
        <div className="expanding-about__story">
          <motion.p className="expanding-about__label" style={{ opacity: labelOpacity }}>ABOUT US <span>02</span></motion.p>
          <motion.h2 style={{ opacity: headingOpacity, x: headingX, y: headingY }}>PK TEX</motion.h2>
          <motion.div className="expanding-about__copy" style={{ opacity: copyOpacity, x: copyX, y: copyY }}>
            <p>PK TEX is a saree manufacturer in Elampillai, Salem. We have more than 30 years of experience and over 400 looms.</p>
            <p>We make cotton and silk sarees for customers in India and abroad.</p>
            <p className="expanding-about__shipping">Shipping available across India and worldwide.</p>
          </motion.div>
          <motion.a className="expanding-about__button" href="#contact" style={{ opacity: buttonOpacity, x: buttonX, y: buttonY }}>Contact Us <ArrowUpRight size={17}/></motion.a>
        </div>
        <motion.div className="expanding-about__stats" style={{ opacity: statsFrameOpacity }}>
          {stats.map((item, index) => <StatItem key={item.label} {...item} index={index} progress={scrollYProgress}/>) }
        </motion.div>
      </motion.div>
    </div>
  </section>;
}
