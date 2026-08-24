import React from 'react';
import { useSite } from '../context/SiteContext';

interface NavigationProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { settings } = useSite();

  return (
    <nav className="nav shell" id="site-nav">
      <a
        className="logo cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="PURE.LK home"
        href="/"
      >
        <img src="/purelk-wordmark.png" alt="PURE.LK" />
      </a>

      <div className="nav-links">
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
          {settings.navLabel1 || 'Work'}
        </a>
        <a
          href="/what-we-do"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/what-we-do');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {settings.navLabel2 || 'What We Do'}
        </a>
        <a
          href="/#about"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
            setTimeout(() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          {settings.navLabel3 || 'About'}
        </a>
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/blog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {settings.navLabel4 || 'Insights'}
        </a>
      </div>

      <a
        className="nav-cta cursor-pointer"
        href="/#contact"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
          setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      >
        Start a project <span>↗</span>
      </a>
    </nav>
  );
};
