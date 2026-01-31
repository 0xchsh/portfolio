'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const isVideo = mockup.src.endsWith('.mp4');

  return (
    <figure className={cn(
      'flex flex-col items-center gap-2',
      mockup.type !== 'mobile' && 'w-full',
      className
    )}>
      <div
        className={cn(
          'overflow-hidden relative',
          isVideo ? 'bg-black' : 'bg-secondary',
          mockup.type === 'mobile' && 'w-[200px] desktop:w-[240px] rounded-[28px] aspect-[9/19.5]',
          mockup.type === 'desktop' && cn('w-full max-w-[35rem] desktop:max-w-none rounded-xl', !isVideo && 'aspect-video'),
          mockup.type === 'frame' && cn('w-full max-w-[35rem] desktop:max-w-none rounded-xl', !isVideo && 'aspect-video')
        )}
      >
        {isVideo ? (
          <video
            key={mockup.src}
            src={mockup.src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-auto block"
          />
        ) : (
          <Image
            key={mockup.src}
            src={mockup.src}
            alt={mockup.alt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            placeholder={mockup.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={mockup.blurDataURL}
            className="object-cover object-top"
          />
        )}
      </div>
      {mockup.caption && (
        <figcaption className="text-muted-foreground text-sm">
          {mockup.caption}
        </figcaption>
      )}
    </figure>
  );
}
