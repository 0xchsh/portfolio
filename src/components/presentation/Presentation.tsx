'use client';

import { usePresentation } from '@/hooks/usePresentation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { MobileSection } from './MobileSection';
import { Footer } from './Footer';
import type { PresentationData } from '@/types/presentation';

interface PresentationProps {
  data: PresentationData;
}

export function Presentation({ data }: PresentationProps) {
  const { theme, toggleTheme } = useTheme();

  const {
    currentProjectIndex,
    currentSectionIndex,
    currentProject,
    currentSection,
    direction,
    goToProject,
    nextProject,
    prevProject,
    goToSection,
    nextSection,
    prevSection,
  } = usePresentation(data);

  useKeyboardNavigation({
    onNextProject: nextProject,
    onPrevProject: prevProject,
    onNextSection: nextSection,
    onPrevSection: prevSection,
    onToggleTheme: toggleTheme,
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden desktop:overflow-hidden">
      {/* Header */}
      <Header
        title={data.meta.title}
        projects={data.projects}
        currentProjectIndex={currentProjectIndex}
        downloadUrl={data.meta.downloadUrl}
        onProjectClick={goToProject}
        onLogoClick={() => goToProject(0)}
        theme={theme}
        onToggleTheme={toggleTheme}
        className="shrink-0 z-40"
      />

      {/* Desktop layout: sidebar positioned left, main content fills remaining height */}
      <div className="hidden desktop:flex flex-1 min-h-0 relative">
        <aside className="absolute left-0 top-16 w-[220px] p-4 pt-2 z-10">
          <Sidebar
            key={currentProjectIndex}
            sections={currentProject?.sections ?? []}
            currentSectionIndex={currentSectionIndex}
            onSectionClick={goToSection}
            direction={direction}
            projectLink={currentProject?.link}
          />
        </aside>
        <main className="flex-1 overflow-y-auto flex justify-center min-h-0">
          <MainContent section={currentSection} />
        </main>
        {/* Fade overlays — using mask so bg-background transitions with theme */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-background pointer-events-none z-10" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-background pointer-events-none z-10" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
      </div>

      {/* Mobile layout: all sections stacked, scrollable */}
      <div className="desktop:hidden flex-1 overflow-y-auto">
        {/* Fade overlay - top */}
        <div className="sticky top-0 left-0 right-0 h-12 bg-background pointer-events-none z-10 -mb-12" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
        {currentProject?.sections.map((section, i) => (
          <div key={section.id}>
            <MobileSection section={section} />
            {i < (currentProject.sections.length - 1) && (
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="w-px h-6 border-l border-dotted border-muted-foreground/30" />
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Footer at bottom of scroll stack on mobile */}
        <Footer className="shrink-0" />
        {/* Fade overlay - bottom */}
        <div className="sticky bottom-0 left-0 right-0 h-12 bg-background pointer-events-none z-10 -mt-12" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
      </div>

      {/* Footer - desktop only (sticky) */}
      <Footer className="shrink-0 hidden desktop:flex" />
    </div>
  );
}
