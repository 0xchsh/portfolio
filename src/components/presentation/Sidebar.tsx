'use client';

import { cn } from '@/lib/utils';
import type { Section } from '@/types/presentation';

type NavigationDirection = 'left' | 'right' | null;

interface SidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  direction?: NavigationDirection;
  className?: string;
}

export function Sidebar({
  sections,
  currentSectionIndex,
  onSectionClick,
  direction,
  className,
}: SidebarProps) {
  return (
    <nav
      className={cn(
        'flex flex-col gap-1',
        direction === 'right' && 'animate-slide-in-from-right',
        direction === 'left' && 'animate-slide-in-from-left',
        className
      )}
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(index)}
          className={cn(
            'px-2 py-1 text-left rounded-md transition-colors w-fit cursor-pointer text-base leading-6',
            'hover:bg-accent hover:text-accent-foreground',
            index === currentSectionIndex
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          {section.title}
        </button>
      ))}
    </nav>
  );
}
