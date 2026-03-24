'use client';

import Image from 'next/image';
import { X } from '@phosphor-icons/react/dist/ssr';
import { Drawer } from 'vaul';
import { projectSummaries } from '@/data/project-summaries';

type ArtSection = {
  image: string;
  text?: string;
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
};

export function ArtDrawer({
  item,
  children,
}: {
  item: ArtItem;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background outline-none rounded-t-2xl"
          style={{ height: '90vh' }}
        >
          <Drawer.Title className="sr-only">{item.title}</Drawer.Title>

          {/* Header */}
          <div className="shrink-0 border-b border-neutral-100 dark:border-neutral-800 px-5 pt-5 pb-4 relative">
            <div className="max-w-[704px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-5 h-5 rounded-[3px] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image src={item.images[0]} alt={item.title} width={20} height={20} unoptimized className="object-cover" />
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                  <span className="text-neutral-300 dark:text-neutral-600 mx-[4px]">·</span>
                  <span className="font-normal text-neutral-400 dark:text-neutral-500">{item.year} · {item.type.filter(t => t !== 'NFT').join(', ')}{item.type.filter(t => t !== 'NFT').length > 0 ? ' · ' : ''}{item.size}</span>
                </p>
              </div>
              <a
                href={item.collectionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors duration-100"
              >
                {item.collectionLabel}
              </a>
            </div>
            <Drawer.Close className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-100">
              <X size={16} weight="bold" />
            </Drawer.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5" data-vaul-no-drag>
            <div className="max-w-[704px] mx-auto py-5 pb-16 flex flex-col gap-8">
              <div className="flex flex-row gap-4">
                {item.images.map((src, i) => (
                  <div key={i} className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
                <div className="text-sm leading-[1.75] text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto">
                  {projectSummaries[item.title].split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
              {item.sections?.map((section, i) => (
                <div key={i} className="flex flex-col gap-6">
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                    <Image
                      src={section.image}
                      alt={`${item.title} ${i + 3}`}
                      width={704}
                      height={704}
                      unoptimized
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                  {section.text && (
                    <div className="text-sm leading-[1.75] text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto">
                      {section.text.split('\n\n').map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
