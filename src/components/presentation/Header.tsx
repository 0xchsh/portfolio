'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';
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
        'flex items-start justify-between px-4 desktop:px-6 pt-4 desktop:pt-6 pb-3 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      {/* Logo */}
      <button onClick={onLogoClick} className="cursor-pointer shrink-0">
        <video
          src="/images/pfp.webm?v=2"
          autoPlay
          loop
          muted
          playsInline
          className="h-12 w-12 desktop:h-24 desktop:w-24 shrink-0 object-cover -scale-x-100 invert -mt-1 desktop:-mt-2"
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
              className="appearance-none bg-secondary text-secondary-foreground pl-3 pr-7 py-1.5 border-none outline-none text-sm cursor-pointer"
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

      {/* Right: Download */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile: direct PDF download */}
        <Squircle
          asChild
          cornerRadius={8}
          cornerSmoothing={1}
        >
          <a
            href={downloadUrl}
            download
            className={cn(
              'desktop:hidden flex items-center gap-2 p-1.5 transition-colors text-base leading-6',
              'text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Download className="w-4 h-4 opacity-50" />
          </a>
        </Squircle>

        {/* Desktop: dropdown with Figma + PDF */}
        <div className="relative group hidden desktop:block">
          <Squircle
            asChild
            cornerRadius={8}
            cornerSmoothing={1}
          >
            <button
              className={cn(
                'flex items-center gap-2 px-2 py-1 transition-colors text-base leading-6 cursor-pointer',
                'text-muted-foreground',
                'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Download className="w-4 h-4 opacity-50" />
              Download
            </button>
          </Squircle>
          <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex flex-col p-1 bg-secondary shadow-lg w-[168px]"
            >
              <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
                <a
                  href="https://www.figma.com/proto/wKXOpYmEzyw4cEgsfCLsiP/Anthropic-Design-Review?page-id=171%3A51631&node-id=228-57261&viewport=969%2C650%2C0.04&t=7xzGjRdd04V0KXWd-1&scaling=contain&content-scaling=fixed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-muted-foreground/15 transition-colors"
                >
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5ZM5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12Zm0 6.5A3.5 3.5 0 0 1 8.5 15H12v3.5a3.5 3.5 0 1 1-7 0ZM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Zm0 7h3.5a3.5 3.5 0 1 1 0 7H12V9Z"/></svg>
                  Figma link
                </a>
              </Squircle>
              <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-muted-foreground/15 transition-colors"
                >
                  <FileText className="w-4 h-4 opacity-70" />
                  PDF download
                </a>
              </Squircle>
            </Squircle>
          </div>
        </div>
      </div>
    </header>
  );
}
