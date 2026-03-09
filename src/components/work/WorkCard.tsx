'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Squircle } from '@squircle-js/react';
import type { WorkItem } from '@/app/work/page';

export function SingleMedia({ src, alt, objectPosition }: { src: string; alt: string; objectPosition?: string }) {
  const isVideo = src.endsWith('.mp4');
  const pos = objectPosition || 'top';

  if (isVideo) {
    return (
      <VideoWithBlur src={src} className={`w-full h-full object-cover object-${pos}`} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-cover"
      style={{ objectPosition: pos }}
    />
  );
}

export function VideoWithBlur({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const poster = src.replace('.mp4', '-poster.webp');

  // Lazy load: only start loading video when near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

export function MobileFrame({ src, alt, transparent }: { src: string; alt: string; transparent?: boolean }) {
  const isVideo = src.endsWith('.mp4');
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
          <VideoWithBlur src={src} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </Squircle>
    </div>
  );
}

/** Presentation-only card — no grid/layout logic */
export function WorkCardContent({ item }: { item: WorkItem }) {
  const isSingle = item.src.length === 1;
  const isMobileSingle = isSingle && item.ratio === '1:1';

  return (
    <>
      {/* Media */}
      {isMobileSingle ? (
        <div
          className="rounded-xl overflow-hidden flex items-center justify-center bg-neutral-100 border border-neutral-200"
          style={{ aspectRatio: '1 / 1' }}
        >
          <div className="w-[36%]">
            <MobileFrame src={item.src[0]} alt={item.title} />
          </div>
        </div>
      ) : isSingle ? (
        <div
          className="rounded-xl overflow-hidden relative border border-neutral-200"
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: '#f5f5f5',
          }}
        >
          <SingleMedia src={item.src[0]} alt={item.title} objectPosition={item.objectPosition} />
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="h-full flex items-center justify-center gap-3 px-10 py-8">
            {item.src.map((src, j) => (
              <div key={j} className="h-full" style={{ aspectRatio: '9 / 19.5' }}>
                <MobileFrame src={src} alt={`${item.title} ${j + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex items-center gap-1 mt-2 mb-1">
        {item.logo && (
          <Image
            src={item.logo}
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
        )}
        {item.link ? (
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
        )}
        {item.description && (
          <>
            <span className="text-sm text-neutral-400">·</span>
            <span className="text-sm text-neutral-400">{item.description}</span>
          </>
        )}
      </div>
    </>
  );
}

