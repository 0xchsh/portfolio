'use client';

import { useState } from 'react';
import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import { Download, Globe, Twitter, Mail } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      className={cn(
        'flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 bg-background',
        className
      )}
    >
      {/* Logo with hover menu */}
      <div className="relative group">
        <img
          src="/images/pfp.gif"
          alt="Logo"
          className="h-12 w-12 sm:h-[72px] sm:w-[72px] shrink-0 object-cover -scale-x-100 invert dark:invert-0 dark:brightness-150 -mt-1 sm:-mt-2 cursor-pointer transition-[filter] duration-200 ease"
        />
        {/* Hover menu */}
        <div className="absolute left-full top-10 sm:top-16 -translate-x-4 -translate-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
          <Squircle
            cornerRadius={10}
            cornerSmoothing={1}
            className="flex flex-col p-1 bg-secondary shadow-lg min-w-[120px]"
          >
            <Squircle
              asChild
              cornerRadius={6}
              cornerSmoothing={1}
            >
              <a
                href="https://ch.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors"
              >
                <Globe className="w-4 h-4 opacity-70" />
                ch.sh
              </a>
            </Squircle>
            <Squircle
              asChild
              cornerRadius={6}
              cornerSmoothing={1}
            >
              <a
                href="https://x.com/chshux"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors"
              >
                <Twitter className="w-4 h-4 opacity-70" />
                twitter
              </a>
            </Squircle>
            <Squircle
              asChild
              cornerRadius={6}
              cornerSmoothing={1}
            >
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 opacity-70" />
                {copied ? 'copied' : 'hi@ch.sh'}
              </button>
            </Squircle>
          </Squircle>
        </div>
      </div>

      {/* Project tabs */}
      <nav className="hidden sm:flex items-center gap-2">
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
