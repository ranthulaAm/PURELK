import React from 'react';
import { useSite } from '../context/SiteContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface ProjectDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ slug, onNavigate }) => {
  const { items } = useSite();

  const project = items.find(
    (x) =>
      x.type === 'project' &&
      x.status !== 'draft' &&
      (x.slug === slug || x.id === slug)
  );

  if (!project) {
    return (
      <main className="detail-missing">
        <h1>Project not found.</h1>
        <p className="mt-4 text-neutral-500">The selected work you are looking for is not listed.</p>
        <a
          href="/"
          className="mt-6 inline-block underline font-bold"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          Back home
        </a>
      </main>
    );
  }

  const deliverables = (project.deliverables || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const process = (project.process || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const sectors = (project.sectors || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main className="detail-page" id={`project-detail-${project.slug || project.id}`}>
      <Navigation onNavigate={onNavigate} currentPath={`/projects/${slug}`} />

      <header className="detail-hero shell">
        <p>{project.subtitle || 'Selected project'}</p>
        <h1>{project.title}</h1>
      </header>

      {project.imageKey && (
        <div className="detail-image shell">
          <img src={project.imageKey} alt={project.title} referrerPolicy="no-referrer" />
        </div>
      )}

      <section className="detail-body shell">
        <p className="kicker">The project</p>
        <div>
          <h2>{project.meta || 'Creative work designed to move people.'}</h2>
          <p>{project.body}</p>
        </div>
      </section>

      {deliverables.length > 0 && (
        <section className="service-block shell">
          <div>
            <p className="kicker">Deliverables</p>
            <h2>Strategic craft & execution.</h2>
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
            <p className="kicker">Execution Journey</p>
            <h2>From insight to cultural impact.</h2>
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
          <p className="kicker">Industries</p>
          <div>
            {sectors.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>
      )}

      <div className="detail-next shell">
        <a
          href="/#work"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
            setTimeout(() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          ← Back to all work
        </a>
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
          Work with us ↗
        </a>
      </div>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
