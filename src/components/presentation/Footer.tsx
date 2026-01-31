'use client';

import { useState, useEffect } from 'react';
import { Squircle } from '@squircle-js/react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        'md:sticky md:bottom-0 z-30 flex items-center justify-start md:justify-between px-4 md:px-8 pt-8 pb-8 bg-background text-muted-foreground text-sm md:text-base',
        className
      )}
    >
      {/* Left - Keyboard shortcuts */}
      <div className="hidden md:flex items-center gap-4 text-base leading-6">
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

      {/* Right - Built by Charles with Claude */}
      <div className="flex items-center gap-1">
        Built by{' '}
        <div className="relative group inline-block">
          <span className="text-foreground border-b border-dotted border-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer">
            Charles
          </span>
          {/* Hover menu */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex flex-col p-1 bg-secondary shadow-lg min-w-[120px]"
            >
              <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
                <a
                  href="https://ch.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-muted-foreground/15 transition-colors"
                >
                  <Globe className="w-4 h-4 opacity-70" />
                  ch.sh
                </a>
              </Squircle>
              <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
                <a
                  href="https://x.com/chshux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-muted-foreground/15 transition-colors"
                >
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  chshux
                </a>
              </Squircle>
              <Squircle asChild cornerRadius={6} cornerSmoothing={1}>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 px-3 py-1 text-base leading-6 text-secondary-foreground hover:bg-muted-foreground/15 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 opacity-70" />
                  <span className="w-[58px] text-left">{copied ? 'copied' : 'hi@ch.sh'}</span>
                </button>
              </Squircle>
            </Squircle>
          </div>
        </div>

with <a href="https://github.com/0xchsh/portfolio" target="_blank" rel="noopener noreferrer" className="text-foreground border-b border-dotted border-muted-foreground/50 hover:text-muted-foreground transition-colors">Claude</a><span className="text-orange-500 -ml-0.5">*</span>
      </div>
    </footer>
  );
}
