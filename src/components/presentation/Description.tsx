'use client';

import { cn } from '@/lib/utils';

interface DescriptionProps {
  text: string;
  className?: string;
}

export function Description({ text, className }: DescriptionProps) {
  return (
    <p
      className={cn(
        'text-muted-foreground leading-relaxed text-left max-w-[35rem] whitespace-pre-line',
        className
      )}
    >
      {text}
    </p>
  );
}
