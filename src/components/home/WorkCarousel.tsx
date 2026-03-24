'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import workData from '@/data/work.json';
import type { WorkItem } from '@/app/work/page';
import { WorkCardContent } from '@/components/work/WorkCard';

const ALLOWED = new Set([
  'AI Design Jobs', 'Freighter', 'by.computer', 'Higher',
  'Checkmate', 'Laboratory', 'Rat Labs', 'RGB', 'Eco', 'Snack',
]);

const PREFERRED: Record<string, string> = {
  Freighter: 'Home',
  Snack: 'Dashboard',
};

const allWork = workData as WorkItem[];
const baseSlides = Array.from(ALLOWED).map((title) => {
  const preferred = PREFERRED[title];
  if (preferred) {
    const found = allWork.find((w) => w.title === title && w.description === preferred);
    if (found) return found;
  }
  return allWork.find((w) => w.title === title);
}).filter((w): w is WorkItem => w !== undefined);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Exiting slide pushes down; incoming slide is already in place behind it
const EXIT_ANIM = 'push-down-out 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards';

export function WorkCarousel() {
  const [slides, setSlides] = useState<WorkItem[]>(baseSlides);
  const indexRef    = useRef(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);

  // Shuffle before first paint — stable SSR, randomised on client
  useLayoutEffect(() => {
    setSlides(shuffle([...baseSlides]));
  }, []);

  const advance = useCallback(() => {
    const prev = indexRef.current;
    const next = (prev + 1) % slides.length;
    indexRef.current = next;
    setCurrentIdx(next);
    setExitingIdx(prev);
  }, [slides.length]);

  // Apply both animations synchronously before paint
  useLayoutEffect(() => {
    if (exitingIdx === null) return;

    // Outgoing: push down and out
    const exitEl = slideRefs.current[exitingIdx];
    if (exitEl) {
      exitEl.style.animation = 'none';
      void exitEl.getBoundingClientRect();
      exitEl.style.animation = EXIT_ANIM;
    }

    // Incoming: already in place, clear any prior animation
    const enterEl = slideRefs.current[currentIdx];
    if (enterEl) {
      enterEl.style.animation = 'none';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exitingIdx]);

  useEffect(() => {
    const id = setTimeout(advance, 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative w-full aspect-video rounded-[8px] overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.04)]"
      style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
    >
      {slides.map((slide, i) => {
        const isExiting  = i === exitingIdx;
        const isCurrent  = i === currentIdx;
        return (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{
              zIndex: isExiting ? 2 : isCurrent ? 1 : 0,
              opacity: isExiting || isCurrent ? 1 : 0,
            }}
            // Only the exiting slide fires advance — entering fires too but we ignore it
            onAnimationEnd={isExiting ? advance : undefined}
          >
            <WorkCardContent item={slide} mediaOnly />
          </div>
        );
      })}

      {/* Corner artifact fix — inset ring covers anti-alias bleed on rounded overflow */}
      <div className="absolute inset-0 rounded-[8px] ring-1 ring-inset ring-black/8 pointer-events-none" style={{ zIndex: 20 }} />

      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
        <Link
          href="/work"
          className="px-3.5 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-md bg-black/20 border border-white/15 shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-150 hover:bg-black/30"
        >
          View work
        </Link>
      </div>
    </div>
  );
}
