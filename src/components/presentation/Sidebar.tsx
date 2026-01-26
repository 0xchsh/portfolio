'use client';

import { Squircle } from '@squircle-js/react';
import { List, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Section } from '@/types/presentation';

type NavigationDirection = 'left' | 'right' | null;

interface SidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  direction?: NavigationDirection;
  projectLink?: string;
  className?: string;
}

export function Sidebar({
  sections,
  currentSectionIndex,
  onSectionClick,
  direction,
  projectLink,
  className,
}: SidebarProps) {
  return (
    <nav
      className={cn(
        'flex flex-col',
        direction === 'right' && 'animate-slide-in-from-right',
        direction === 'left' && 'animate-slide-in-from-left',
        className
      )}
    >
      {/* Content header */}
      <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground text-base leading-6">
        <List className="w-4 h-4" />
        <span>Content</span>
      </div>

      {/* Section links */}
      <div className="ml-[15px] pl-[9px] border-l border-dotted border-muted-foreground/30 flex flex-col gap-0.5 mt-2">
        {sections.map((section, index) => (
          <Squircle
            key={section.id}
            asChild
            cornerRadius={8}
            cornerSmoothing={1}
          >
            <button
              onClick={() => onSectionClick(index)}
              className={cn(
                'px-2 py-1 text-left transition-colors w-fit cursor-pointer text-base leading-6 whitespace-nowrap',
                'hover:bg-accent hover:text-accent-foreground',
                index === currentSectionIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {section.title}
            </button>
          </Squircle>
        ))}
      </div>

      {/* Project link */}
      {projectLink && (
        <a
          href={projectLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(projectLink, '_blank', 'noopener,noreferrer');
          }}
          className="flex items-center gap-2 px-2 py-1 text-muted-foreground text-base leading-6 mt-2 hover:text-foreground transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span>{projectLink.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
    </nav>
  );
}
