'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect, type ComponentType } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  HandWaving, SquaresFour,
} from '@phosphor-icons/react';

type PhosphorIcon = ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }>;

const navItems: { href: string; label: string; icon: PhosphorIcon }[] = [
  { href: '/', label: 'About', icon: HandWaving },
  { href: '/work', label: 'Work', icon: SquaresFour },
];

function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeItem = navItems.find(item => item.href === pathname) ?? navItems[0];
  const ActiveIcon = activeItem.icon;

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative sm:hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold px-2.5 h-7 rounded-lg btn-classic btn-classic-outline bg-background border border-transparent bg-clip-padding"
      >
        <ActiveIcon size={14} weight="regular" />
        {activeItem.label}
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          className={cn('ml-0.5 text-neutral-400 transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={cn(
          'absolute top-full left-0 mt-1.5 bg-white rounded-lg border border-neutral-200 shadow-lg py-1 min-w-[160px] z-50 origin-top-left',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
          filter: open ? 'blur(0px)' : 'blur(5px)',
          transition: open
            ? 'opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 150ms cubic-bezier(0.215, 0.61, 0.355, 1), filter 150ms cubic-bezier(0.215, 0.61, 0.355, 1)'
            : 'opacity 100ms ease, transform 100ms ease, filter 100ms ease',
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'font-semibold text-neutral-950 bg-neutral-50'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950',
              )}
            >
              <Icon size={14} weight="regular" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="relative hidden sm:block">
      <ButtonGroup>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Button
              key={href}
              variant="outline"
              size="sm"
              render={<Link href={href} />}
              className={cn(
                !isActive && 'text-muted-foreground',
              )}
            >
              <Icon size={14} weight="regular" data-icon="inline-start" />
              {label}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}

export function AnimatedNav() {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}
