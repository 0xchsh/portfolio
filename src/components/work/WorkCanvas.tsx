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
const GAP = 48;
const COLS = 4;

// Estimate card height based on its content type
function estimateCardHeight(item: WorkItem): number {
  const isSingle = item.src.length === 1;
  const isMobileSingle = isSingle && item.ratio === '1:1';
  const infoBarHeight = 32;

  if (isMobileSingle) {
    // Square aspect ratio
    return CARD_WIDTH + infoBarHeight;
  }
  // 16:9 aspect ratio (both single desktop and multi-phone)
  return Math.round(CARD_WIDTH * (9 / 16)) + infoBarHeight;
}

function computeMasonryPositions(items: WorkItem[]) {
  const colWidth = CARD_WIDTH + GAP;
  // Track the bottom edge of each column
  const colBottoms = new Array(COLS).fill(0);
  const positions: { x: number; y: number; h: number }[] = [];

  for (let i = 0; i < items.length; i++) {
    // Place in the shortest column
    const col = colBottoms.indexOf(Math.min(...colBottoms));
    const x = col * colWidth;
    const y = colBottoms[col];
    const h = estimateCardHeight(items[i]);

    positions.push({ x, y, h });
    colBottoms[col] = y + h + GAP;
  }

  const tileWidth = COLS * colWidth;
  const tileHeight = Math.max(...colBottoms);

  return { positions, tileWidth, tileHeight };
}

export function WorkCanvas({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const shuffled = useMemo(() => shuffleItems(items), [items]);

  const { positions, tileWidth, tileHeight } = useMemo(
    () => computeMasonryPositions(shuffled),
    [shuffled],
  );

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
                left: positions[i].x,
                top: positions[i].y,
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
