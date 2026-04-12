'use client';

import { useState, useEffect } from 'react';
import { SpeakerHigh, SpeakerSlash, Sun, Moon, Files, Star } from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} className="px-2 py-1">
        {muted ? 'Unmute' : 'Mute'}
      </TooltipContent>
    </Tooltip>
  );
}

function DarkModeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  if (!mounted) return <div className="w-4 h-4" />;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150 cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} className="px-2 py-1">
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </TooltipContent>
    </Tooltip>
  );
}

export function V2Controls() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/skills"
            className={cn(
              'transition-colors duration-150',
              pathname === '/skills'
                ? 'text-neutral-600 dark:text-neutral-400'
                : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
            )}
          >
            <Files size={16} weight={pathname === '/skills' ? 'fill' : 'bold'} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4} className="px-2 py-1">Skills</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/stack"
            className={cn(
              'transition-colors duration-150',
              pathname === '/stack'
                ? 'text-neutral-600 dark:text-neutral-400'
                : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
            )}
          >
            <Star size={16} weight={pathname === '/stack' ? 'fill' : 'bold'} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4} className="px-2 py-1">Stack</TooltipContent>
      </Tooltip>
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
