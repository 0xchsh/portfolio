'use client';

import { X } from '@phosphor-icons/react/dist/ssr';
import { Drawer } from 'vaul';
import workData from '@/data/work.json';
import type { WorkItem } from '@/app/work/page';
import { WorkCardContent } from '@/components/work/WorkCard';

const allWork = workData as WorkItem[];

export function WorkDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background outline-none rounded-t-2xl"
          style={{ height: '90vh' }}
        >
          <Drawer.Title className="sr-only">Work</Drawer.Title>

          {/* Header */}
          <div className="shrink-0 border-b border-neutral-100 dark:border-neutral-800 px-5 pt-5 pb-4">
            <div className="max-w-[704px] mx-auto flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Work</span>
              <Drawer.Close className="p-1 -mr-1 rounded-md text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
                <X size={16} weight="bold" />
              </Drawer.Close>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5" data-vaul-no-drag>
            <div className="max-w-[704px] mx-auto py-5 pb-16 flex flex-col">
              {allWork.map((item, i) => (
                <WorkCardContent key={i} item={item} />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
