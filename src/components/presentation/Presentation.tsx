'use client';

import { usePresentation } from '@/hooks/usePresentation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { Footer } from './Footer';
import type { PresentationData } from '@/types/presentation';

interface PresentationProps {
  data: PresentationData;
}

export function Presentation({ data }: PresentationProps) {
  const { toggleTheme } = useTheme();
  const {
    currentProjectIndex,
    currentSectionIndex,
    currentProject,
    currentSection,
    setProject,
    setSection,
    nextSection,
    prevSection,
    nextProject,
    prevProject,
    navigationDirection,
  } = usePresentation(data);

  useKeyboardNavigation({
    onNextProject: nextProject,
    onPrevProject: prevProject,
    onNextSection: nextSection,
    onPrevSection: prevSection,
    onToggleTheme: toggleTheme,
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        title={data.meta.title}
        projects={data.projects}
        currentProjectIndex={currentProjectIndex}
        downloadUrl={data.meta.downloadUrl}
        onProjectClick={setProject}
      />

      <div className="flex-1 relative min-h-0 border-0">
        {/* Sidebar - positioned over content */}
        <aside className="hidden md:block absolute left-0 top-0 bottom-0 w-48 p-4 pt-24 overflow-y-auto border-0 z-10">
          {currentProject && (
            <Sidebar
              key={currentProjectIndex}
              sections={currentProject.sections}
              currentSectionIndex={currentSectionIndex}
              onSectionClick={setSection}
              direction={navigationDirection}
            />
          )}
        </aside>

        {/* Main content area - full width */}
        <main className="w-full h-full flex flex-col overflow-y-auto">
          <MainContent section={currentSection} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
