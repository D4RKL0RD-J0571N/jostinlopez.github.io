import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectEditor from './components/CMSProjectEditor';
import { applyTheme } from './utils/applyTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ContentProvider, useContent } from './context/ContentContext';

// Lazy Load Sections
const About = React.lazy(() => import('./components/About'));
const Projects = React.lazy(() => import('./components/Projects'));
const Timeline = React.lazy(() => import('./components/Timeline'));
const Gallery = React.lazy(() => import('./components/Gallery'));
const Contact = React.lazy(() => import('./components/Contact'));

// Loading Skeleton
const SectionSkeleton = () => (
  <div className="py-20 container mx-auto px-6">
    <div className="h-8 w-48 bg-bg-elevated rounded mb-8 animate-pulse" />
    <div className="space-y-4">
      <div className="h-4 w-full bg-bg-elevated rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-bg-elevated rounded animate-pulse" />
    </div>
  </div>
);

const LegalModal = () => {
  const { legalModal, closeLegalModal } = useContent();

  return (
    <AnimatePresence>
      {legalModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLegalModal}
            className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-surface border border-bg-elevated rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[80vh]"
          >
            <button onClick={closeLegalModal} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-accent">{legalModal.title}</h2>
            <div className="prose prose-invert prose-slate max-w-none text-text-secondary">
              {legalModal.content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function AppContent() {
  const { t } = useTranslation();
  const { sectionOrder, openLegalModal } = useContent();
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    applyTheme();

    const handleKeyDown = (e) => {
      // Only allow CMS in development or localhost
      const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
      if (isDev && e.ctrlKey && e.shiftKey && e.key === 'E') {
        setShowEditor(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const sections = {
    hero: <Hero key="hero" />,
    about: <React.Suspense fallback={<SectionSkeleton />}><About key="about" /></React.Suspense>,
    projects: <React.Suspense fallback={<SectionSkeleton />}><Projects key="projects" /></React.Suspense>,
    timeline: <React.Suspense fallback={<SectionSkeleton />}><Timeline key="timeline" /></React.Suspense>,
    gallery: <React.Suspense fallback={<SectionSkeleton />}><Gallery key="gallery" /></React.Suspense>,
    contact: <React.Suspense fallback={<SectionSkeleton />}><Contact key="contact" /></React.Suspense>
  };

  return (
    <div className="bg-bg-base min-h-screen text-text-primary selection:bg-accent/30 selection:text-accent font-sans">
      <ScrollProgress />

      {showEditor ? (
        <ProjectEditor onClose={() => setShowEditor(false)} />
      ) : (
        <>
          <Navbar />
          <main>
            {sectionOrder.map(sectionId => sections[sectionId] || null)}
          </main>
          <footer className="py-12 bg-bg-base border-t border-bg-elevated flex flex-col items-center justify-center gap-6 text-text-secondary text-sm">
            <div className="flex gap-8">
              <button
                onClick={() => openLegalModal(t('nav.privacy'), t('legal.privacy'))}
                className="hover:text-accent transition-colors"
                role="button"
                tabIndex={0}
              >
                {t('nav.privacy')}
              </button>
              <button
                onClick={() => openLegalModal(t('nav.terms'), t('legal.terms'))}
                className="hover:text-accent transition-colors"
                role="button"
                tabIndex={0}
              >
                {t('nav.terms')}
              </button>
            </div>
            <p>&copy; {new Date().getFullYear()} {t('footer.text')}</p>
          </footer>
        </>
      )}

      <LegalModal />

      <div className="hidden">Admin shortcuts enabled: Ctrl+Shift+E</div>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
