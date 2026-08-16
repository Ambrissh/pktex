import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const stats = [
  ['30+', 'Years Experience'], ['400+', 'Production Looms'], ['10K+', 'Happy Customers'],
  ['3rd', 'Generation Family Business'], ['5+', 'Countries Served'], ['Worldwide', 'Shipping Available'],
];

function StatItem({ value, label, progress, index }: { value: string; label: string; progress: MotionValue<number>; index: number }) {
  const start = .82 + index * .022;
  const end = Math.min(start + .06, .985);
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const y = useTransform(progress, [start, end, 1], [34, 0, 0]);
  return <motion.article className="expanding-about__stat" style={{ opacity, y }}>
    <strong className={value === 'Worldwide' ? 'expanding-about__worldwide' : ''}>{value}</strong>
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
  const labelOpacity = useTransform(scrollYProgress, [.69, .76, 1], [0, 1, 1]);
  const headingOpacity = useTransform(scrollYProgress, [.74, .82, 1], [0, 1, 1]);
  const headingY = useTransform(scrollYProgress, [.74, .82, 1], [42, 0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [.79, .88, 1], [0, 1, 1]);
  const copyY = useTransform(scrollYProgress, [.79, .88, 1], [34, 0, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [.86, .94, 1], [0, 1, 1]);
  const buttonY = useTransform(scrollYProgress, [.86, .94, 1], [24, 0, 0]);
  const statsFrameOpacity = useTransform(scrollYProgress, [.81, .86, 1], [0, 1, 1]);
  const bridgeOpacity = useTransform(scrollYProgress, [.88, 1], [0, .46]);

  return <section className="expanding-about" id="shop" ref={sectionRef}>
    <div className="expanding-about__sticky">
      <motion.div className="expanding-about__swatch" style={{ width: swatchWidth, height: swatchHeight }} aria-hidden="true" />
      <motion.div className="expanding-about__bridge" style={{ opacity: bridgeOpacity }} aria-hidden="true" />
      <div className="expanding-about__layout">
        <div className="expanding-about__story">
          <motion.p className="expanding-about__label" style={{ opacity: labelOpacity }}>ABOUT US <span>02</span></motion.p>
          <motion.h2 style={{ opacity: headingOpacity, y: headingY }}>PK TEX</motion.h2>
          <motion.div className="expanding-about__copy" style={{ opacity: copyOpacity, y: copyY }}>
            <p>PK TEX is a trusted name in Elampillai, Salem with over 30 years of experience in saree manufacturing. As a third-generation textile business, we take pride in producing high-quality sarees using our own 400+ looms.</p>
            <p>From our factory floor to your doorstep—every thread carries our legacy of craftsmanship. We combine traditional weaving techniques with modern designs to create sarees that celebrate India’s rich textile heritage.</p>
            <p className="expanding-about__shipping">Shipping across India and worldwide to 5+ countries.</p>
          </motion.div>
          <motion.a className="expanding-about__button" href="#contact" style={{ opacity: buttonOpacity, y: buttonY }}>Get In Touch <ArrowUpRight size={17}/></motion.a>
        </div>
        <motion.div className="expanding-about__stats" id="reviews" style={{ opacity: statsFrameOpacity }}>
          {stats.map(([value, label], index) => <StatItem key={label} value={value} label={label} index={index} progress={scrollYProgress}/>) }
        </motion.div>
      </div>
    </div>
  </section>;
}
