import React from 'react';
import { useSite } from '../context/SiteContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface WhatWeDoViewProps {
  onNavigate: (path: string) => void;
}

export const WhatWeDoView: React.FC<WhatWeDoViewProps> = ({ onNavigate }) => {
  const { items } = useSite();
  const services = items.filter((x) => x.type === 'service' && x.status !== 'draft');

  return (
    <main id="what-we-do-view">
      <Navigation onNavigate={onNavigate} currentPath="/what-we-do" />

      <header className="listing-hero shell">
        <p className="kicker">Capabilities & solutions</p>
        <h1>WHAT WE DO</h1>
        <p>Built for brands that want to lead culture, not chase it.</p>
      </header>

      <section className="capability-grid shell">
        {services.map((x, i) => (
          <a
            href={`/what-we-do/${x.slug || x.id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/what-we-do/${x.slug || x.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            key={x.id}
          >
            <div className="capability-image">
              {x.imageKey ? (
                <img src={x.imageKey} alt={x.title} />
              ) : (
                <span>0{i + 1}</span>
              )}
            </div>
            <small>{x.subtitle || 'PURE.LK capability'}</small>
            <h2>{x.title}</h2>
            <p>{x.body}</p>
            <div>
              <b>{x.price || x.meta || 'Request a quotation'}</b>
              <span>Explore service ↗</span>
            </div>
          </a>
        ))}
      </section>

      <section className="service-cta">
        <div className="shell">
          <p>Not sure what you need?</p>
          <h2>Let’s shape the right solution together.</h2>
          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
              setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Talk to PURE.LK ↗
          </a>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
