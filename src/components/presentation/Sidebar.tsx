'use client';

import { cn } from '@/lib/utils';
import type { Section } from '@/types/presentation';

interface SidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  className?: string;
}

export function Sidebar({
  sections,
  currentSectionIndex,
  onSectionClick,
  className,
}: SidebarProps) {
  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(index)}
          className={cn(
            'px-2 py-0.75 text-left rounded-md transition-colors w-fit cursor-pointer',
            'hover:bg-accent hover:text-accent-foreground',
            index === currentSectionIndex
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground'
          )}
        >
          {section.title}
        </button>
      ))}
    </nav>
  );
}
