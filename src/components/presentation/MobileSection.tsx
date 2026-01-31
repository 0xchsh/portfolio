'use client';

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
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
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

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

interface MobileSectionProps {
  section: Section;
  className?: string;
}

export function MobileSection({ section, className }: MobileSectionProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-5 px-4 py-8',
        className
      )}
    >
      <h2 className="text-muted-foreground text-base font-medium tracking-[-0.02em] max-w-[35rem] w-full">
        {section.title}
      </h2>

      {section.mockups.length > 0 && (
        <MockupGrid mockups={section.mockups} />
      )}

      <div className="flex flex-col gap-4 max-w-[35rem] w-full">
        <Description text={section.description} />
        {section.footnotes && (
          <>
            <div className="border-t border-dotted border-muted-foreground/30" />
            <p className="text-muted-foreground text-sm leading-[22px] whitespace-pre-line">
              {parseLinks(section.footnotes)}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
