import React from 'react';
import { useSite } from '../context/SiteContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface BlogViewProps {
  onNavigate: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onNavigate }) => {
  const { items, settings } = useSite();
  const posts = items.filter((x) => x.type === 'blog' && x.status !== 'draft');

  return (
    <main id="blog-listing-view">
      <Navigation onNavigate={onNavigate} currentPath="/blog" />

      <header className="listing-hero shell">
        <p className="kicker">Ideas, culture & creativity</p>
        <h1>{settings.blogHeading || 'PURE INSIGHTS'}</h1>
        <p>{settings.blogDescription || 'Thinking for brands that want to move forward.'}</p>
      </header>

      <section className="blog-grid shell">
        {posts.length > 0 ? (
          posts.map((p) => (
            <a
              href={`/blog/${p.slug || p.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/blog/${p.slug || p.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              key={p.id}
            >
              <div className="blog-image">
                {p.imageKey ? (
                  <img src={p.imageKey} alt={p.title} />
                ) : (
                  <span>PURE.LK</span>
                )}
              </div>
              <small>{p.subtitle || p.publishedAt || 'Creative Thought'}</small>
              <h2>{p.title}</h2>
              <p>{p.seoDescription || p.body.slice(0, 150) + '...'}</p>
              <b>Read article ↗</b>
            </a>
          ))
        ) : (
          <div className="empty-blog">New ideas are on the way.</div>
        )}
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
