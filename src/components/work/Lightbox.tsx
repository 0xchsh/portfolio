'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Squircle } from '@squircle-js/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkItem } from '@/app/work/page';
import { VideoWithBlur, MobileFrame } from './WorkCard';

function DesktopFrame({ src, alt, blurDataURL }: { src: string; alt: string; blurDataURL?: string | null }) {
  const isVideo = src.endsWith('.mp4');
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(16);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setRadius(Math.round(entry.contentRect.width * 0.02));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Squircle
        cornerRadius={radius}
        cornerSmoothing={1}
        className="relative overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        {isVideo ? (
          <VideoWithBlur src={src} className="absolute inset-0 w-full h-full object-cover object-top" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="80vw"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL || undefined}
          />
        )}
      </Squircle>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    setIsMobile(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export function Lightbox({
  item,
  isOpen,
  onClose,
}: {
  item: WorkItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const lastItem = useRef<WorkItem | null>(null);
  if (item) lastItem.current = item;
  const displayItem = item || lastItem.current;

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  // Lock body scroll
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobile, handleKeyDown]);

  // Don't render on mobile or if no item ever set
  if (isMobile || !displayItem) return null;

  const isSingle = displayItem.src.length === 1;
  const isMobileSingle = isSingle && displayItem.ratio === '1:1';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          >
            {/* Media */}
            {isMobileSingle ? (
              <div className="max-h-[calc(100%-2rem)] pointer-events-auto" style={{ height: '60%', aspectRatio: '9 / 19.5' }}>
                <MobileFrame
                  src={displayItem.src[0]}
                  alt={displayItem.title}
                  blurDataURL={displayItem.blurDataURLs?.[0]}
                  transparent
                />
              </div>
            ) : isSingle ? (
              <div className="max-h-[calc(100%-2rem)] max-w-full pointer-events-auto" style={{ height: '70%', aspectRatio: '16 / 9' }}>
                <DesktopFrame
                  src={displayItem.src[0]}
                  alt={displayItem.title}
                  blurDataURL={displayItem.blurDataURLs?.[0]}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 max-h-[calc(100%-2rem)] pointer-events-auto" style={{ height: '70%' }}>
                {displayItem.src.map((src, j) => (
                  <div
                    key={j}
                    className="h-full"
                    style={{ aspectRatio: '9 / 19.5' }}
                  >
                    <MobileFrame
                      src={src}
                      alt={`${displayItem.title} ${j + 1}`}
                      blurDataURL={displayItem.blurDataURLs?.[j]}
                      transparent
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="flex items-center gap-1 mt-3 pointer-events-auto">
              {displayItem.logo && (
                <Image
                  src={displayItem.logo}
                  alt=""
                  width={14}
                  height={14}
                  className="shrink-0"
                />
              )}
              <span className="text-sm font-medium text-white">
                {displayItem.title}
              </span>
              {displayItem.description && (
                <>
                  <span className="text-sm text-neutral-400">·</span>
                  <span className="text-sm text-neutral-400">
                    {displayItem.description}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
