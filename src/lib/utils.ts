import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type React from 'react';
import { createElement } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse markdown-style links [text](url) and render as anchor tags
export function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      createElement(
        'a',
        {
          key: match.index,
          href: match[2],
          target: '_blank',
          rel: 'noopener noreferrer',
          className:
            'text-foreground underline underline-offset-4 decoration-dashed decoration-muted-foreground/50 hover:text-muted-foreground transition-colors',
        },
        match[1]
      )
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
