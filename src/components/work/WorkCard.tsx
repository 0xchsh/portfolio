'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Squircle } from '@squircle-js/react';
export type WorkItem = {
  title: string;
  description: string;
  src: string[];
  blurDataURLs?: (string | null)[];
  link: string | null;
  logo: string | null;
  ratio: '16:9' | '1:1';
  objectPosition?: string;
  cover?: boolean;
};

function isVideoSrc(src: string) {
  return src.endsWith('.mp4') || src.endsWith('.webm');
}

export function SingleMedia({ src, alt, objectPosition, eager, sizes, blurDataURL }: { src: string; alt: string; objectPosition?: string; eager?: boolean; sizes?: string; blurDataURL?: string | null }) {
  const isVideo = isVideoSrc(src);
  const pos = objectPosition || 'top';

  if (isVideo) {
    return (
      <VideoWithBlur src={src} className={`w-full h-full object-cover object-${pos}`} eager={eager} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? '(min-width: 640px) 704px, 100vw'}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL ?? undefined}
      className="object-cover"
      style={{ objectPosition: pos }}
    />
  );
}

export function VideoWithBlur({ src, className, eager }: { src: string; className: string; eager?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager ?? false);
  const poster = src.replace('/img/', '/webp/').replace(/\.(mp4|webm)$/, '-poster.webp');

  // Lazy load: only start loading video when near viewport
  useEffect(() => {
    if (eager) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!inView) return;
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.readyState >= 2) { setLoaded(true); return; }
    const handler = () => setLoaded(true);
    vid.addEventListener('loadeddata', handler);
    return () => vid.removeEventListener('loadeddata', handler);
  }, [inView]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Poster frame — shows instantly while video loads */}
      <img
        src={poster}
        alt=""
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        className={`absolute inset-0 w-full h-full object-cover ${className.includes('object-top') ? 'object-top' : ''} transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />
      {inView && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

export function MobileFrame({ src, alt, transparent, eager, blurDataURL }: { src: string; alt: string; transparent?: boolean; eager?: boolean; blurDataURL?: string | null }) {
  const isVideo = isVideoSrc(src);
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(32);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      // ~8% of width, matching Figma ratio (32px on 402px)
      setRadius(Math.round(entry.contentRect.width * 0.08));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Squircle
        cornerRadius={radius}
        cornerSmoothing={1}
        className={`relative overflow-hidden ${transparent ? 'bg-transparent' : 'bg-neutral-200'}`}
        style={{ aspectRatio: '9 / 19.5' }}
      >
        {isVideo ? (
          <VideoWithBlur src={src} className="absolute inset-0 w-full h-full object-cover" eager={eager} />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 220px, 50vw"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL ?? undefined}
            className="object-cover"
          />
        )}
      </Squircle>
    </div>
  );
}

/** Presentation-only card — no grid/layout logic */
export function WorkCardContent({ item, mediaOnly, hideTitle, hideDescription }: { item: WorkItem; mediaOnly?: boolean; hideTitle?: boolean; hideDescription?: boolean }) {
  const isSingle = item.src.length === 1;
  const isMobileSingle = isSingle && item.ratio === '1:1';

  const blur = item.blurDataURLs ?? [];

  // mediaOnly: fills an absolute-positioned parent, no wrapper card or text
  if (mediaOnly) {
    return (
      <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800">
        {isMobileSingle ? (
          <div className="h-full flex items-center justify-center">
            <div className="h-[85%]" style={{ aspectRatio: '9 / 19.5' }}>
              <MobileFrame src={item.src[0]} alt={item.title} eager blurDataURL={blur[0]} />
            </div>
          </div>
        ) : isSingle ? (
          <SingleMedia src={item.src[0]} alt={item.title} objectPosition={item.objectPosition} eager sizes="(min-width: 860px) 320px, 100vw" blurDataURL={blur[0]} />
        ) : (
          <div className="h-full flex items-center justify-center gap-3 px-10 py-8">
            {item.src.map((src, j) => (
              <div key={j} className="h-full" style={{ aspectRatio: '9 / 19.5' }}>
                <MobileFrame src={src} alt={`${item.title} ${j + 1}`} eager blurDataURL={blur[j]} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Media */}
      {isMobileSingle ? (
        <div
          className="rounded-lg overflow-hidden flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="h-[85%]" style={{ aspectRatio: '9 / 19.5' }}>
            <MobileFrame src={item.src[0]} alt={item.title} blurDataURL={blur[0]} />
          </div>
        </div>
      ) : isSingle ? (
        <div
          className="rounded-lg overflow-hidden relative border border-neutral-100 dark:border-neutral-800"
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: '#f5f5f5',
          }}
        >
          <SingleMedia src={item.src[0]} alt={item.title} objectPosition={item.objectPosition} blurDataURL={blur[0]} />
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="h-full flex items-center justify-center gap-3 px-10 py-8">
            {item.src.map((src, j) => (
              <div key={j} className="h-full" style={{ aspectRatio: '9 / 19.5' }}>
                <MobileFrame src={src} alt={`${item.title} ${j + 1}`} blurDataURL={blur[j]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {(!hideTitle || (item.description && !hideDescription)) && <div className="flex items-center mt-4">
        {!hideTitle && item.logo && (
          <Image
            src={item.logo}
            alt=""
            width={14}
            height={14}
            className="shrink-0 mr-[4px]"
          />
        )}
        {!hideTitle && (item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100"
          >
            {item.title}
          </a>
        ) : (
          <span className="text-sm font-medium">{item.title}</span>
        ))}
        {item.description && !hideDescription && (
          <>
            {!hideTitle && <span className="text-sm leading-5 text-neutral-300 dark:text-neutral-600 mx-[4px]">·</span>}
            <span className="text-sm leading-5 text-neutral-500">{item.description}</span>
          </>
        )}
      </div>}
    </div>
  );
}

