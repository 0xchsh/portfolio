'use client';

import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import type { Project } from '@/types/presentation';

interface HeaderProps {
  title: string;
  projects: Project[];
  currentProjectIndex: number;
  downloadUrl: string;
  onProjectClick: (index: number) => void;
  className?: string;
}

export function Header({
  title,
  projects,
  currentProjectIndex,
  downloadUrl,
  onProjectClick,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 md:px-6 py-3 bg-background',
        className
      )}
    >
      {/* Logo */}
      <div className="text-lg font-semibold tracking-tight">{title}</div>

      {/* Project tabs */}
      <nav className="hidden md:flex items-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(index)}
            className={cn(
              'px-2 py-1 text-sm rounded-md transition-colors flex items-center gap-1',
              'hover:bg-accent hover:text-accent-foreground',
              index === currentProjectIndex
                ? 'bg-secondary text-secondary-foreground font-medium'
                : 'text-muted-foreground'
            )}
          >
            {project.icon && (
              <span
                className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: project.icon }}
              />
            )}
            {project.name}
          </button>
        ))}
      </nav>

      {/* Mobile project selector */}
      <select
        value={currentProjectIndex}
        onChange={(e) => onProjectClick(Number(e.target.value))}
        className="md:hidden bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm border-none outline-none"
      >
        {projects.map((project, index) => (
          <option key={project.id} value={index}>
            {project.name}
          </option>
        ))}
      </select>

      {/* Download button */}
      <a
        href={downloadUrl}
        download
        className={cn(
          'flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors',
          'bg-secondary text-secondary-foreground',
          'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </a>
    </header>
  );
}
