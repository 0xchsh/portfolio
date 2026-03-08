'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type { WorkItem } from '@/app/work/page';
import { WorkCard } from './WorkCard';

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

const CARD_WIDTH = 380;
const GAP_X = 48;
const GAP_Y = 56;
const COLS = 4;

export function WorkCanvas({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const shuffled = useMemo(() => shuffleItems(items), [items]);

  const { cellPositions, tileWidth, tileHeight } = useMemo(() => {
    const rows = Math.ceil(shuffled.length / COLS);
    const colWidth = CARD_WIDTH + GAP_X;
    const cardHeight = Math.round(CARD_WIDTH * (9 / 16)) + 40;
    const rowHeight = cardHeight + GAP_Y;

    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      positions.push({
        x: col * colWidth,
        y: row * rowHeight,
      });
    }

    return {
      cellPositions: positions,
      tileWidth: COLS * colWidth,
      tileHeight: rows * rowHeight,
    };
  }, [shuffled.length]);

  const wrap = useCallback(
    (ox: number, oy: number) => ({
      x: ((ox % tileWidth) + tileWidth) % tileWidth,
      y: ((oy % tileHeight) + tileHeight) % tileHeight,
    }),
    [tileWidth, tileHeight],
  );

  // Center on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startX = (rect.width - tileWidth) / 2;
    const startY = (rect.height - tileHeight) / 2;
    offsetRef.current = { x: startX, y: startY };
    setOffset({ x: startX, y: startY });
  }, [tileWidth, tileHeight]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    isDragging.current = true;
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
    offsetRef.current = {
      x: dragStart.current.offsetX + (e.clientX - dragStart.current.x),
      y: dragStart.current.offsetY + (e.clientY - dragStart.current.y),
    };
    setOffset({ ...offsetRef.current });
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      offsetRef.current = {
        x: offsetRef.current.x - e.deltaX,
        y: offsetRef.current.y - e.deltaY,
      };
      setOffset({ ...offsetRef.current });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const tiles = [
    { tx: -1, ty: -1 }, { tx: 0, ty: -1 }, { tx: 1, ty: -1 },
    { tx: -1, ty: 0 },  { tx: 0, ty: 0 },  { tx: 1, ty: 0 },
    { tx: -1, ty: 1 },  { tx: 0, ty: 1 },  { tx: 1, ty: 1 },
  ];

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
