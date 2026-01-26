'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MockupGrid } from './MockupGrid';
import { Description } from './Description';
import type { Section } from '@/types/presentation';

interface MainContentProps {
  section: Section | undefined;
  className?: string;
}

export function MainContent({ section, className }: MainContentProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayedSection, setDisplayedSection] = useState(section);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayedSection(section);
      return;
    }

    // Fade out
    setIsVisible(false);

    const timeout = setTimeout(() => {
      setDisplayedSection(section);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, [section]);

  if (!displayedSection) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-8 transition-opacity duration-150',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <MockupGrid mockups={displayedSection.mockups} />
      <Description text={displayedSection.description} />
    </div>
  );
}
