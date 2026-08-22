import React from 'react';
import { useSite } from '../context/SiteContext';
import { ContactForm } from './ContactForm';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { items, settings } = useSite();

  const customProjects = items.filter((x) => x.type === 'project' && x.status !== 'draft');
  const customServices = items.filter((x) => x.type === 'service' && x.status !== 'draft');
  const customTeam = items.filter((x) => x.type === 'team' && x.status !== 'draft');
  const testimonials = items.filter((x) => x.type === 'testimonial');

  const projects = customProjects.map((x, i) => ({
    id: x.id,
    slug: x.slug || x.id,
    tag: x.subtitle || 'Selected work',
    title: x.title,
    body: x.body,
    meta: x.meta,
    imageKey: x.imageKey,
    cls: ['project-red', 'project-light', 'project-dark'][i % 3],
  }));

  const services = customServices.map((x, i) => ({
    num: String(i + 1).padStart(2, '0'),
    id: x.id,
    slug: x.slug || x.id,
    title: x.title,
    body: x.body,
  }));

  const team = customTeam.map((x) => ({
    initials:
      x.meta ||
      x.title
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    name: x.title,
    role: x.subtitle,
    imageKey: x.imageKey,
  }));

  const testimonial = testimonials[0];

  return (
    <main id="home-main-view">
      <Navigation onNavigate={onNavigate} currentPath="/" />

      {/* Hero Section */}
      <section className="hero shell" id="top">
        <div className="eyebrow">
          <i /> {settings.eyebrow}
        </div>
        <h1>
          {settings.heroLine1}
          <br />
          <em>{settings.heroAccent}</em>
          <br />
          {settings.heroLine3}
        </h1>
        <div className="hero-bottom">
          <p>{settings.heroDescription}</p>
          <a
            className="circle-link cursor-pointer"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Explore our work"
          >
            ↓
          </a>
        </div>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </section>

      {/* Ticker Section */}
      <div className="ticker" aria-hidden="true">
        <div>
          {settings.ticker} {settings.ticker} {settings.ticker} {settings.ticker}
        </div>
      </div>

      {/* Work Showcase Section */}
      <section className="work shell section" id="work">
        <div className="section-head">
          <p>Selected work</p>
          <h2>{settings.workHeading}</h2>
          <span>2026—NOW</span>
        </div>
        <div className="projects">
          {projects.map((p, i) => (
            <a
              href={`/projects/${p.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/projects/${p.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`project ${p.cls} ${p.imageKey ? 'has-image' : ''}`}
              style={
                p.imageKey
                  ? {
                      backgroundImage: `linear-gradient(180deg,transparent,rgba(0,0,0,.78)),url('${p.imageKey}')`,
                    }
                  : undefined
              }
              key={p.id}
            >
              <div className="project-number">0{i + 1}</div>
              <div className="project-copy">
                <p>{p.tag}</p>
                <h3>{p.title}</h3>
                {p.body && <small>{p.body}</small>}
                <span>View project ↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Services Breakdown Section */}
      <section className="services section" id="services">
        <div className="shell">
          <div className="section-head light">
            <p>What we do</p>
            <h2>{settings.servicesHeading}</h2>
            <a
              href="/what-we-do"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/what-we-do');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              VIEW ALL ↗
            </a>
          </div>
          <div className="service-list">
            {services.map((s) => (
              <a
                href={`/what-we-do/${s.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/what-we-do/${s.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                key={s.id}
              >
                <span>{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <b>↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About Point of View Section */}
      <section className="about shell section" id="about">
        <div className="about-mark">
          P<span>U</span>RE
        </div>
        <div className="about-copy">
          <p className="kicker">{settings.aboutKicker}</p>
          <h2>{settings.aboutHeading}</h2>
          <p>{settings.aboutBody}</p>
          <div className="values">
            <span>Creativity</span>
            <span>Quality</span>
            <span>Trust</span>
            <span>Discipline</span>
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="team shell section">
        <div className="section-head">
          <p>Core team</p>
          <h2>{settings.teamHeading}</h2>
          <span>THE PEOPLE</span>
        </div>
        <div className="team-grid">
          {team.map(({ initials, name, role, imageKey }) => (
            <article key={name}>
              <div className={`avatar ${imageKey ? 'has-photo' : ''}`}>
                {imageKey ? <img src={imageKey} alt={name} /> : initials}
              </div>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Quote / Promise Section */}
      <section className="quote">
        <div className="shell">
          <p>
            {testimonial?.body || 'Bold ideas. Thoughtful execution. Work built to be remembered.'}
          </p>
          <span>
            — {testimonial?.title || 'The PURE.LK promise'}
            {testimonial?.subtitle ? `, ${testimonial.subtitle}` : ''}
          </span>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact shell section" id="contact">
        <div>
          <p className="kicker">{settings.contactKicker}</p>
          <h2>
            {settings.contactLine1}
            <br />
            <em>{settings.contactAccent}</em>
            <br />
            {settings.contactLine3}
          </h2>
          <div className="contact-actions">
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hi%20PURE.LK%2C%20I%27d%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noreferrer"
                id="whatsapp-cta-link"
              >
                WhatsApp us <b>↗</b>
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} id="email-cta-link">
                {settings.email} <b>↗</b>
              </a>
            )}
          </div>
        </div>
        <ContactForm />
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
