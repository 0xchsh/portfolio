'use client';

import { useState, useEffect } from 'react';
import { Squircle } from '@squircle-js/react';
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
      'inline-flex items-center justify-center w-6 h-6 text-sm font-mono',
      isActive(key) ? 'bg-muted-foreground/15 text-foreground' : 'bg-secondary'
    );

  const Kbd = ({ keyName, children }: { keyName: string; children: React.ReactNode }) => (
    <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
      <kbd className={kbdClass(keyName)}>{children}</kbd>
    </Squircle>
  );

  return (
    <footer
      className={cn(
        'flex items-center justify-between px-4 sm:px-6 py-3 bg-background text-muted-foreground text-sm sm:text-base',
        className
      )}
    >
      {/* Left - Keyboard shortcuts */}
      <div className="hidden sm:flex items-center gap-4 text-base leading-6">
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Kbd keyName="ArrowLeft"><ArrowLeft className="w-3 h-3" /></Kbd>
            <Kbd keyName="ArrowRight"><ArrowRight className="w-3 h-3" /></Kbd>
          </span>
          Projects
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Kbd keyName="ArrowUp"><ArrowUp className="w-3 h-3" /></Kbd>
            <Kbd keyName="ArrowDown"><ArrowDown className="w-3 h-3" /></Kbd>
          </span>
          Sections
        </span>
        <span className="hidden md:inline-flex items-center gap-2">
          <Kbd keyName="t">T</Kbd>
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
          className="underline underline-offset-4 decoration-dotted decoration-muted-foreground/50 hover:text-foreground transition-colors"
        >
          Claude
        </a>
        <span className="text-orange-500">*</span>
      </div>
    </footer>
  );
}
