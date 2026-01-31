'use client';

import { cn } from '@/lib/utils';

// Parse inline code (backticks) and render with styling
function parseInlineCode(text: string): React.ReactNode[] {
  const codeRegex = /`([^`]+)`/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    // Add text before the code
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the code element
    parts.push(
      <code
        key={match.index}
        className="text-orange-500 font-mono text-[0.9em] bg-muted px-1.5 py-0.5 rounded"
      >
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

interface DescriptionProps {
  text: string;
  className?: string;
}

export function Description({ text, className }: DescriptionProps) {
  // Split by ## headings to support subtitle sections
  const sections = text.split(/^## /m);

  return (
    <div className={cn('flex flex-col gap-4 text-left max-w-[35rem]', className)}>
      {sections.map((section, i) => {
        if (i === 0) {
          // Text before any heading
          if (!section.trim()) return null;
          return (
            <p key={i} className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
              {parseInlineCode(section.trim())}
            </p>
          );
        }
        // Section with a heading
        const newlineIndex = section.indexOf('\n');
        const title = newlineIndex !== -1 ? section.slice(0, newlineIndex).trim() : section.trim();
        const body = newlineIndex !== -1 ? section.slice(newlineIndex + 1).trim() : '';
        return (
          <div key={i} className="flex flex-col gap-1">
            <h3 className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wider">
              {title}
            </h3>
            {body && (
              <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                {parseInlineCode(body)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
