'use client';

import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react';
import { ProjectDrawer } from '@/components/home/ProjectDrawer';

export type ProjectItem = {
  name: string;
  desc: string;
  href: string;
  icon: string;
  workTitle?: string;
};

const rowClass =
  'group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';

function Inner({ item, hideIcon }: { item: ProjectItem; hideIcon?: boolean }) {
  return (
    <>
      {!hideIcon && (
        <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
          <Image src={item.icon} alt={item.name} width={16} height={16} className="dark:invert transition-transform duration-150 group-hover:scale-110" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-foreground leading-[20px]">{item.name}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">{item.desc}</p>
      </div>
    </>
  );
}

export function ProjectRow({ item, hideIcon, directLink, navIndex }: { item: ProjectItem; hideIcon?: boolean; directLink?: boolean; navIndex?: number }) {
  if (directLink) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${rowClass} group`}>
        <Inner item={item} hideIcon={hideIcon} />
        <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
      </a>
    );
  }

  return (
    <ProjectDrawer project={item} navIndex={navIndex}>
      <button className={rowClass}>
        <Inner item={item} hideIcon={hideIcon} />
      </button>
    </ProjectDrawer>
  );
}
