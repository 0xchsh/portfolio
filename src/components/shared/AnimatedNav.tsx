'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useLayoutEffect, type ComponentType } from 'react';
import { cn } from '@/lib/utils';
import {
  HandWaving, GridNine, Rows, ArrowLeft, ArrowRight,
} from '@phosphor-icons/react';

type PhosphorIcon = ComponentType<{ size?: number; weight?: string }>;

const navItems: { href: string; label: string; icon: PhosphorIcon }[] = [
  { href: '/', label: 'About', icon: HandWaving },
  { href: '/work', label: 'Work', icon: GridNine },
  { href: '/feed', label: 'Feed', icon: Rows },
];

// Persists across re-mounts within the same session
let lastVisitedPath: string | null = null;

export function AnimatedNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [anim, setAnim] = useState({ cls: '', key: 0 });
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    // Determine direction from previous navigation
    if (lastVisitedPath && lastVisitedPath !== pathname) {
      const prevIdx = navItems.findIndex(i => i.href === lastVisitedPath);
      const currIdx = navItems.findIndex(i => i.href === pathname);
      if (prevIdx >= 0 && currIdx >= 0) {
        const last = navItems.length - 1;
        const isWrapRight = prevIdx === last && currIdx === 0;
        const isWrapLeft = prevIdx === 0 && currIdx === last;
        const goingRight = isWrapRight || (!isWrapLeft && currIdx > prevIdx);
        setAnim(a => ({
          cls: goingRight ? 'animate-slide-in-from-left' : 'animate-slide-in-from-right',
          key: a.key + 1,
        }));
      }
    }
    lastVisitedPath = pathname;

    // Position pill at active item
    const activeIndex = navItems.findIndex(item => item.href === pathname);
    const activeEl = itemRefs.current[activeIndex];
    const navEl = navRef.current;
    if (activeEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPill({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    }
  }, [pathname]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <nav ref={navRef} className="relative flex items-center gap-1.5">
        {/* Pill indicator */}
        <div
          key={anim.key}
          className={cn('absolute top-0 h-full bg-neutral-100 rounded-md', anim.cls)}
          style={{
            left: pill?.left ?? 0,
            width: pill?.width ?? 0,
            visibility: pill ? 'visible' : 'hidden',
          }}
        />
        {navItems.map(({ href, label, icon: Icon }, i) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`relative z-10 flex items-center gap-1 px-1.5 py-0.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                isActive
                  ? ''
                  : 'text-neutral-400 hover:text-neutral-950'
              }`}
            >
              <Icon size={14} weight="regular" />
              {label}
            </Link>
          );
        })}
      </nav>
      <span
        className={cn(
          'absolute left-0 right-0 top-full flex items-center justify-center gap-1 text-[10px] text-neutral-400 transition-all ease-out',
          hovered
            ? 'opacity-100 translate-y-1 duration-300'
            : 'opacity-0 translate-y-0 duration-500 pointer-events-none',
        )}
      >
        <ArrowLeft size={10} weight="bold" />
        Use arrow keys to navigate
        <ArrowRight size={10} weight="bold" />
      </span>
    </div>
  );
}
