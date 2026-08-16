import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const stats = [
  ['30+', 'Years Experience'],
  ['400+', 'Production Looms'],
  ['10K+', 'Happy Customers'],
  ['3rd', 'Generation Family Business'],
  ['5+', 'Countries Served'],
  ['Worldwide', 'Shipping Available'],
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const fabricY = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  return (
    <section className="about-reveal" id="shop" ref={sectionRef}>
      <motion.div className="about-reveal__fabric" style={{ y: fabricY }} aria-hidden="true" />
      <motion.div
        className="about-reveal__inner"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.22 }}
        transition={{ duration: 1.15, ease }}
      >
        <div className="about-reveal__story">
          <p className="about-reveal__label">ABOUT US <span>02</span></p>
          <h2>PK TEX</h2>
          <p className="about-reveal__lead">PK TEX is a trusted name in Elampillai, Salem with over 30 years of experience in saree manufacturing. As a third-generation textile business, we take pride in producing high-quality sarees using our own 400+ looms.</p>
          <p>From our factory floor to your doorstep—every thread carries our legacy of craftsmanship. We combine traditional weaving techniques with modern designs to create sarees that celebrate India’s rich textile heritage.</p>
          <p className="about-reveal__shipping">Shipping across India and worldwide to 5+ countries.</p>
          <a className="about-reveal__button" href="#contact">Get In Touch <ArrowUpRight size={17}/></a>
        </div>

        <motion.div
          className="about-reveal__stats"
          id="reviews"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.28 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } } }}
        >
          {stats.map(([value, label]) => (
            <motion.article
              className="about-reveal__stat"
              key={label}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
            >
              <strong className={value === 'Worldwide' ? 'about-reveal__worldwide' : ''}>{value}</strong>
              <p>{label}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
