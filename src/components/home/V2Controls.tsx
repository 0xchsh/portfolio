'use client';

import { useState, useEffect } from 'react';
import { SpeakerHigh, SpeakerSlash, Sun, Moon, Robot, Stack } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';

function HapticsToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(localStorage.getItem('haptics-muted') === 'true');
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('haptics-muted', String(next));
    window.dispatchEvent(new Event('haptics-muted-change'));
  };

  return (
    <button
      onClick={toggle}
      className={`transition-colors duration-150 cursor-pointer ${
        muted
          ? 'text-neutral-300 dark:text-neutral-700'
          : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
      }`}
    >
      {muted ? <SpeakerSlash size={16} weight="bold" /> : <SpeakerHigh size={16} weight="bold" />}
    </button>
  );
}

function DarkModeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  if (!mounted) return <div className="w-4 h-4" />;
  return (
    <button
      onClick={toggleTheme}
      className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150 cursor-pointer"
    >
      {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  );
}

export function V2Controls() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/skills"
        className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150"
      >
        <Robot size={16} weight="bold" />
      </Link>
      <Link
        href="/stack"
        className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150"
      >
        <Stack size={16} weight="bold" />
      </Link>
      <HapticsToggle />
      <DarkModeToggle />
    </div>
  );
}

/**
 * Desktop controls row that shifts icons left on /stack
 * to align with the Links column.
 */
export function DesktopControlsRow() {
  const pathname = usePathname();
  const isStack = pathname === '/stack';

  return (
    <div
      className="opacity-0 group-hover/page:opacity-100 transition-all duration-300"
      style={{ transform: isStack ? 'translateX(-161px)' : 'translateX(0)' }}
    >
      <V2Controls />
    </div>
  );
}
