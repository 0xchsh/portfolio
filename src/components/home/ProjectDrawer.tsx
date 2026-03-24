'use client';

import Image from 'next/image';
import { X } from '@phosphor-icons/react/dist/ssr';
import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';
import workData from '@/data/work.json';
import type { WorkItem } from '@/app/work/page';
import { WorkCardContent, VideoWithBlur } from '@/components/work/WorkCard';
import { projectSummaries } from '@/data/project-summaries';
import { caseStudySections } from '@/data/case-studies';

type Project = {
  name: string;
  desc: string;
  href: string;
  icon: string;
  workTitle?: string;
};

const allWork = workData as WorkItem[];

export function ProjectDrawer({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const workItems = project.workTitle
    ? allWork.filter((w) => w.title === project.workTitle)
    : [];

  const hasVisit = project.href !== '#';
  const [showVisit, setShowVisit] = useState(false);

  useEffect(() => {
    if (!hasVisit) return;
    const id = setInterval(() => setShowVisit((v) => !v), 3000);
    return () => clearInterval(id);
  }, [hasVisit]);

  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background outline-none rounded-t-2xl"
          style={{ height: '90vh' }}
        >
          <Drawer.Title className="sr-only">{project.name}</Drawer.Title>

          {/* Header */}
          <div className="shrink-0 border-b border-neutral-100 dark:border-neutral-800 px-5 pt-5 pb-4 relative">
            <div className="max-w-[704px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={project.icon}
                  alt={project.name}
                  width={20}
                  height={20}
                  className="shrink-0 dark:invert"
                />
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {project.name}
                  {/* Desktop: always show desc. Mobile: fade between desc and Visit button */}
                  <span className="hidden desktop:inline">
                    <span className="text-neutral-300 dark:text-neutral-600 mx-[4px]">·</span>
                    <span className="font-normal text-neutral-400 dark:text-neutral-500">{project.desc}</span>
                  </span>
                  <span className="desktop:hidden relative inline-block ml-1" style={{ minWidth: '4rem' }}>
                    <span className={`transition-opacity duration-500 ${showVisit ? 'opacity-0' : 'opacity-100'}`}>
                      <span className="text-neutral-300 dark:text-neutral-600 mx-[2px]">·</span>
                      <span className="font-normal text-neutral-400 dark:text-neutral-500">{project.desc}</span>
                    </span>
                    {hasVisit && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute left-0 top-0 inline-flex items-center text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full transition-opacity duration-500 ${showVisit ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      >
                        Visit ↗
                      </a>
                    )}
                  </span>
                </p>
              </div>
              {/* Desktop only Visit button */}
              {hasVisit && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden desktop:inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full transition-colors duration-100 shrink-0"
                >
                  Visit
                </a>
              )}
            </div>
            <Drawer.Close className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-100">
              <X size={16} weight="bold" />
            </Drawer.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5" data-vaul-no-drag>
            <div className="max-w-[704px] mx-auto pt-12 pb-16 flex flex-col gap-12">
              {caseStudySections[project.name] ? (
                caseStudySections[project.name].map((section, i) => (
                  <div key={i} className="flex flex-col gap-6">
                    {i > 0 && (
                      <div className="w-[72px] mx-auto border-t border-dotted border-neutral-300 dark:border-neutral-600 mb-6" />
                    )}
                    {section.mockups && section.mockups.length > 0 && (
                      section.mockups[0].type === 'mobile' ? (
                        <div className="flex gap-3 justify-center">
                          {section.mockups.map((m, j) => (
                            <div key={j} className="relative rounded-[20px] overflow-hidden bg-neutral-100 dark:bg-neutral-800" style={{ width: `calc((100% - ${(section.mockups!.length - 1) * 12}px) / ${section.mockups!.length})`, maxWidth: '160px', aspectRatio: '9 / 19.5' }}>
                              {m.src.endsWith('.mp4') || m.src.endsWith('.webm') ? (
                                <VideoWithBlur src={m.src} className="absolute inset-0 w-full h-full object-cover" eager />
                              ) : (
                                <Image src={m.src} alt="" fill unoptimized className="object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800">
                          {section.mockups[0].src.endsWith('.mp4') || section.mockups[0].src.endsWith('.webm') ? (
                            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                              <VideoWithBlur src={section.mockups[0].src} className="absolute inset-0 w-full h-full object-cover" eager />
                            </div>
                          ) : (
                            <Image src={section.mockups[0].src} alt="" width={704} height={396} unoptimized className="w-full h-auto" />
                          )}
                        </div>
                      )
                    )}
                    <div className="text-sm leading-[1.75] text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto w-full">
                      {section.text.split('\n\n').map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {workItems.length > 0 && (
                    <div className="flex flex-col">
                      {workItems.map((item, i) => (
                        <WorkCardContent key={i} item={item} hideTitle />
                      ))}
                    </div>
                  )}
                  {projectSummaries[project.name] && (
                    <div className="text-sm leading-[1.75] text-neutral-600 dark:text-neutral-400 flex flex-col gap-4 max-w-[480px] mx-auto">
                      {projectSummaries[project.name].split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
