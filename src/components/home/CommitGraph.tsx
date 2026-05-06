'use client';

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import type { CommitDay } from '@/app/page';
import { playTick } from '@/lib/tick';

function commitLevel(count: number, max: number): string {
  if (count === 0) return 'bg-neutral-200 dark:bg-neutral-800';
  const ratio = count / max;
  if (ratio <= 0.25) return 'bg-green-300 dark:bg-green-900';
  if (ratio <= 0.5) return 'bg-green-500 dark:bg-green-700';
  if (ratio <= 0.75) return 'bg-green-600 dark:bg-green-500';
  return 'bg-green-800 dark:bg-green-400';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CommitGraph({ days }: { days: CommitDay[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const max = Math.max(...days.map((d) => d.count), 1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offsets, setOffsets] = useState<number[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Clamp tooltip positions so edge tooltips don't overflow the container
  useLayoutEffect(() => {
    if (!mounted) return;
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cw = container.getBoundingClientRect().width;
      const next = days.map((_, i) => {
        const tip = tooltipRefs.current[i];
        const bar = container.children[i] as HTMLElement | undefined;
        if (!tip || !bar) return 0;
        const tipW = tip.offsetWidth;
        const barCenter = bar.offsetLeft + bar.offsetWidth / 2;
        const left = barCenter - tipW / 2;
        const right = barCenter + tipW / 2;
        if (left < 0) return -left;
        if (right > cw) return cw - right;
        return 0;
      });
      setOffsets(next);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [mounted, days]);

  const handleEnter = useCallback((i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(i);
    playTick();
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setHovered(null), 80);
  }, []);

  return (
    <div ref={containerRef} className="relative flex gap-[3px]">
      {days.map((day, i) => {
        const isHovered = hovered === i;
        const isNeighbor = hovered !== null && (hovered === i - 1 || hovered === i + 1);
        const offset = offsets[i] ?? 0;

        return (
          <div
            key={day.date}
            className="relative flex-1 group h-5 flex items-center"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          >
            {/* Bar */}
            <div
              className={`w-full rounded-[3px] ${commitLevel(day.count, max)}`}
              style={{
                height: isHovered ? 12 : isNeighbor ? 16 : 20,
                transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
                opacity: mounted ? 1 : 0,
                transition: mounted
                  ? `transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 20}ms, opacity 300ms ease ${i * 20}ms, height ${isHovered || isNeighbor ? '150ms cubic-bezier(0.215, 0.61, 0.355, 1)' : '100ms ease'}`
                  : 'none',
                transformOrigin: 'bottom',
              }}
            />

            {/* Tooltip — always mounted, animated via opacity + translate */}
            <div
              ref={(el) => { tooltipRefs.current[i] = el; }}
              className="absolute bottom-full left-1/2 mb-2 z-50 pointer-events-none"
              style={{
                transform: `translateX(calc(-50% + ${offset}px)) translateY(${isHovered ? '0px' : '4px'})`,
                opacity: isHovered ? 1 : 0,
                transition: isHovered
                  ? 'opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 150ms cubic-bezier(0.215, 0.61, 0.355, 1)'
                  : 'opacity 100ms ease, transform 100ms ease',
              }}
            >
              <div className="bg-neutral-900 text-white text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                <p>{formatDate(day.date)}</p>
                {day.count > 0 ? (
                  <>
                    <p className="text-neutral-300">
                      {day.count} commit{day.count !== 1 ? 's' : ''}
                    </p>
                    {day.repos.length > 0 && (
                      <p className="text-neutral-400 text-[10px]">
                        {day.repos.join(', ')}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-neutral-400">No commits</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
