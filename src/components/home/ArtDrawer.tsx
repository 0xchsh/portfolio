'use client';

import Image from 'next/image';
import { X, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';
import { projectSummaries } from '@/data/project-summaries';

type ArtSection = {
  image: string;
  text?: string;
  half?: boolean;
  quarter?: boolean;
  blurDataURL?: string | null;
};

type ArtItem = {
  title: string;
  year: string;
  images: string[];
  sections?: ArtSection[];
  size: string;
  type: string[];
  collectionHref: string;
  collectionLabel: string;
  links?: { label: string; href: string }[];
};

function renderInlineLinks(text: string) {
  const parts = text.split(/(\[([^\]]+)\]\(([^)]+)\))/g);
  const result: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    if (parts[i].startsWith('[') && i + 2 < parts.length) {
      result.push(<a key={i} href={parts[i + 2]} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground transition-colors duration-100">{parts[i + 1]}</a>);
      i += 3;
    } else {
      if (parts[i]) result.push(parts[i]);
      i++;
    }
  }
  return result;
}

export function ArtDrawer({
  item,
  children,
}: {
  item: ArtItem;
  children: React.ReactNode;
}) {
  const [showCollect, setShowCollect] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setShowCollect((v) => !v), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background outline-none rounded-t-2xl"
          style={{ maxHeight: '85vh' }}
        >
          <Drawer.Title className="sr-only">{item.title}</Drawer.Title>

          {/* Header */}
          <div className="shrink-0 border-b border-neutral-100 dark:border-neutral-800 px-5 pt-5 pb-4 relative">
            <div className="max-w-[704px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-4 h-4 rounded-[3px] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image src={item.images[0]} alt={item.title} width={16} height={16} unoptimized className="object-cover" />
                </div>
                <p className="text-sm leading-5 font-semibold text-foreground">
                  {item.title}
                  {/* Desktop: always show size */}
                  <span className="hidden desktop:inline">
                    <span className="text-neutral-300 dark:text-neutral-600 mx-[4px]">·</span>
                    <span className="font-medium text-neutral-500 dark:text-neutral-500">{item.type.filter(t => t !== 'NFT').join(', ')}{item.type.filter(t => t !== 'NFT').length > 0 ? ' · ' : ''}{item.size}</span>
                  </span>
                  {/* Mobile: fade between size and collect button */}
                  <span className="desktop:hidden relative inline-block ml-1" style={{ minWidth: '4rem' }}>
                    <span className={`transition-opacity duration-500 ${showCollect ? 'opacity-0' : 'opacity-100'}`}>
                      <span className="text-neutral-300 dark:text-neutral-600 mx-[2px]">·</span>
                      <span className="font-medium text-neutral-500 dark:text-neutral-500">{item.type.filter(t => t !== 'NFT').join(', ')}{item.type.filter(t => t !== 'NFT').length > 0 ? ' · ' : ''}{item.size}</span>
                    </span>
                    <a
                      href={item.collectionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute left-0 top-0 inline-flex items-center text-sm font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full transition-opacity duration-500 ${showCollect ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      {item.collectionLabel}
                      <ArrowUpRight size={12} weight="bold" className="ml-0.5" />
                    </a>
                  </span>
                </p>
              </div>
              {/* Desktop only collect button */}
              <a
                href={item.collectionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden desktop:inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors duration-100 shrink-0"
              >
                {item.collectionLabel}
                <ArrowUpRight size={12} weight="bold" className="ml-0.5" />
              </a>
            </div>
            <Drawer.Close className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-100">
              <X size={16} weight="bold" />
            </Drawer.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5" data-vaul-no-drag>
            <div className="max-w-[704px] mx-auto pt-8 pb-16 flex flex-col gap-8">
              <div className="flex flex-row gap-8">
                {item.images.map((src, i) => (
                  <div key={i} className="relative flex-1 aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                    <Image
                      src={src}
                      alt={`${item.title} ${i + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {projectSummaries[item.title] && (
                <div className="text-sm leading-5 font-medium text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto">
                  {projectSummaries[item.title].split('\n\n').map((block, i) => {
                    const lines = block.split('\n');
                    const isList = lines.every(l => l.startsWith('- '));
                    if (isList) {
                      return (
                        <ul key={i} className="flex flex-col gap-1 list-none">
                          {lines.map((l, j) => (
                            <li key={j}>{l.slice(2)}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{renderInlineLinks(block)}</p>;
                  })}
                </div>
              )}
              {item.links && item.links.length > 0 && (
                <div className="flex flex-wrap gap-2 max-w-[480px] mx-auto w-full">
                  {item.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors duration-100"
                    >
                      {link.label}
                      <ArrowUpRight size={12} weight="bold" className="ml-0.5" />
                    </a>
                  ))}
                </div>
              )}
              {(() => {
                const sections = item.sections ?? [];
                const groups: (ArtSection | ArtSection[])[] = [];
                let i = 0;
                while (i < sections.length) {
                  if (sections[i].quarter && sections[i + 1]?.quarter && sections[i + 2]?.quarter && sections[i + 3]?.quarter) {
                    groups.push([sections[i], sections[i + 1], sections[i + 2], sections[i + 3]]);
                    i += 4;
                  } else if (sections[i].half && sections[i + 1]?.half) {
                    groups.push([sections[i], sections[i + 1]]);
                    i += 2;
                  } else {
                    groups.push(sections[i]);
                    i++;
                  }
                }
                return groups.map((group, gi) =>
                  Array.isArray(group) ? (
                    <div key={gi} className="flex flex-col gap-8">
                      <div className="flex gap-8">
                        {group.map((section, j) => (
                          <div key={j} className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                            <Image src={section.image} alt={`${item.title} ${gi}-${j}`} width={176} height={176} unoptimized placeholder={section.blurDataURL ? 'blur' : 'empty'} blurDataURL={section.blurDataURL ?? undefined} className="w-full h-auto" />
                          </div>
                        ))}
                      </div>
                      {group.map((section, j) => section.text && (
                        <div key={j} className="text-sm leading-5 font-medium text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto w-full">
                          {section.text.split('\n\n').map((para, k) => <p key={k}>{para}</p>)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div key={gi} className="flex flex-col gap-8">
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700">
                        <Image src={(group as ArtSection).image} alt={`${item.title} ${gi}`} width={704} height={704} unoptimized placeholder={(group as ArtSection).blurDataURL ? 'blur' : 'empty'} blurDataURL={(group as ArtSection).blurDataURL ?? undefined} className="w-full h-auto rounded-lg" />
                      </div>
                      {(group as ArtSection).text && (
                        <div className="text-sm leading-5 font-medium text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto">
                          {(group as ArtSection).text!.split('\n\n').map((para, j) => <p key={j}>{para}</p>)}
                        </div>
                      )}
                    </div>
                  )
                );
              })()}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
