import React from 'react';
import { useSite } from '../context/SiteContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface ServiceDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

const lines = (v: string) =>
  (v || '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ slug, onNavigate }) => {
  const { items } = useSite();

  const service = items.find(
    (x) =>
      x.type === 'service' &&
      x.status !== 'draft' &&
      (x.slug === slug || x.id === slug)
  );

  if (!service) {
    return (
      <main className="detail-missing">
        <h1>Service not found.</h1>
        <p className="mt-4 text-neutral-500">The service capability you are looking for does not exist or has been archived.</p>
        <a
          href="/what-we-do"
          className="mt-6 inline-block underline font-bold"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/what-we-do');
          }}
        >
          View all services
        </a>
      </main>
    );
  }

  const deliverables = lines(service.deliverables);
  const process = lines(service.process);
  const sectors = lines(service.sectors);

  return (
    <main className="service-detail" id={`service-detail-${service.slug || service.id}`}>
      <Navigation onNavigate={onNavigate} currentPath={`/what-we-do/${slug}`} />

      <header className="service-detail-hero shell">
        <p>{service.subtitle || 'What we do'}</p>
        <h1>{service.title}</h1>
        <div>
          <span>{service.price || service.meta || 'Custom quotation'}</span>
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
            Start a project ↗
          </a>
        </div>
      </header>

      {service.imageKey && (
        <div className="detail-image shell">
          <img src={service.imageKey} alt={service.title} />
        </div>
      )}

      <section className="service-intro shell">
        <p className="kicker">Overview</p>
        <p>{service.body}</p>
      </section>

      {deliverables.length > 0 && (
        <section className="service-block shell">
          <div>
            <p className="kicker">What we deliver</p>
            <h2>Everything needed to make the work move.</h2>
          </div>
          <ol>
            {deliverables.map((d, i) => (
              <li key={d}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {d}
              </li>
            ))}
          </ol>
        </section>
      )}

      {process.length > 0 && (
        <section className="process-section">
          <div className="shell">
            <p className="kicker">Our process</p>
            <h2>
              Clear thinking.
              <br />
              Strong execution.
            </h2>
            <div className="process-grid">
              {process.map((p, i) => (
                <article key={p}>
                  <span>0{i + 1}</span>
                  <h3>{p}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectors.length > 0 && (
        <section className="sectors shell">
          <p className="kicker">Built for</p>
          <div>
            {sectors.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>
      )}

      <section className="service-cta">
        <div className="shell">
          <p>Ready to build something people remember?</p>
          <h2>{service.price || service.meta || 'Let’s discuss your project.'}</h2>
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
            Request a quotation ↗
          </a>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
