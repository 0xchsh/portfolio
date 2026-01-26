'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys((prev) => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isActive = (key: string) => activeKeys.has(key);

  const kbdClass = (key: string) =>
    cn(
      'inline-flex items-center justify-center w-6 h-6 rounded font-medium text-sm font-mono',
      isActive(key) ? 'bg-muted-foreground/30 text-foreground' : 'bg-secondary'
    );

  return (
    <footer
      className={cn(
        'flex items-center justify-between px-4 md:px-6 py-3 bg-background text-muted-foreground',
        className
      )}
    >
      {/* Left - Keyboard shortcuts */}
      <div className="hidden sm:flex items-center gap-4">
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <kbd className={kbdClass('ArrowLeft')}><ArrowLeft className="w-3 h-3" /></kbd>
            <kbd className={kbdClass('ArrowRight')}><ArrowRight className="w-3 h-3" /></kbd>
          </span>
          Projects
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <kbd className={kbdClass('ArrowUp')}><ArrowUp className="w-3 h-3" /></kbd>
            <kbd className={kbdClass('ArrowDown')}><ArrowDown className="w-3 h-3" /></kbd>
          </span>
          Sections
        </span>
        <span className="hidden md:inline-flex items-center gap-2">
          <kbd className={kbdClass('t')}>T</kbd>
          Theme
        </span>
      </div>

      {/* Right - ch.sh • Built with Claude */}
      <div>
        Built with{' '}
        <a
          href="https://github.com/0xchsh/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 decoration-dotted decoration-muted-foreground/50 hover:text-foreground transition-colors"
        >
          Claude
        </a>
        <span className="text-orange-500">*</span>
      </div>
    </footer>
  );
}
