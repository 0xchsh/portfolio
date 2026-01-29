'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import type { Mockup } from '@/types/presentation';

// Check if source is a video file
const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

interface MockupFrameProps {
  mockup: Mockup;
  className?: string;
}

// Layered shadow style from jakub.kr/work/shadows
const frameShadow = {
  boxShadow: `
    0px 0px 0px 1px rgba(0, 0, 0, 0.06),
    0px 1px 2px -1px rgba(0, 0, 0, 0.06),
    0px 2px 4px 0px rgba(0, 0, 0, 0.04)
  `.trim(),
};

export function MockupFrame({ mockup, className }: MockupFrameProps) {
  const { type, src, alt, caption } = mockup;

  const widthClass = {
    mobile: 'w-[280px]',
    desktop: 'w-full max-w-[640px]',
    frame: 'w-full max-w-[640px]',
  }[type];

  // Render media content (image or video)
  const renderMedia = (className: string) => {
    if (!src) return <div className={`${className} bg-muted`} />;

    if (isVideo(src)) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={className}
        >
          <source src={src} type="video/mp4" />
        </video>
      );
    }

    return <img src={src} alt={alt} className={className} />;
  };

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
              className="relative overflow-hidden bg-muted"
              style={{ aspectRatio: '9 / 19.5', ...frameShadow }}
            >
              {/* Screen content */}
              <div className="absolute inset-0">
                {renderMedia('w-full h-full object-cover')}
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
              className="relative overflow-hidden bg-muted"
              style={{ aspectRatio: '16 / 10', ...frameShadow }}
            >
              {/* Browser chrome */}
              <div className="absolute top-0 left-0 right-0 h-[24px] bg-secondary flex items-center px-2 gap-1.5" style={{ boxShadow: '0px 1px 0px 0px rgba(0, 0, 0, 0.06)' }}>
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
              style={{ width: '640px', height: '366px', ...frameShadow }}
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
