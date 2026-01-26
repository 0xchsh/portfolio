'use client';

import { cn } from '@/lib/utils';
import { MockupFrame } from './MockupFrame';
import type { Mockup } from '@/types/presentation';

interface MockupGridProps {
  mockups: Mockup[];
  className?: string;
}

export function MockupGrid({ mockups, className }: MockupGridProps) {
  const count = mockups.length;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 md:gap-6',
        count === 1 && 'justify-center',
        count === 2 && 'justify-center',
        count >= 3 && 'flex-wrap',
        className
      )}
    >
      {mockups.map((mockup) => (
        <MockupFrame key={mockup.id} mockup={mockup} />
      ))}
    </div>
  );
}
