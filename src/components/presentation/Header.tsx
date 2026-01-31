'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import { Download, Sun, Moon } from 'lucide-react';
import type { Project } from '@/types/presentation';

interface HeaderProps {
  title: string;
  projects: Project[];
  currentProjectIndex: number;
  downloadUrl: string;
  onProjectClick: (index: number) => void;
  onLogoClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  className?: string;
}

export function Header({
  title,
  projects,
  currentProjectIndex,
  downloadUrl,
  onProjectClick,
  onLogoClick,
  theme,
  onToggleTheme,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'flex items-start justify-between px-4 desktop:px-6 pt-4 desktop:pt-6 pb-3 bg-background/80 backdrop-blur-xl',
        className
      )}
    >
      {/* Logo */}
      <button onClick={onLogoClick} className="cursor-pointer shrink-0">
        <img
          src="/images/pfp.gif"
          alt="Logo"
          className="h-12 w-12 desktop:h-24 desktop:w-24 shrink-0 object-cover -scale-x-100 invert dark:invert-0 dark:brightness-150 -mt-1 desktop:-mt-2 transition-[filter] duration-200 ease"
        />
      </button>

      {/* Center: Project tabs (desktop) / Project dropdown (mobile) */}
      <div className="flex items-center justify-center flex-1 min-w-0">
        {/* Desktop project tabs */}
        <nav className="hidden desktop:flex items-center gap-0.5">
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
        <Squircle asChild cornerRadius={8} cornerSmoothing={1}>
          <div className="desktop:hidden relative">
            <select
              value={currentProjectIndex}
              onChange={(e) => onProjectClick(Number(e.target.value))}
              className="appearance-none bg-secondary text-secondary-foreground pl-3 pr-7 py-1.5 border-none outline-none text-sm font-medium cursor-pointer"
              style={{ borderRadius: 'inherit' }}
            >
              {projects.map((project, index) => (
                <option key={project.id} value={index}>
                  {project.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </Squircle>
      </div>

      {/* Right: Theme toggle + Download */}
      <div className="flex items-center gap-1 shrink-0">
        <Squircle
          asChild
          cornerRadius={8}
          cornerSmoothing={1}
        >
          <button
            onClick={onToggleTheme}
            className={cn(
              'desktop:hidden flex items-center justify-center p-1.5 transition-colors cursor-pointer text-base leading-6',
              'text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground'
            )}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 opacity-50" />
            ) : (
              <Sun className="w-4 h-4 opacity-50" />
            )}
          </button>
        </Squircle>

        <Squircle
          asChild
          cornerRadius={8}
          cornerSmoothing={1}
        >
          <a
            href={downloadUrl}
            download
            className={cn(
              'flex items-center gap-2 p-1.5 desktop:px-2 desktop:py-1 transition-colors text-base leading-6',
              'text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Download className="w-4 h-4 opacity-50" />
            <span className="hidden desktop:inline">Download</span>
          </a>
        </Squircle>
      </div>
    </header>
  );
}
