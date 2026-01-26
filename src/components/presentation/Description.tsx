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
        className="text-orange-500 font-mono text-[0.9em]"
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
  return (
    <p
      className={cn(
        'text-foreground text-sm sm:text-base leading-relaxed text-left max-w-[35rem] whitespace-pre-line',
        className
      )}
    >
      {parseInlineCode(text)}
    </p>
  );
}
