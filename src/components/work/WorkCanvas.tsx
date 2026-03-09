'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type { WorkItem } from '@/app/work/page';
import { WorkCardContent } from './WorkCard';
import { Lightbox } from './Lightbox';

// ── Seeded shuffle ──────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const COLS = 4;

function shuffleItems(items: WorkItem[]): WorkItem[] {
  const rand = seededRandom(7);
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Fix adjacency: no same-title cards next to each other (horizontal or vertical)
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < shuffled.length; i++) {
      const neighbors = [i - 1, i + 1, i - COLS, i + COLS];
      for (const n of neighbors) {
        if (n < 0 || n >= shuffled.length) continue;
        if (shuffled[i].title === shuffled[n].title) {
          for (let k = 0; k < shuffled.length; k++) {
            if (k === i || k === n) continue;
            const kNeighbors = [k - 1, k + 1, k - COLS, k + COLS];
            const wouldConflict = kNeighbors.some(
              (c) => c >= 0 && c < shuffled.length && shuffled[c].title === shuffled[i].title,
            );
            const iWouldConflict = neighbors.some(
              (c) => c >= 0 && c < shuffled.length && c !== n && shuffled[c].title === shuffled[k].title,
            );
            if (!wouldConflict && !iWouldConflict) {
              [shuffled[i], shuffled[k]] = [shuffled[k], shuffled[i]];
              break;
            }
          }
        }
      }
    }
  }

  return shuffled;
}

// ── Layout constants ────────────────────────────────────────────────────────

const CARD_W = 760;
const GAP = 48;
const BUFFER = 800;

// Uniform card height — all cards render as 16:9 on the canvas.
// The lightbox shows full detail. This guarantees all columns are
// the same height, so vertical tiling is seamless with zero gaps.
const CARD_H = Math.round(CARD_W * (9 / 16)) + 32; // media + info bar
const COL_W = CARD_W + GAP;
const ROW_H = CARD_H + GAP;

type PlacedCard = { x: number; y: number; idx: number };

function computeLayout(items: WorkItem[]) {
  // Place items in a grid, column by column (left-to-right, top-to-bottom)
  const cards: PlacedCard[] = [];
  const rows = Math.ceil((items.length * 2) / COLS);

  for (let i = 0; i < rows * COLS; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const idx = i % items.length;
    cards.push({ x: col * COL_W, y: row * ROW_H, idx });
  }

  const tileW = COLS * COL_W;
  const tileH = rows * ROW_H;

  return { cards, tileW, tileH };
}

// ── Momentum physics ────────────────────────────────────────────────────────

const FRICTION = 0.92;
const MIN_VELOCITY = 0.5;

// ── Component ───────────────────────────────────────────────────────────────

export function WorkCanvas({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);
  const [cursorStyle, setCursorStyle] = useState<'grab' | 'grabbing'>('grab');

  const shuffled = useMemo(() => shuffleItems(items), [items]);
  const { cards, tileW, tileH } = useMemo(() => computeLayout(shuffled), [shuffled]);

  // All mutable interaction state lives in refs — no re-renders during drag/scroll
  const pos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const animFrame = useRef(0);
  const visibleRef = useRef<{ tiles: string; vw: number; vh: number }>({ tiles: '', vw: 0, vh: 0 });

  // Wrap offset into tile space
  const wrap = useCallback(
    (x: number, y: number) => ({
      x: ((x % tileW) + tileW) % tileW,
      y: ((y % tileH) + tileH) % tileH,
    }),
    [tileW, tileH],
  );

  // ── Apply transform without React re-render ────────────────────────────
  const applyTransform = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;

    const w = wrap(pos.current.x, pos.current.y);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Update tile container positions
    const tilesX = Math.ceil(vw / tileW) + 2;
    const tilesY = Math.ceil(vh / tileH) + 2;

    // Build the set of needed tiles
    const neededTiles: { tx: number; ty: number }[] = [];
    for (let tx = -1; tx < tilesX; tx++) {
      for (let ty = -1; ty < tilesY; ty++) {
        neededTiles.push({ tx, ty });
      }
    }

    // Check if tile grid changed (viewport resize)
    const tileKey = `${tilesX},${tilesY}`;
    if (tileKey !== visibleRef.current.tiles || vw !== visibleRef.current.vw || vh !== visibleRef.current.vh) {
      visibleRef.current = { tiles: tileKey, vw, vh };
      // Force a re-render to update tile DOM
      setTileGrid({ tilesX, tilesY });
    }

    // Move each tile container via transform
    const children = el.children;
    let childIdx = 0;
    for (let tx = -1; tx < tilesX; tx++) {
      for (let ty = -1; ty < tilesY; ty++) {
        const child = children[childIdx] as HTMLElement | undefined;
        if (child) {
          child.style.translate = `${w.x + tx * tileW}px ${w.y + ty * tileH}px`;
        }
        childIdx++;
      }
    }
  }, [wrap, tileW, tileH]);

  // Tile grid state — only changes on resize, not on drag
  const [tileGrid, setTileGrid] = useState({ tilesX: 3, tilesY: 3 });

  // ── Momentum loop ──────────────────────────────────────────────────────
  const coastLoop = useCallback(() => {
    if (dragging.current) return;
    const vx = velocity.current.x;
    const vy = velocity.current.y;
    if (Math.abs(vx) < MIN_VELOCITY && Math.abs(vy) < MIN_VELOCITY) {
      velocity.current = { x: 0, y: 0 };
      return;
    }
    pos.current.x += vx;
    pos.current.y += vy;
    velocity.current.x *= FRICTION;
    velocity.current.y *= FRICTION;
    applyTransform();
    animFrame.current = requestAnimationFrame(coastLoop);
  }, [applyTransform]);

  // ── Pointer handlers (no React state updates during drag) ──────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      if (lightboxItem) return;
      cancelAnimationFrame(animFrame.current);
      velocity.current = { x: 0, y: 0 };
      dragging.current = true;
      dragStart.current = {
        x: e.clientX, y: e.clientY,
        posX: pos.current.x, posY: pos.current.y,
      };
      lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      setCursorStyle('grabbing');
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      pos.current.x = dragStart.current.posX + dx;
      pos.current.y = dragStart.current.posY + dy;

      // Track velocity from last 2 pointer samples
      const now = performance.now();
      const dt = now - lastPointer.current.t;
      if (dt > 0) {
        velocity.current = {
          x: (e.clientX - lastPointer.current.x) / Math.max(dt, 1) * 16,
          y: (e.clientY - lastPointer.current.y) / Math.max(dt, 1) * 16,
        };
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
      applyTransform();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      setCursorStyle('grab');

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 5) {
        // This was a click, not a drag
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target) {
          const cardEl = (target as HTMLElement).closest('[data-work-item]');
          if (cardEl) {
            const idx = Number(cardEl.getAttribute('data-work-item'));
            if (!isNaN(idx)) setLightboxItem(shuffled[idx]);
            return;
          }
        }
      }

      // Clamp velocity to avoid crazy flings
      const maxV = 40;
      velocity.current.x = Math.max(-maxV, Math.min(maxV, velocity.current.x));
      velocity.current.y = Math.max(-maxV, Math.min(maxV, velocity.current.y));
      animFrame.current = requestAnimationFrame(coastLoop);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      cancelAnimationFrame(animFrame.current);
    };
  }, [lightboxItem, shuffled, applyTransform, coastLoop]);

  // ── Wheel handler (no React re-render) ─────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(animFrame.current);
      velocity.current = { x: 0, y: 0 };
      pos.current.x -= e.deltaX;
      pos.current.y -= e.deltaY;
      applyTransform();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyTransform]);

  // ── Center on mount ────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pos.current = {
      x: (rect.width - tileW) / 2,
      y: (rect.height - tileH) / 2,
    };
    applyTransform();
  }, [tileW, tileH, applyTransform]);

  // ── Resize handler ─────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => applyTransform();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyTransform]);

  // ── Build tile grid ────────────────────────────────────────────────────
  const tileElements = useMemo(() => {
    const tiles: { tx: number; ty: number }[] = [];
    for (let tx = -1; tx < tileGrid.tilesX; tx++) {
      for (let ty = -1; ty < tileGrid.tilesY; ty++) {
        tiles.push({ tx, ty });
      }
    }
    return tiles;
  }, [tileGrid]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ cursor: cursorStyle, userSelect: 'none' }}
    >
      <div ref={canvasRef}>
        {tileElements.map(({ tx, ty }) => (
          <div
            key={`${tx}-${ty}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: tileW,
              height: tileH,
              willChange: 'translate',
            }}
          >
            {cards.map((c, i) => (
              <div
                key={i}
                className="absolute cursor-pointer overflow-hidden"
                data-work-item={c.idx}
                style={{
                  left: c.x,
                  top: c.y,
                  width: CARD_W,
                  height: CARD_H,
                }}
              >
                <WorkCardContent item={shuffled[c.idx]} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <Lightbox
        item={lightboxItem}
        isOpen={!!lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}
