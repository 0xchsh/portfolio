'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Squircle } from '@squircle-js/react';
import type { WorkItem } from '@/app/work/page';
import { Lightbox } from './Lightbox';

function SingleMedia({ src, alt, blurDataURL }: { src: string; alt: string; blurDataURL?: string | null }) {
  const isVideo = src.endsWith('.mp4');

  if (isVideo) {
    return (
      <VideoWithBlur src={src} className="w-full h-full object-cover object-top" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="(max-width: 640px) 100vw, (max-width: 860px) 50vw, 33vw"
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL || undefined}
    />
  );
}

export function VideoWithBlur({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    // Handle already-loaded (cached) videos
    if (vid.readyState >= 2) {
      setLoaded(true);
      return;
    }
    const handler = () => setLoaded(true);
    vid.addEventListener('loadeddata', handler);
    return () => vid.removeEventListener('loadeddata', handler);
  }, []);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 shimmer-bg" />
      )}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}

export function MobileFrame({ src, alt, blurDataURL, transparent }: { src: string; alt: string; blurDataURL?: string | null; transparent?: boolean }) {
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
            className="object-cover"
            sizes="(max-width: 640px) 33vw, 15vw"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL || undefined}
          />
        )}
      </Squircle>
    </div>
  );
}

// Grid masonry: grid-auto-rows=1px, gap=12px (gap-3)
// span = ceil((contentHeight + gap) / (rowHeight + gap))
function computeSpan(height: number) {
  return Math.ceil((height + 12) / 13);
}

export function WorkCard({ item }: { item: WorkItem }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [span, setSpan] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setSpan(computeSpan(el.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isSingle = item.src.length === 1;
  const isMobileSingle = isSingle && item.ratio === '1:1';

  return (
    <div style={span > 0 ? { gridRowEnd: `span ${span}` } : undefined}>
    <div ref={contentRef}>
      {/* Media */}
      {isMobileSingle ? (
        <div
          className="rounded-xl overflow-hidden flex items-center justify-center bg-neutral-100 border border-neutral-200 sm:cursor-pointer"
          style={{ aspectRatio: '1 / 1' }}
          onClick={() => setIsOpen(true)}
        >
          <div className="w-[36%]">
            <MobileFrame src={item.src[0]} alt={item.title} blurDataURL={item.blurDataURLs?.[0]} />
          </div>
        </div>
      ) : isSingle ? (
        <div
          className="rounded-xl overflow-hidden relative border border-neutral-200 sm:cursor-pointer"
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: '#f5f5f5',
          }}
          onClick={() => setIsOpen(true)}
        >
          <SingleMedia src={item.src[0]} alt={item.title} blurDataURL={item.blurDataURLs?.[0]} />
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 sm:cursor-pointer"
          style={{ aspectRatio: '16 / 9' }}
          onClick={() => setIsOpen(true)}
        >
          <div className="h-full flex items-center justify-center gap-3 px-10 py-8">
            {item.src.map((src, j) => (
              <div key={j} className="h-full" style={{ aspectRatio: '9 / 19.5' }}>
                <MobileFrame src={src} alt={`${item.title} ${j + 1}`} blurDataURL={item.blurDataURLs?.[j]} />
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
      <Lightbox item={item} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
    </div>
  );
}
