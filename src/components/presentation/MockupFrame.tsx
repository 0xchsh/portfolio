'use client';

import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const isVideo = mockup.src.endsWith('.mp4');

  const media = isVideo ? (
    <video
      src={mockup.src}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-auto"
    />
  ) : (
    <img
      src={mockup.src}
      alt={mockup.alt}
      className="w-full h-auto"
    />
  );

  return (
    <figure className={cn(
      'flex flex-col items-center gap-2',
      mockup.type !== 'mobile' && 'w-full',
      className
    )}>
      <div
        className={cn(
          'overflow-hidden bg-secondary',
          mockup.type === 'mobile' && 'w-[200px] sm:w-[240px] rounded-[28px]',
          mockup.type === 'desktop' && 'w-full max-w-[560px] rounded-xl',
          mockup.type === 'frame' && 'w-full max-w-[560px] rounded-xl'
        )}
      >
        {media}
      </div>
      {mockup.caption && (
        <figcaption className="text-muted-foreground text-sm">
          {mockup.caption}
        </figcaption>
      )}
    </figure>
  );
}
