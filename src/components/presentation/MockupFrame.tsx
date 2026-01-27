'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const { type, src, alt, caption } = mockup;

  const widthClass = {
    mobile: 'w-[280px]',
    desktop: 'w-full max-w-[640px]',
    frame: 'w-full max-w-[640px]',
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
          <Squircle asChild cornerRadius={32} cornerSmoothing={1}>
            <div
              className="relative overflow-hidden bg-muted border border-border shadow-sm"
              style={{ aspectRatio: '9 / 19.5' }}
            >
              {/* Screen content placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-muted" />
              </div>
            </div>
          </Squircle>
          {caption && (
            <p className="text-center text-muted-foreground mt-4" style={{ fontSize: '14px', lineHeight: '22px' }}>
              {caption}
            </p>
          )}
        </div>
      )}

      {type === 'desktop' && (
        // Desktop browser frame
        <div className="relative">
          <Squircle asChild cornerRadius={16} cornerSmoothing={1}>
            <div
              className="relative overflow-hidden bg-muted border border-border shadow-sm"
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
          </Squircle>
          {caption && (
            <p className="text-center text-muted-foreground mt-4" style={{ fontSize: '14px', lineHeight: '22px' }}>
              {caption}
            </p>
          )}
        </div>
      )}

      {type === 'frame' && (
        // Simple frame with centered image
        <div className="relative">
          <Squircle asChild cornerRadius={16} cornerSmoothing={1}>
            <div
              className="overflow-hidden bg-muted flex items-center justify-center"
              style={{ width: '640px', height: '366px' }}
            >
              {src && (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </Squircle>
          {caption && (
            <p className="text-center text-muted-foreground mt-4" style={{ fontSize: '14px', lineHeight: '22px' }}>
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
