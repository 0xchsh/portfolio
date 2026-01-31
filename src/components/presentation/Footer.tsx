'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Squircle } from '@squircle-js/react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

function PixelAlien({ size, className, style }: { size: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 150 125"
      fill="currentColor"
      width={size}
      height={size * (125 / 150)}
      className={className}
      style={style}
    >
      <rect x="75" width="25" height="25" />
      <rect x="50" width="25" height="25" />
      <rect x="25" width="25" height="25" />
      <rect x="100" width="25" height="25" />
      <rect x="125" width="25" height="25" />
      <rect x="25" y="25" width="25" height="25" />
      <rect x="50" y="25" width="25" height="25" />
      <rect x="100" y="25" width="25" height="25" />
      <rect x="25" y="50" width="25" height="25" />
      <rect x="50" y="50" width="25" height="25" />
      <rect x="75" y="50" width="25" height="25" />
      <rect x="100" y="50" width="25" height="25" />
      <rect x="125" y="50" width="25" height="25" />
      <rect y="75" width="25" height="25" />
      <rect x="25" y="75" width="25" height="25" />
      <rect x="50" y="75" width="25" height="25" />
      <rect x="75" y="75" width="25" height="25" />
      <rect x="100" y="75" width="25" height="25" />
      <rect x="125" y="75" width="25" height="25" />
      <rect x="25" y="100" width="25" height="25" />
      <rect x="75" y="100" width="25" height="25" />
      <rect x="125" y="100" width="25" height="25" />
    </svg>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export function Footer({ className }: FooterProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnParticle = useCallback(() => {
    const id = particleIdRef.current++;
    const x = (Math.random() - 0.5) * 80;
    const y = -(Math.random() * 40 + 20);
    const size = Math.random() * 16 + 16;
    const rotation = (Math.random() - 0.5) * 60;

    setParticles((prev) => [...prev, { id, x, y, size, rotation }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  }, []);

  const handleClaudeEnter = useCallback(() => {
    spawnParticle();
    intervalRef.current = setInterval(spawnParticle, 300);
  }, [spawnParticle]);

  const handleClaudeLeave = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
        'desktop:sticky desktop:bottom-0 z-30 flex items-center justify-start desktop:justify-between desktop:px-8 pt-8 pb-8 bg-background text-muted-foreground text-sm desktop:text-base max-w-[35rem] desktop:max-w-full mx-auto desktop:mx-0',
        className
      )}
    >
      {/* Left - Keyboard shortcuts */}
      <div className="hidden desktop:flex items-center gap-4 text-base leading-6">
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
        <span className="hidden desktop:inline-flex items-center gap-2">
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

with <span className="relative inline-block" onMouseEnter={handleClaudeEnter} onMouseLeave={handleClaudeLeave}>
          {particles.map((p) => (
            <PixelAlien
              key={p.id}
              size={p.size}
              className="absolute pointer-events-none select-none text-foreground"
              style={{
                left: '50%',
                bottom: '100%',
                '--confetti-x': `${p.x}px`,
                '--confetti-y': `${p.y}px`,
                '--confetti-r': `${p.rotation}deg`,
                animation: 'confetti-burst 1200ms ease-out forwards',
              } as React.CSSProperties}
            />
          ))}
          <a href="https://github.com/0xchsh/portfolio" target="_blank" rel="noopener noreferrer" className="text-foreground border-b border-dotted border-muted-foreground/50 hover:text-muted-foreground transition-colors">Claude</a>
        </span><span className="text-orange-500 -ml-0.5">*</span>
      </div>
    </footer>
  );
}
