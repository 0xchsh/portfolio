'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = mockup.src.endsWith('.mp4');

  const mediaClass = loaded
    ? 'opacity-100 transition-opacity duration-300 ease-in-out'
    : 'opacity-0';

  const media = isVideo ? (
    <video
      key={mockup.src}
      src={mockup.src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={() => setLoaded(true)}
      className={cn('w-full h-full object-cover', mediaClass)}
    />
  ) : (
    <img
      key={mockup.src}
      src={mockup.src}
      alt={mockup.alt}
      onLoad={() => setLoaded(true)}
      className={cn('w-full h-full object-cover object-top', mediaClass)}
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
          mockup.type === 'mobile' && 'w-[200px] desktop:w-[240px] rounded-[28px] aspect-[9/19.5]',
          mockup.type === 'desktop' && 'w-full max-w-[35rem] desktop:max-w-none rounded-xl aspect-video',
          mockup.type === 'frame' && 'w-full max-w-[35rem] desktop:max-w-none rounded-xl aspect-video'
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
