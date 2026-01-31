'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MockupGrid } from './MockupGrid';
import { Description } from './Description';
import type { Section } from '@/types/presentation';

// Parse markdown-style links [text](url) and render as anchor tags
function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-4 decoration-dashed decoration-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

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
        'w-full max-w-[640px] flex flex-col items-center justify-center min-h-full gap-4 md:gap-6 px-4 md:px-8 pt-8 pb-24 transition-opacity duration-150',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <MockupGrid mockups={displayedSection.mockups} />
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
