'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Buildings, Briefcase, User, TextAa, Clock } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/shared/FadeIn';
import indexData from '@/data/index.json';

type IndexItem = {
  name: string;
  url: string;
  description: string;
};

type Category = {
  name: string;
  items: IndexItem[];
};

const categoryIcons: Record<string, React.ElementType> = {
  Company: Buildings,
  Clients: Briefcase,
  Personal: User,
};

const categories = indexData.categories as Category[];

function sortKey(value: string): string {
  return value.toLowerCase().replace(/^the\s+/, '');
}

function buildHref(url: string) {
  return url.startsWith('http') ? url : `https://${url}`;
}

function SectionLabel({ children, trailing }: { children: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">
        {children}
      </span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700" />
      {trailing}
    </div>
  );
}

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      className={cn(
        'shrink-0 size-3.5 rounded-[4px] border flex items-center justify-center transition-colors duration-100',
        checked
          ? 'bg-foreground border-foreground'
          : 'border-neutral-300 dark:border-neutral-600',
      )}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M2 5L4 7L8 3" stroke="var(--background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export function IndexContent() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<'alpha' | 'time'>('alpha');

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const allItems = categories.flatMap((c) =>
    c.items.map((it) => ({ ...it, category: c.name })),
  );
  const filtered = selected.size === 0
    ? allItems
    : allItems.filter((it) => selected.has(it.category));
  const visibleItems = sort === 'alpha'
    ? [...filtered].sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name)))
    : filtered;
  const SortIcon = sort === 'alpha' ? TextAa : Clock;

  // Capture stagger delay per item on first render and flip
  // staggerDone after the initial animation completes — from then
  // on the fade-in class is removed entirely so sort/filter
  // toggles can never replay it.
  const stableDelayRef = useRef<Map<string, number> | null>(null);
  if (stableDelayRef.current === null) {
    stableDelayRef.current = new Map();
    visibleItems.forEach((it, idx) => {
      stableDelayRef.current!.set(`${it.category}-${it.name}`, idx * 25);
    });
  }
  const totalStaggerMs = useRef(Math.max(0, visibleItems.length - 1) * 25 + 300);
  const [staggerDone, setStaggerDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStaggerDone(true), totalStaggerMs.current);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col desktop:grid desktop:grid-cols-[200px_1fr] desktop:gap-x-8 desktop:items-start desktop:max-w-[720px] desktop:mx-auto">
      {/* Sidebar (desktop) */}
      <div className="hidden desktop:block">
        <div className="px-2.5">
          <FadeIn delay={50}><SectionLabel>Categories</SectionLabel></FadeIn>
        </div>
        <div className="mt-3 flex flex-col gap-0.5">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.name];
            const isChecked = selected.has(cat.name);
            return (
              <FadeIn key={cat.name} delay={75 + i * 30}>
                <button
                  onClick={() => toggle(cat.name)}
                  className={cn(
                    'flex items-center justify-between gap-2 px-2.5 py-1 rounded-md text-left cursor-pointer transition-colors duration-100 w-full',
                    isChecked
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-foreground'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                  )}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={14} weight="bold" />}
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <CheckboxMark checked={isChecked} />
                </button>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Main list */}
      <div className="desktop:mt-0 w-full">
        <div className="px-3">
          <FadeIn delay={50}>
            <SectionLabel
              trailing={
                <button
                  onClick={() => setSort((s) => (s === 'alpha' ? 'time' : 'alpha'))}
                  aria-label={sort === 'alpha' ? 'Sort by time' : 'Sort alphabetically'}
                  className="p-1 -my-1 rounded text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-100 cursor-pointer"
                >
                  <SortIcon size={16} weight="bold" />
                </button>
              }
            >
              Works
            </SectionLabel>
          </FadeIn>
        </div>
        <div className="mt-4" />
        <div className="flex flex-col gap-0.5">
          {visibleItems.map((item) => {
            const itemKey = `${item.category}-${item.name}`;
            const stableDelay = stableDelayRef.current!.get(itemKey) ?? 0;
            const hasUrl = item.url.trim().length > 0;
            const rowClass = cn(
              'group relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-100',
              hasUrl && 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            );
            const content = (
              <>
                <span className={cn('text-sm font-medium min-w-[100px]', hasUrl ? 'text-foreground' : 'text-neutral-400 dark:text-neutral-600')}>
                  {item.name}
                </span>
                <span className={cn(
                  'text-xs text-neutral-400 dark:text-neutral-600 flex-1 text-right truncate',
                  hasUrl && 'transition-transform duration-150 group-hover:-translate-x-4',
                )}>
                  {item.description}
                </span>
                {hasUrl && (
                  <ArrowUpRight size={12} weight="bold" className="shrink-0 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 absolute right-3" />
                )}
              </>
            );
            return (
              <div
                key={itemKey}
                className={staggerDone ? undefined : 'fade-in'}
                style={staggerDone ? undefined : { animationDelay: `${stableDelay}ms` }}
              >
                {hasUrl ? (
                  <a
                    href={buildHref(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClass}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
