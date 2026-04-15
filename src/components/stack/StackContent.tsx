'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, PaintBrush, Desktop, Atom, Palette, List, SquaresFour, AppWindow, Sparkle, Article, Globe, Wrench, GraduationCap, Play, Pause, MusicNote, Robot, TextAa, Plugs, BookOpen } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/shared/FadeIn';
import { usePlayer, extractYouTubeId } from '@/components/shared/MiniPlayer';
import stackData from '@/data/stack.json';

type StackItem = {
  name: string;
  url: string;
  href?: string;
  description: string;
  favicon: string;
};

type Category = {
  name: string;
  items: StackItem[];
};

const categories = stackData.categories as Category[];

const categoryIcons: Record<string, React.ElementType> = {
  Agents: Robot,
  'Design Tools': PaintBrush,
  Components: Atom,
  'Design Systems': Palette,
  Inspiration: Sparkle,
  Software: AppWindow,
  Hardware: Desktop,
  Articles: Article,
  'Fun Sites': Globe,
  'Design Skills': Wrench,
  Courses: GraduationCap,
  'On Repeat': MusicNote,
  Typography: TextAa,
  APIs: Plugs,
  Directories: BookOpen,
};

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

function itemKey(item: StackItem) {
  return item.href || item.url;
}

function useOgImages(items: StackItem[]) {
  const [ogImages, setOgImages] = useState<Record<string, string | null>>({});
  const cacheRef = useRef<Record<string, string | null>>({});

  useEffect(() => {
    // For YouTube items, use thumbnail directly
    const ytResults: Record<string, string> = {};
    for (const item of items) {
      const key = itemKey(item);
      if (isYouTubeItem(item)) {
        const videoId = extractYouTubeId(key);
        if (videoId) {
          ytResults[key] = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          cacheRef.current[key] = ytResults[key];
        }
      }
    }
    if (Object.keys(ytResults).length > 0) {
      setOgImages((prev) => ({ ...prev, ...ytResults }));
    }

    const toFetch = items.filter((item) => !isYouTubeItem(item) && !(itemKey(item) in cacheRef.current));

    // Immediately populate from cache
    const fromCache: Record<string, string | null> = {};
    for (const item of items) {
      const key = itemKey(item);
      if (key in cacheRef.current) {
        fromCache[key] = cacheRef.current[key];
      }
    }
    if (Object.keys(fromCache).length > 0) {
      setOgImages((prev) => ({ ...prev, ...fromCache }));
    }

    if (toFetch.length === 0) return;

    for (const item of toFetch) {
      const key = itemKey(item);
      fetch(`/api/og?url=${encodeURIComponent(key)}`)
        .then((res) => res.json())
        .then((data: { image: string | null }) => {
          cacheRef.current[key] = data.image;
          setOgImages((prev) => ({ ...prev, [key]: data.image }));
        })
        .catch(() => {
          cacheRef.current[key] = null;
          setOgImages((prev) => ({ ...prev, [key]: null }));
        });
    }
  }, [items]);

  return ogImages;
}

function isYouTubeItem(item: StackItem) {
  return (item.href || item.url).includes('youtube.com');
}

export function StackContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const activeCategory = categories[activeIndex];
  const ogImages = useOgImages(activeCategory.items);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const { play, current, playing: playerPlaying, togglePlay } = usePlayer();

  const handleImageError = useCallback((key: string) => {
    setBrokenImages((prev) => new Set(prev).add(key));
  }, []);

  return (
    <div className="flex flex-col desktop:grid desktop:grid-cols-[200px_1fr] desktop:gap-x-8 desktop:items-start desktop:max-w-[720px] desktop:mx-auto">
      {/* Sidebar (desktop) */}
      <div className="hidden desktop:block">
        <div className="px-2.5">
          <FadeIn delay={50}><SectionLabel>Lists</SectionLabel></FadeIn>
        </div>
        <div className="mt-3 flex flex-col gap-0.5">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.name];
            return (
            <FadeIn key={cat.name} delay={75 + i * 30}>
              <button
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'flex items-center justify-between gap-2 px-2.5 py-1 rounded-md text-left cursor-pointer transition-colors duration-100 w-full',
                  i === activeIndex
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-foreground'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                )}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon size={14} weight="bold" />}
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <span className="text-xs tabular-nums text-neutral-400 dark:text-neutral-600">{cat.items.length}</span>
              </button>
            </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Filter badges + Links header (mobile — sticky) */}
      <div className="desktop:hidden sticky top-0 z-10 bg-background pb-4">
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 pb-1">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.name];
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors duration-100 shrink-0 border',
                    'border-transparent',
                    i === activeIndex
                      ? 'bg-foreground text-background'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
                  )}
                >
                  {Icon && <Icon size={12} weight="bold" />}
                  {cat.name}
                  <span className={cn(
                    'tabular-nums',
                    i === activeIndex ? 'text-background/60' : 'text-neutral-400 dark:text-neutral-600',
                  )}>{cat.items.length}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 px-1.5">
          <SectionLabel
            trailing={
              <div className="flex items-center gap-0.5 -my-1">
                  <button
                    onClick={() => setView('grid')}
                    className={cn(
                      'p-1 rounded transition-colors duration-100 cursor-pointer',
                      view === 'grid'
                        ? 'text-neutral-600 dark:text-neutral-400'
                        : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
                    )}
                  >
                    <SquaresFour size={16} weight={view === 'grid' ? 'fill' : 'regular'} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={cn(
                      'p-1 rounded transition-colors duration-100 cursor-pointer',
                      view === 'list'
                        ? 'text-neutral-600 dark:text-neutral-400'
                        : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
                    )}
                  >
                    <List size={16} weight={view === 'list' ? 'bold' : 'regular'} />
                  </button>
              </div>
            }
          >
            Links
          </SectionLabel>
        </div>
      </div>

      {/* Main list */}
      <div className="desktop:mt-0 w-full">
        <div className="px-1.5 hidden desktop:block">
          <FadeIn delay={50}>
            <SectionLabel
              trailing={
                <div className="flex items-center gap-0.5 -my-1">
                    <button
                      onClick={() => setView('grid')}
                      className={cn(
                        'p-1 rounded transition-colors duration-100 cursor-pointer',
                        view === 'grid'
                          ? 'text-neutral-600 dark:text-neutral-400'
                          : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
                      )}
                    >
                      <SquaresFour size={16} weight={view === 'grid' ? 'fill' : 'regular'} />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={cn(
                        'p-1 rounded transition-colors duration-100 cursor-pointer',
                        view === 'list'
                          ? 'text-neutral-600 dark:text-neutral-400'
                          : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400',
                      )}
                    >
                      <List size={16} weight={view === 'list' ? 'bold' : 'regular'} />
                    </button>
                </div>
              }
            >
              Links
            </SectionLabel>
          </FadeIn>
        </div>
        <div className="mt-4" />

        {view === 'list' ? (
          /* List rows */
          <div key="list" className="flex flex-col gap-0.5">
            {activeCategory.items.map((item, i) => {
              const isYT = isYouTubeItem(item);
              const ytVideoId = isYT ? extractYouTubeId(item.href || item.url) : null;
              const isCurrent = isYT && ytVideoId === current?.videoId;
              const isPlaying = isCurrent && playerPlaying;
              const handleClick = isYT ? (e: React.MouseEvent) => {
                e.preventDefault();
                if (isCurrent) {
                  togglePlay();
                } else if (ytVideoId) {
                  play(ytVideoId, item.name);
                }
              } : undefined;
              return (
              <FadeIn key={item.name} delay={i * 25}>
                <a
                  href={`https://${item.href || item.url}`}
                  target={isYT ? undefined : '_blank'}
                  rel={isYT ? undefined : 'noopener noreferrer'}
                  onClick={handleClick}
                  className={cn(
                    'group relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-100',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    isYT && 'cursor-pointer',
                  )}
                >
                  <div className="shrink-0 size-4 flex items-center justify-center overflow-hidden">
                    {isYT ? (
                      isPlaying ? (
                        <Pause size={14} weight="fill" className="text-foreground transition-colors" />
                      ) : (
                        <Play size={14} weight="fill" className="text-neutral-400 group-hover:text-foreground transition-colors" />
                      )
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.favicon} alt={item.name} width={14} height={14} className="" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground min-w-[100px]">{item.name}</span>
                  {!isYT && (
                    <span className="text-xs text-neutral-400 dark:text-neutral-600 flex-1 text-right hidden desktop:block transition-transform duration-150 truncate group-hover:-translate-x-4">
                      {item.url}
                    </span>
                  )}
                  {!isYT && (
                    <ArrowUpRight size={12} weight="bold" className="shrink-0 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 absolute right-3" />
                  )}
                </a>
              </FadeIn>
              );
            })}
          </div>
        ) : (
          /* Grid thumbnails */
          <div key="grid" className="grid grid-cols-1 desktop:grid-cols-2 gap-4 px-1.5">
            {activeCategory.items.map((item, i) => {
              const ogImage = ogImages[itemKey(item)];
              const isYT = isYouTubeItem(item);
              const gridYtVideoId = isYT ? extractYouTubeId(item.href || item.url) : null;
              const gridIsCurrent = isYT && gridYtVideoId === current?.videoId;
              const gridIsPlaying = gridIsCurrent && playerPlaying;
              const handleClick = isYT ? (e: React.MouseEvent) => {
                e.preventDefault();
                if (gridIsCurrent) {
                  togglePlay();
                } else if (gridYtVideoId) {
                  play(gridYtVideoId, item.name);
                }
              } : undefined;
              return (
                <FadeIn key={item.name} delay={i * 40}>
                  <a
                    href={`https://${item.href || item.url}`}
                    target={isYT ? undefined : '_blank'}
                    rel={isYT ? undefined : 'noopener noreferrer'}
                    onClick={handleClick}
                    className="group block"
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[1200/630] [&>img]:scale-[1.02]">
                      {ogImage && !brokenImages.has(itemKey(item)) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={ogImage}
                          alt={item.name}
                          className="w-full h-full object-cover block"
                          onError={() => handleImageError(itemKey(item))}
                        />
                      ) : (
                        <div className="w-full aspect-[1200/630] flex items-center justify-center">
                          {ogImage === null || brokenImages.has(itemKey(item)) ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.favicon} alt={item.name} width={24} height={24} className="opacity-40" />
                          ) : (
                            <div className="size-3 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-transparent animate-spin" />
                          )}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className={cn(
                        'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 flex items-center justify-center',
                        gridIsPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}>
                        {isYT ? (
                          <div className="size-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            {gridIsPlaying ? (
                              <Pause size={14} weight="fill" className="text-white" />
                            ) : (
                              <Play size={14} weight="fill" className="text-white ml-px" />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-white">{item.url}</span>
                        )}
                      </div>
                    </div>
                    {/* Label */}
                    <div className="flex items-center mt-1.5 px-0.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.favicon} alt="" width={12} height={12} className="shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate ml-1.5">{item.name}</span>
                      <ArrowUpRight size={12} weight="bold" className="shrink-0 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-1" />
                    </div>
                  </a>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
