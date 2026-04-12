'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, List, SquaresFour } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/shared/FadeIn';
import apisData from '@/data/apis.json';

type ApiItem = {
  name: string;
  url: string;
  href?: string;
  description: string;
  favicon: string;
};

const items = apisData.items as ApiItem[];

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

function useOgImages(items: ApiItem[]) {
  const [ogImages, setOgImages] = useState<Record<string, string | null>>({});
  const cacheRef = useRef<Record<string, string | null>>({});

  useEffect(() => {
    const toFetch = items.filter((item) => !(item.url in cacheRef.current));

    const fromCache: Record<string, string | null> = {};
    for (const item of items) {
      if (item.url in cacheRef.current) {
        fromCache[item.url] = cacheRef.current[item.url];
      }
    }
    if (Object.keys(fromCache).length > 0) {
      setOgImages((prev) => ({ ...prev, ...fromCache }));
    }

    if (toFetch.length === 0) return;

    for (const item of toFetch) {
      fetch(`/api/og?url=${encodeURIComponent(item.href || item.url)}`)
        .then((res) => res.json())
        .then((data: { image: string | null }) => {
          cacheRef.current[item.url] = data.image;
          setOgImages((prev) => ({ ...prev, [item.url]: data.image }));
        })
        .catch(() => {
          cacheRef.current[item.url] = null;
          setOgImages((prev) => ({ ...prev, [item.url]: null }));
        });
    }
  }, [items]);

  return ogImages;
}

export function ApisContent() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const ogImages = useOgImages(items);

  return (
    <div className="max-w-[520px] mx-auto w-full">
      <div className="px-2.5">
        <FadeIn delay={50}>
          <SectionLabel
            trailing={
              <div className="flex items-center gap-0.5 -my-1">
                <button
                  onClick={() => setView('grid')}
                  className={cn(
                    'p-1 rounded transition-colors duration-100 cursor-pointer',
                    view === 'grid'
                      ? 'text-foreground'
                      : 'text-neutral-400 dark:text-neutral-600 hover:text-foreground',
                  )}
                >
                  <SquaresFour size={14} weight={view === 'grid' ? 'fill' : 'regular'} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn(
                    'p-1 rounded transition-colors duration-100 cursor-pointer',
                    view === 'list'
                      ? 'text-foreground'
                      : 'text-neutral-400 dark:text-neutral-600 hover:text-foreground',
                  )}
                >
                  <List size={14} weight={view === 'list' ? 'bold' : 'regular'} />
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
        <div key="list" className="flex flex-col gap-0.5">
          {items.map((item, i) => (
            <FadeIn key={item.name} delay={i * 25}>
              <a
                href={`https://${item.href || item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-100',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                )}
              >
                <div className="shrink-0 size-4 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.favicon} alt={item.name} width={14} height={14} className="" />
                </div>
                <span className="text-sm font-medium text-foreground min-w-[100px]">{item.name}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 flex-1 text-right hidden desktop:block transition-transform duration-150 group-hover:-translate-x-4">{item.url}</span>
                <ArrowUpRight size={12} weight="bold" className="shrink-0 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 absolute right-3" />
              </a>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div key="grid" className="grid grid-cols-2 gap-4 px-1.5">
          {items.map((item, i) => {
            const ogImage = ogImages[item.url];
            return (
              <FadeIn key={item.name} delay={i * 40}>
                <a
                  href={`https://${item.href || item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[1200/630]">
                    {ogImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ogImage}
                        alt={item.name}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="w-full aspect-[1200/630] flex items-center justify-center">
                        {ogImage === null ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.favicon} alt={item.name} width={24} height={24} className="opacity-40" />
                        ) : (
                          <div className="size-3 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-transparent animate-spin" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{item.url}</span>
                    </div>
                  </div>
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
  );
}
