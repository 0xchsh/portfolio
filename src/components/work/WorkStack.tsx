'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowSquareUp, ArrowSquareDown } from '@phosphor-icons/react';
import type { WorkItem } from '@/app/work/page';
import { SingleMedia, MobileFrame } from './WorkCard';

const EASING = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const DURATION = 350;
const WHEEL_THRESHOLD = 20;

function CardMedia({ item }: { item: WorkItem }) {
  const isSingle = item.src.length === 1;
  const isMobileSingle = isSingle && item.ratio === '1:1';

  if (isMobileSingle) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-neutral-100"
        style={{ aspectRatio: '16 / 9' }}
      >
        <div className="w-[22%]">
          <MobileFrame src={item.src[0]} alt={item.title} blurDataURL={item.blurDataURLs?.[0]} />
        </div>
      </div>
    );
  }

  if (isSingle) {
    return (
      <div
        className="w-full h-full relative"
        style={{ aspectRatio: '16 / 9', backgroundColor: '#f5f5f5' }}
      >
        <SingleMedia
          src={item.src[0]}
          alt={item.title}
          blurDataURL={item.blurDataURLs?.[0]}
          objectPosition={item.objectPosition}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-neutral-100"
      style={{ aspectRatio: '16 / 9' }}
    >
      <div className="h-full flex items-center justify-center gap-3 px-10 py-8">
        {item.src.map((src, j) => (
          <div key={j} className="h-full" style={{ aspectRatio: '9 / 19.5' }}>
            <MobileFrame src={src} alt={`${item.title} ${j + 1}`} blurDataURL={item.blurDataURLs?.[j]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoBar({ item, animating }: { item: WorkItem; animating: boolean }) {
  return (
    <div className="flex items-center justify-between mt-3">
      <div
        className="flex items-center gap-1"
        style={{
          filter: animating ? 'blur(4px)' : 'blur(0px)',
          opacity: animating ? 0.3 : 1,
          transform: animating ? 'translateY(2px)' : 'translateY(0)',
          transition: animating
            ? `filter 80ms ease-out, opacity 80ms ease-out, transform 80ms ease-out`
            : `filter 150ms ${EASING}, opacity 150ms ${EASING}, transform 150ms ${EASING}`,
        }}
      >
        {item.logo && (
          <Image src={item.logo} alt="" width={14} height={14} className="shrink-0" />
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
      <span className="flex items-center text-sm text-neutral-400">
        <ArrowSquareUp weight="bold" size={14} />
        <ArrowSquareDown weight="bold" size={14} className="ml-0.5" />
        <span className="ml-1.5">to navigate</span>
      </span>
    </div>
  );
}

function Pagination({ total, current, onNavigate }: { total: number; current: number; onNavigate: (index: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Clear hover when current changes (keyboard nav)
  useEffect(() => { setHovered(null); }, [current]);

  return (
    <div className="flex items-center mr-6">
      <div className="flex flex-col items-center" style={{ gap: 2 }}>
        {Array.from({ length: total }).map((_, i) => {
          const active = i === current;
          const isHovered = hovered === i && !active;
          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer border-0 bg-transparent flex items-center justify-center"
              aria-label={`Go to item ${i + 1}`}
            >
              <div
                style={{
                  width: active ? 10 : 8,
                  height: active ? 16 : isHovered ? 8 : 2,
                  borderRadius: active ? 4 : isHovered ? 2 : 4,
                  backgroundColor: active ? '#171717' : '#d4d4d4',
                  transition: `width 150ms ${EASING}, height 150ms ${EASING}, background-color 150ms ${EASING}, border-radius 150ms ${EASING}`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Stack positions: front (0), middle (1), back (2), hidden (offscreen/faded)
const STACK_CONFIG = [
  { scale: 1, translateY: 0, blur: 0, opacity: 1, z: 30 },
  { scale: 0.96, translateY: -20, blur: 1.5, opacity: 0.6, z: 20 },
  { scale: 0.92, translateY: -40, blur: 3, opacity: 0.35, z: 10 },
];
const HIDDEN_CONFIG = { scale: 0.88, translateY: -50, blur: 6, opacity: 0, z: 0 };

const STORAGE_KEY = 'work-stack-index';

function getStoredIndex(max: number): number {
  try {
    const v = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
    return v >= 0 && v < max ? v : 0;
  } catch { return 0; }
}

export function WorkStack({ items }: { items: WorkItem[] }) {
  const [activeIndex, setActiveIndex] = useState(() => getStoredIndex(items.length));
  const [isAnimating, setIsAnimating] = useState(false);
  const [infoAnimating, setInfoAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(() => getStoredIndex(items.length));
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Persist index to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, String(activeIndex)); } catch {}
  }, [activeIndex]);


  const navigate = useCallback((direction: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Blur out the info bar
    setInfoAnimating(true);

    const next = (activeIndex + direction + items.length) % items.length;
    setActiveIndex(next);

    // Swap info text mid-transition
    const swapDelay = reducedMotion.current ? 0 : 80;
    setTimeout(() => {
      setDisplayIndex(next);
      requestAnimationFrame(() => setInfoAnimating(false));
    }, swapDelay);

    // Unlock after transition
    const unlockDelay = reducedMotion.current ? 0 : DURATION;
    setTimeout(() => setIsAnimating(false), unlockDelay);
  }, [isAnimating, activeIndex, items.length]);

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setInfoAnimating(true);
    setActiveIndex(index);

    const swapDelay = reducedMotion.current ? 0 : 80;
    setTimeout(() => {
      setDisplayIndex(index);
      requestAnimationFrame(() => setInfoAnimating(false));
    }, swapDelay);

    const unlockDelay = reducedMotion.current ? 0 : DURATION;
    setTimeout(() => setIsAnimating(false), unlockDelay);
  }, [isAnimating, activeIndex]);

  // Wheel handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [navigate]);

  // Keyboard handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  // Compute stack position for each item (distance from active, with wrapping)
  function getStackPos(itemIndex: number): number {
    const diff = (itemIndex - activeIndex + items.length) % items.length;
    return diff; // 0 = front, 1 = middle, 2 = back, 3+ = hidden
  }

  // Render a window of items: the 3 visible + the previous one (for fade-out)
  const prevIndex = (activeIndex - 1 + items.length) % items.length;
  const renderedIndices = new Set([
    activeIndex,
    (activeIndex + 1) % items.length,
    (activeIndex + 2) % items.length,
    prevIndex,
  ]);

  const duration = reducedMotion.current ? '0ms' : `${DURATION}ms`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{ paddingTop: 72, paddingBottom: 72 }}
    >
      <div className="flex items-center max-w-[860px] w-full">
        {/* Pagination */}
        <Pagination total={items.length} current={activeIndex} onNavigate={goTo} />

        {/* Stack + Info */}
        <div className="flex-1 min-w-0">
          {/* Card stack */}
          <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            {Array.from(renderedIndices).map((itemIndex) => {
              const stackPos = getStackPos(itemIndex);
              const config = stackPos < 3 ? STACK_CONFIG[stackPos] : HIDDEN_CONFIG;
              const item = items[itemIndex];

              return (
                <div
                  key={itemIndex}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)]"
                  style={{
                    zIndex: config.z,
                    transform: `scale(${config.scale}) translateY(${config.translateY}px)`,
                    opacity: config.opacity,
                    transition: `transform ${duration} ${EASING}, opacity ${duration} ${EASING}`,
                    transformOrigin: 'center center',
                    pointerEvents: stackPos === 0 ? 'auto' : 'none',
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      filter: reducedMotion.current ? 'none' : `blur(${config.blur}px)`,
                      transition: `filter ${duration} ${EASING}`,
                    }}
                  >
                    <CardMedia item={item} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info bar */}
          <InfoBar item={items[displayIndex]} animating={infoAnimating} />
        </div>
      </div>

    </div>
  );
}
