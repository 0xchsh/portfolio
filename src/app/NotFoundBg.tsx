'use client';

import { useEffect, useRef } from 'react';

const CHARS = ['·', '+', '×', '/', '|', '-', '\\', '_', '░', '▒', '○', '◦', '∘', '×', '·'];
const CELL = 10;
const RADIUS = 180;

type Cell = {
  char: string;
  nextTick: number;
  interval: number;
};

export function NotFoundBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let grid: Cell[][] = [];
    let cols = 0, rows = 0;

    const makeCell = (now: number): Cell => ({
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      nextTick: now + 300 + Math.random() * 2400,
      interval: 400 + Math.random() * 2000,
    });

    const resize = () => {
      const now = performance.now();
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.ceil(canvas.width / CELL);
      rows = Math.ceil(canvas.height / CELL);
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => makeCell(now))
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener('mousemove', onMove);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = document.documentElement.classList.contains('dark');
      const { x: mx, y: my } = mouse.current;

      ctx.font = `${CELL * 0.72}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = dark ? '#ffffff' : '#000000';

      // slow ambient wave across the grid
      const wave = (c: number, r: number) =>
        0.5 + 0.5 * Math.sin(c / 8 + now / 2200) * Math.cos(r / 6 + now / 1800);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          const cx = c * CELL + CELL / 2;
          const cy = r * CELL + CELL / 2;

          // proximity to mouse
          const dist = Math.hypot(cx - mx, cy - my);
          const prox = Math.max(0, 1 - dist / RADIUS);

          // speed up char cycling near mouse
          if (now > cell.nextTick) {
            cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const boost = 1 - prox * 0.85; // near mouse = faster
            cell.interval = (400 + Math.random() * 1800) * boost;
            cell.nextTick = now + cell.interval;
          }

          const w = wave(c, r);
          const base = dark ? 0.03 : 0.04;
          const ambient = w * (dark ? 0.09 : 0.08);
          const hover = prox * prox * (dark ? 0.65 : 0.55);

          ctx.globalAlpha = base + ambient + hover;
          ctx.fillText(cell.char, cx, cy);
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
