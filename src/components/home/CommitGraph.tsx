'use client';

import { useState, useRef, useCallback } from 'react';
import type { CommitDay } from '@/app/page';

function commitLevel(count: number, max: number): string {
  if (count === 0) return 'bg-neutral-200';
  const ratio = count / max;
  if (ratio <= 0.25) return 'bg-[#9be9a8]';
  if (ratio <= 0.5) return 'bg-[#40c463]';
  if (ratio <= 0.75) return 'bg-[#30a14e]';
  return 'bg-[#216e39]';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CommitGraph({ days }: { days: CommitDay[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...days.map((d) => d.count), 1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(i);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setHovered(null), 80);
  }, []);

  return (
    <div className="relative flex gap-[3px]">
      {days.map((day, i) => {
        const isHovered = hovered === i;
        const isNeighbor = hovered !== null && (hovered === i - 1 || hovered === i + 1);

        return (
          <div
            key={day.date}
            className="relative flex-1 group h-5 flex items-center"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          >
            {/* Bar */}
            <div
              className={`w-full rounded-sm ${commitLevel(day.count, max)}`}
              style={{
                height: isHovered ? 12 : isNeighbor ? 16 : 20,
                transition: isHovered || isNeighbor
                  ? 'height 150ms cubic-bezier(0.215, 0.61, 0.355, 1)'
                  : 'height 100ms ease',
              }}
            />

            {/* Tooltip — always mounted, animated via opacity + translate */}
            <div
              className="absolute bottom-full left-1/2 mb-2 z-50 pointer-events-none"
              style={{
                transform: `translateX(-50%) translateY(${isHovered ? '0px' : '4px'})`,
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
                      <p className="text-neutral-400 font-mono text-[10px]">
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
