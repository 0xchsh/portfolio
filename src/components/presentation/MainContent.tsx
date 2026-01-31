'use client';

import { useState, useEffect, useRef } from 'react';
import { cn, parseLinks } from '@/lib/utils';
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
        'w-full max-w-[640px] flex flex-col items-center gap-4 desktop:gap-6 px-4 desktop:px-8 my-auto pt-8 pb-24 transition-opacity duration-150',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <MockupGrid mockups={displayedSection.mockups} />
      {displayedSection.mockups.length === 0 && (
        <h2 className="text-muted-foreground text-sm font-medium tracking-[-0.02em] max-w-[35rem] w-full">
          {displayedSection.title}
        </h2>
      )}
      <div className="flex flex-col gap-4 max-w-[35rem] w-full">
        <Description text={displayedSection.description} />
        {displayedSection.footnotes && (
          <>
            <div className="border-t border-dotted border-muted-foreground/30" />
            <p className="text-muted-foreground text-sm leading-[22px] whitespace-pre-line">
              {parseLinks(displayedSection.footnotes)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
