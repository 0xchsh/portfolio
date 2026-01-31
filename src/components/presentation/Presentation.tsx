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
    <div className="h-screen flex flex-col overflow-hidden sm:overflow-hidden">
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
      <div className="hidden sm:flex flex-1 min-h-0 relative">
        <aside className="absolute left-0 top-0 w-[220px] p-4 pt-2 z-10">
          <Sidebar
            key={currentProjectIndex}
            sections={currentProject?.sections ?? []}
            currentSectionIndex={currentSectionIndex}
            onSectionClick={goToSection}
            direction={direction}
            projectLink={currentProject?.link}
          />
        </aside>
        <main className="flex-1 flex items-center justify-center min-h-0">
          <MainContent section={currentSection} />
        </main>
      </div>

      {/* Mobile layout: all sections stacked, scrollable */}
      <div className="sm:hidden flex-1 overflow-y-auto">
        {currentProject?.sections.map((section) => (
          <MobileSection key={section.id} section={section} />
        ))}
        {/* Footer at bottom of scroll stack on mobile */}
        <Footer className="shrink-0" />
      </div>

      {/* Footer - desktop only (sticky) */}
      <Footer className="shrink-0 hidden sm:flex" />
    </div>
  );
}
