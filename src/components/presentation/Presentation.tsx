'use client';

import { usePresentation } from '@/hooks/usePresentation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ProjectNav } from './ProjectNav';
import { MainContent } from './MainContent';
import { MobileSection } from './MobileSection';
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
    direction,
    goToProject,
    goToSection,
    nextProject,
    prevProject,
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
    <div className="flex-1 flex flex-col min-h-0 pt-14">
      {/* Desktop layout */}
      <div className="hidden desktop:flex flex-1 min-h-0 relative">
        <aside className="absolute left-0 top-4 w-[220px] p-4 pt-0 z-10">
          <ProjectNav
            key={currentProjectIndex}
            projects={data.projects}
            currentProjectIndex={currentProjectIndex}
            currentSectionIndex={currentSectionIndex}
            onProjectClick={goToProject}
            onSectionClick={goToSection}
            direction={direction}
          />
        </aside>
        <main className="flex-1 overflow-y-auto flex justify-center min-h-0">
          <MainContent section={currentSection} />
        </main>
        <div className="absolute top-0 left-0 right-0 h-12 bg-background pointer-events-none z-10" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-background pointer-events-none z-10" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
      </div>

      {/* Mobile layout */}
      <div className="desktop:hidden flex-1 overflow-y-auto">
        <div className="sticky top-0 left-0 right-0 h-12 bg-background pointer-events-none z-10 -mb-12" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
        {/* Mobile project selector */}
        <div className="px-4 pt-4 pb-2">
          <select
            value={currentProjectIndex}
            onChange={(e) => goToProject(Number(e.target.value))}
            className="appearance-none bg-neutral-100 text-sm font-semibold px-3 py-1.5 rounded-md w-full"
          >
            {data.projects.map((project, index) => (
              <option key={project.id} value={index}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
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
        <div className="sticky bottom-0 left-0 right-0 h-12 bg-background pointer-events-none z-10 -mt-12" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
      </div>
    </div>
  );
}
