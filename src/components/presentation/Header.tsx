'use client';

import { useState } from 'react';
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
        'flex items-start justify-between px-6 pt-6 pb-3 bg-background',
        className
      )}
    >
      {/* Logo with hover menu */}
      <div className="relative group">
        <img
          src="/images/pfp.gif"
          alt="Logo"
          className="h-[72px] w-[72px] shrink-0 object-cover -scale-x-100 invert dark:invert-0 dark:brightness-150 -mt-2 cursor-pointer transition-[filter] duration-200 ease"
        />
        {/* Hover menu */}
        <div className="absolute left-full top-16 -translate-x-4 -translate-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
          <div className="flex flex-col p-1 bg-secondary rounded-md shadow-lg min-w-[120px]">
            <a
              href="https://ch.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded-md text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors"
            >
              <Globe className="w-4 h-4 opacity-70" />
              ch.sh
            </a>
            <a
              href="https://x.com/chshux"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded-md text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors"
            >
              <Twitter className="w-4 h-4 opacity-70" />
              twitter
            </a>
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-3 py-1 rounded-md text-base leading-6 text-secondary-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 opacity-70" />
              {copied ? 'copied' : 'hi@ch.sh'}
            </button>
          </div>
        </div>
      </div>

      {/* Project tabs */}
      <nav className="hidden md:flex items-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(index)}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors flex items-center gap-2 cursor-pointer text-base leading-6',
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
        ))}
      </nav>

      {/* Mobile project selector */}
      <select
        value={currentProjectIndex}
        onChange={(e) => onProjectClick(Number(e.target.value))}
        className="md:hidden bg-secondary text-secondary-foreground px-2 py-1 rounded-md border-none outline-none"
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
          'flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-base leading-6',
          'text-muted-foreground',
          'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Download className="w-4 h-4 opacity-50" />
        <span className="hidden sm:inline">Download</span>
      </a>
    </header>
  );
}
