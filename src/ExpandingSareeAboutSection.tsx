import { ArrowUpRight } from 'lucide-react';

const stats = [
  { value: '24', suffix: '+', label: 'Product Categories' },
  { value: '10', suffix: 'K+', label: 'Happy Customers' },
  { value: '400', suffix: '+', label: 'Production Looms' },
  { value: '30', suffix: '+', label: 'Years Experience' },
  { value: '3', suffix: 'rd', label: 'Generation Family Business' },
  { value: '5', suffix: '+', label: 'Countries Served' },
];

export default function ExpandingSareeAboutSection() {
  return <section className="expanding-about" id="about" data-reveal>
    <div className="expanding-about__sticky">
      <div className="expanding-about__swatch" aria-hidden="true" />
      <div className="expanding-about__layout">
        <div className="expanding-about__story">
          <p className="expanding-about__label">ABOUT PK TEX <span>02</span></p>
          <h2>PK TEX</h2>
          <div className="expanding-about__copy">
            <p>PK TEX is a saree manufacturer in Elampillai, Salem with more than 30 years of experience and over 400 looms.</p>
            <p>We make cotton and silk sarees for customers across India and abroad.</p>
            <p className="expanding-about__shipping">Doorstep delivery, worldwide shipping, video-proof returns, and WhatsApp ordering are available.</p>
          </div>
          <a className="expanding-about__button" href="#contact">Contact Us <ArrowUpRight size={17}/></a>
        </div>
        <div className="expanding-about__stats">
          {stats.map(item => <article className="expanding-about__stat" key={item.label}>
            <strong>{item.value}<sup>{item.suffix}</sup></strong>
            <p>{item.label}</p>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
