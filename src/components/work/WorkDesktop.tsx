'use client';

import { useState } from 'react';
import type { WorkItem } from '@/app/work/page';
import { WorkStack } from './WorkStack';
import { WorkCanvas } from './WorkCanvas';
import { WorkViewToggle, type WorkView } from './WorkViewToggle';

export function WorkDesktop({ items }: { items: WorkItem[] }) {
  const [view, setView] = useState<WorkView>('stack');

  return (
    <>
      {view === 'stack' ? (
        <WorkStack items={items} />
      ) : (
        <WorkCanvas items={items} />
      )}
      <WorkViewToggle view={view} onChange={setView} />
    </>
  );
}
