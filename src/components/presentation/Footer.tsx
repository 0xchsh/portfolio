'use client';

import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between px-4 md:px-6 py-3 bg-background text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center gap-1">
          <kbd className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-secondary rounded text-[10px] font-medium">←</kbd>
          <kbd className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-secondary rounded text-[10px] font-medium">→</kbd>
          projects
        </span>
        <span className="hidden sm:inline-flex items-center gap-1">
          <kbd className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-secondary rounded text-[10px] font-medium">↑</kbd>
          <kbd className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-secondary rounded text-[10px] font-medium">↓</kbd>
          sections
        </span>
        <span className="hidden md:inline-flex items-center gap-1">
          <kbd className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-secondary rounded text-[10px] font-medium">T</kbd>
          theme
        </span>
      </div>
      <div>
        Built with{' '}
        <a
          href="https://github.com/0xchsh/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Claude
        </a>
        <span className="text-orange-500">*</span>
      </div>
    </footer>
  );
}
