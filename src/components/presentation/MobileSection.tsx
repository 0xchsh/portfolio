'use client';

import { cn, parseLinks } from '@/lib/utils';
import { MockupGrid } from './MockupGrid';
import { Description } from './Description';
import type { Section } from '@/types/presentation';

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
