'use client';

import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const { type, src, alt } = mockup;

  const widthClass = {
    mobile: 'w-[240px] sm:w-[320px]',
    desktop: 'w-full max-w-[560px]',
    frame: 'w-full max-w-[560px]',
  }[type];

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        widthClass,
        className
      )}
    >
      {type === 'mobile' && (
        // Mobile device frame
        <div className="relative">
          <div
            className="relative overflow-hidden bg-muted border border-border shadow-sm"
            style={{ aspectRatio: '9 / 19.5', borderRadius: '32px', cornerSmooth: '100%', WebkitCornerSmooth: '100%' } as React.CSSProperties}
          >
            {/* Screen content placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-muted" />
            </div>
          </div>
        </div>
      )}

      {type === 'desktop' && (
        // Desktop browser frame
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-lg bg-muted border border-border shadow-sm"
            style={{ aspectRatio: '16 / 10' }}
          >
            {/* Browser chrome */}
            <div className="absolute top-0 left-0 right-0 h-[24px] bg-secondary border-b border-border flex items-center px-2 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-chart-5/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-chart-1/60" />
            </div>
            {/* Screen content placeholder */}
            <div className="absolute top-[24px] inset-x-0 bottom-0 bg-muted" />
          </div>
        </div>
      )}

      {type === 'frame' && (
        // Simple frame with centered image
        <div
          className="relative overflow-hidden rounded-xl bg-muted flex items-center justify-center"
          style={{ width: '560px', height: '320px' }}
        >
          {src && (
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      )}
    </div>
  );
}
