import React from 'react';
import { useSite } from '../context/SiteContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface BlogDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogDetailView: React.FC<BlogDetailViewProps> = ({ slug, onNavigate }) => {
  const { items } = useSite();

  const post = items.find(
    (x) =>
      x.type === 'blog' &&
      x.status !== 'draft' &&
      (x.slug === slug || x.id === slug)
  );

  if (!post) {
    return (
      <main className="detail-missing">
        <h1>Article not found.</h1>
        <p className="mt-4 text-neutral-500">The insight article you requested is not available.</p>
        <a
          href="/blog"
          className="mt-6 inline-block underline font-bold"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/blog');
          }}
        >
          Back to insights
        </a>
      </main>
    );
  }

  return (
    <main className="detail-page" id={`blog-detail-${post.slug || post.id}`}>
      <Navigation onNavigate={onNavigate} currentPath={`/blog/${slug}`} />

      <header className="article-hero shell">
        <p>{post.subtitle || post.publishedAt || 'Creative Insight'}</p>
        <h1>{post.title}</h1>
        <span>{post.meta}</span>
      </header>

      {post.imageKey && (
        <div className="detail-image shell">
          <img src={post.imageKey} alt={post.title} />
        </div>
      )}

      <article className="article-body">
        <div>{post.body}</div>
      </article>

      <div className="detail-next shell">
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/blog');
          }}
        >
          ← More insights
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
          Talk to us ↗
        </a>
      </div>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
