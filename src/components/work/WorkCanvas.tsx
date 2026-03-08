'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type { WorkItem } from '@/app/work/page';
import { WorkCard } from './WorkCard';

// Seeded random for deterministic shuffle
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleItems<T>(items: T[]): T[] {
  const rand = seededRandom(7);
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const CARD_WIDTH = 400;
const GAP = 24;
const COLS = 4;
const AUTO_SPEED = 0.3; // px per frame

export function WorkCanvas({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const autoScrolling = useRef(true);
  const rafRef = useRef<number>(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

  const shuffled = useMemo(() => shuffleItems(items), [items]);

  // Build a grid layout: cols x rows, with freeform jitter
  const { cellPositions, tileWidth, tileHeight } = useMemo(() => {
    const rand = seededRandom(42);
    const rows = Math.ceil(shuffled.length / COLS);
    const colWidth = CARD_WIDTH + GAP;
    // Estimate card height as 16:9 + info bar
    const cardHeight = Math.round(CARD_WIDTH * (9 / 16)) + 48;
    const rowHeight = cardHeight + GAP;

    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const jitterX = (rand() - 0.5) * 40;
      const jitterY = (rand() - 0.5) * 30;
      positions.push({
        x: col * colWidth + jitterX,
        y: row * rowHeight + jitterY,
      });
    }

    return {
      cellPositions: positions,
      tileWidth: COLS * colWidth,
      tileHeight: rows * rowHeight,
    };
  }, [shuffled.length]);

  // Wrap offset so tiling works seamlessly
  const wrap = useCallback(
    (ox: number, oy: number) => ({
      x: ((ox % tileWidth) + tileWidth) % tileWidth,
      y: ((oy % tileHeight) + tileHeight) % tileHeight,
    }),
    [tileWidth, tileHeight],
  );

  // Auto-scroll animation
  useEffect(() => {
    const tick = () => {
      if (autoScrolling.current && !isDragging.current) {
        offsetRef.current.x -= AUTO_SPEED * 0.5;
        offsetRef.current.y -= AUTO_SPEED;
        setOffset({ ...offsetRef.current });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    isDragging.current = true;
    autoScrolling.current = false;
    clearTimeout(resumeTimer.current);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: offsetRef.current.x,
      offsetY: offsetRef.current.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    offsetRef.current = {
      x: dragStart.current.offsetX + dx,
      y: dragStart.current.offsetY + dy,
    };
    setOffset({ ...offsetRef.current });
  };

  const onPointerUp = () => {
    isDragging.current = false;
    // Resume auto-scroll after 2s of inactivity
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      autoScrolling.current = true;
    }, 2000);
  };

  // Wheel to pan (overrides auto-scroll temporarily)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      autoScrolling.current = false;
      clearTimeout(resumeTimer.current);
      offsetRef.current = {
        x: offsetRef.current.x - e.deltaX,
        y: offsetRef.current.y - e.deltaY,
      };
      setOffset({ ...offsetRef.current });
      resumeTimer.current = setTimeout(() => {
        autoScrolling.current = true;
      }, 2000);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Compute which tile copies we need to fill the viewport
  const tiles = useMemo(() => {
    if (!containerRef.current) return [{ tx: 0, ty: 0 }, { tx: 1, ty: 0 }, { tx: 0, ty: 1 }, { tx: 1, ty: 1 }, { tx: -1, ty: 0 }, { tx: 0, ty: -1 }, { tx: -1, ty: -1 }, { tx: 1, ty: -1 }, { tx: -1, ty: 1 }];
    return [{ tx: 0, ty: 0 }, { tx: 1, ty: 0 }, { tx: 0, ty: 1 }, { tx: 1, ty: 1 }, { tx: -1, ty: 0 }, { tx: 0, ty: -1 }, { tx: -1, ty: -1 }, { tx: 1, ty: -1 }, { tx: -1, ty: 1 }];
  }, []);

  const wrapped = wrap(offset.x, offset.y);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        cursor: isDragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {tiles.map(({ tx, ty }) => (
        <div
          key={`${tx}-${ty}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(${wrapped.x + tx * tileWidth}px, ${wrapped.y + ty * tileHeight}px)`,
            width: tileWidth,
            height: tileHeight,
          }}
        >
          {shuffled.map((item, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: cellPositions[i].x,
                top: cellPositions[i].y,
                width: CARD_WIDTH,
              }}
            >
              <WorkCard item={item} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
