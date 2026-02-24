'use client';

import { Squircle } from '@squircle-js/react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/presentation';

type NavigationDirection = 'left' | 'right' | null;

interface ProjectNavProps {
  projects: Project[];
  currentProjectIndex: number;
  currentSectionIndex: number;
  onProjectClick: (index: number) => void;
  onSectionClick: (index: number) => void;
  direction?: NavigationDirection;
}

export function ProjectNav({
  projects,
  currentProjectIndex,
  currentSectionIndex,
  onProjectClick,
  onSectionClick,
  direction,
}: ProjectNavProps) {
  return (
    <nav
      className={cn(
        'flex flex-col gap-1',
        direction === 'right' && 'animate-slide-in-from-right',
        direction === 'left' && 'animate-slide-in-from-left',
      )}
    >
      {projects.map((project, projectIndex) => {
        const isActive = projectIndex === currentProjectIndex;

        return (
          <div key={project.id}>
            {/* Project name */}
            <Squircle asChild cornerRadius={8} cornerSmoothing={1}>
              <button
                onClick={() => onProjectClick(projectIndex)}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 text-left transition-colors cursor-pointer text-base leading-6 w-full',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {project.icon && (
                  <span
                    className="w-4 h-4 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: project.icon }}
                  />
                )}
                {project.name}
              </button>
            </Squircle>

            {/* Expanded sections for active project */}
            {isActive && (
              <div className="ml-4 pl-2.5 border-l border-dotted border-muted-foreground/30 flex flex-col gap-0 mt-1.5 mb-2">
                {project.sections.map((section, sectionIndex) => (
                  <Squircle
                    key={section.id}
                    asChild
                    cornerRadius={6}
                    cornerSmoothing={1}
                  >
                    <button
                      onClick={() => onSectionClick(sectionIndex)}
                      className={cn(
                        'px-2 py-0.5 text-left transition-colors w-fit cursor-pointer text-sm leading-7 whitespace-nowrap',
                        'hover:bg-accent hover:text-accent-foreground rounded-md',
                        sectionIndex === currentSectionIndex
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {section.title}
                    </button>
                  </Squircle>
                ))}

                {/* Project link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-0.5 text-muted-foreground text-sm leading-7 mt-1 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span>{project.link.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
