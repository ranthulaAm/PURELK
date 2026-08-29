import { useState, useEffect } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { HomeView } from './components/HomeView';
import { WhatWeDoView } from './components/WhatWeDoView';
import { ServiceDetailView } from './components/ServiceDetailView';
import { BlogView } from './components/BlogView';
import { BlogDetailView } from './components/BlogDetailView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { Tracker } from './components/Tracker';

function Router() {
  const { currentAdmin, loading } = useSite();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--paper, #f3f0e9)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/PUREhead.png" 
            alt="PURE.LK" 
            style={{ 
              height: '80px', 
              width: '80px', 
              objectFit: 'contain',
              marginBottom: '28px',
              animation: 'pulse-slow 2s infinite ease-in-out'
            }} 
          />
          <div style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.24em', 
            fontWeight: 800, 
            color: '#111' 
          }}>
            CREATIVE AGENCY
          </div>
          <div style={{ 
            fontSize: '9px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            marginTop: '8px',
            color: '#777' 
          }}>
            Loading experiences...
          </div>
        </div>
        <style>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.35; transform: scale(0.96); }
            50% { opacity: 1; transform: scale(1.02); }
          }
        `}</style>
      </div>
    );
  }

  // Route matching
  let view = <HomeView onNavigate={navigate} />;

  if (currentPath === '/' || currentPath === '') {
    view = <HomeView onNavigate={navigate} />;
  } else if (currentPath === '/what-we-do') {
    view = <WhatWeDoView onNavigate={navigate} />;
  } else if (currentPath.startsWith('/what-we-do/')) {
    const slug = currentPath.replace('/what-we-do/', '');
    view = <ServiceDetailView slug={slug} onNavigate={navigate} />;
  } else if (currentPath === '/blog') {
    view = <BlogView onNavigate={navigate} />;
  } else if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace('/blog/', '');
    view = <BlogDetailView slug={slug} onNavigate={navigate} />;
  } else if (currentPath.startsWith('/projects/')) {
    const slug = currentPath.replace('/projects/', '');
    view = <ProjectDetailView slug={slug} onNavigate={navigate} />;
  } else if (currentPath === '/admin/login') {
    if (currentAdmin) {
      view = <AdminDashboard onNavigate={navigate} />;
    } else {
      view = <AdminLoginView onNavigate={navigate} />;
    }
  } else if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    if (currentAdmin) {
      view = <AdminDashboard onNavigate={navigate} />;
    } else {
      view = <AdminLoginView onNavigate={navigate} />;
    }
  }

  return (
    <>
      <Tracker currentPath={currentPath} />
      {view}
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Router />
    </SiteProvider>
  );
}
