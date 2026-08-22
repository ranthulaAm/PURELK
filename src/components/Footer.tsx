import React from 'react';
import { useSite } from '../context/SiteContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSite();

  return (
    <footer className="shell" id="site-footer">
      <a
        className="logo cursor-pointer"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <img src="/purelk-wordmark.png" alt="PURE.LK" />
      </a>
      <p>{settings.footerText || 'Creative agency · Sri Lanka'}</p>
      <div className="socials">
        {settings.instagram && (
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}
        {settings.facebook && (
          <a href={settings.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
        {settings.linkedin && (
          <a href={settings.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {settings.tiktok && (
          <a href={settings.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        )}
        {settings.youtube && (
          <a href={settings.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
        )}
      </div>
      <p>© 2026 PURE.LK</p>
    </footer>
  );
};
