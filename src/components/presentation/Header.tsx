'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import type { Project } from '@/types/presentation';

interface HeaderProps {
  title: string;
  projects: Project[];
  currentProjectIndex: number;
  downloadUrl: string;
  onProjectClick: (index: number) => void;
  onLogoClick: () => void;
  className?: string;
}

export function Header({
  title,
  projects,
  currentProjectIndex,
  downloadUrl,
  onProjectClick,
  onLogoClick,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 bg-background',
        className
      )}
    >
      {/* Logo */}
      <button onClick={onLogoClick} className="cursor-pointer">
        <img
          src="/images/pfp.gif"
          alt="Logo"
          className="h-12 w-12 sm:h-24 sm:w-24 shrink-0 object-cover -scale-x-100 invert dark:invert-0 dark:brightness-150 -mt-1 sm:-mt-2 transition-[filter] duration-200 ease"
        />
      </button>

      {/* Project tabs */}
      <nav className="hidden sm:flex items-center gap-0.5">
        {projects.map((project, index) => (
          <Squircle
            key={project.id}
            asChild
            cornerRadius={8}
            cornerSmoothing={1}
          >
            <button
              onClick={() => onProjectClick(index)}
              className={cn(
                'px-2.5 py-1 transition-colors flex items-center gap-2 cursor-pointer text-base leading-6',
                'hover:bg-accent hover:text-accent-foreground',
                index === currentProjectIndex
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {project.icon && (
                <span
                  className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: project.icon }}
                />
              )}
              {project.name}
            </button>
          </Squircle>
        ))}
      </nav>

      {/* Mobile project selector */}
      <select
        value={currentProjectIndex}
        onChange={(e) => onProjectClick(Number(e.target.value))}
        className="sm:hidden bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md border-none outline-none text-base"
      >
        {projects.map((project, index) => (
          <option key={project.id} value={index}>
            {project.name}
          </option>
        ))}
      </select>

      {/* Download button */}
      <Squircle
        asChild
        cornerRadius={8}
        cornerSmoothing={1}
      >
        <a
          href={downloadUrl}
          download
          className={cn(
            'flex items-center gap-2 px-2 py-1 transition-colors text-base leading-6',
            'text-muted-foreground',
            'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Download className="w-4 h-4 opacity-50" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </Squircle>
    </header>
  );
}
