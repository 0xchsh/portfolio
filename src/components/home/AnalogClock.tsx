'use client';

import { useState, useEffect } from 'react';

function getTimeInZone(tz: string) {
  const now = new Date();
  const str = now.toLocaleString('en-US', { timeZone: tz, hour12: false });
  const [, timePart] = str.split(', ');
  const [h, m, s] = timePart.split(':').map(Number);
  return { h: h % 12, m, s };
}

function arcPath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) {
  // Convert from clock angles (0=12 o'clock, clockwise) to SVG angles (0=3 o'clock, clockwise)
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + Math.cos(toRad(startAngleDeg)) * r;
  const y1 = cy + Math.sin(toRad(startAngleDeg)) * r;
  const x2 = cx + Math.cos(toRad(endAngleDeg)) * r;
  const y2 = cy + Math.sin(toRad(endAngleDeg)) * r;

  let sweep = endAngleDeg - startAngleDeg;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export function AnalogClock({
  timezone,
  label,
  size = 96,
  offsetHours,
  offsetColor,
}: {
  timezone: string;
  label: string;
  size?: number;
  offsetHours?: number;
  offsetColor?: string;
}) {
  const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    setTime(getTimeInZone(timezone));
    const id = setInterval(() => setTime(getTimeInZone(timezone)), 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  // Hour markers (static, no hydration issue)
  const markers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isQuarter = i % 3 === 0;
    const outerR = r - 2;
    const innerR = isQuarter ? r - 8 : r - 5;
    return {
      x1: Math.round((cx + Math.cos(angle) * innerR) * 100) / 100,
      y1: Math.round((cy + Math.sin(angle) * innerR) * 100) / 100,
      x2: Math.round((cx + Math.cos(angle) * outerR) * 100) / 100,
      y2: Math.round((cy + Math.sin(angle) * outerR) * 100) / 100,
      isQuarter,
    };
  });

  // Hand angles
  const secAngle = time ? time.s * 6 : 0;
  const minAngle = time ? time.m * 6 + time.s * 0.1 : 0;
  const hrAngle = time ? time.h * 30 + time.m * 0.5 : 0;
  const hourLen = r * 0.5;
  const minLen = r * 0.7;
  const secLen = r * 0.78;

  // Offset overlay arc
  let overlayPath: string | null = null;
  if (time && offsetHours && offsetColor) {
    // offsetHours negative = behind (red for PT), positive = ahead (green for ET)
    const currentAngle = hrAngle;
    if (offsetHours < 0) {
      // Behind: arc from (current hour) back by N hours
      const startAngle = currentAngle;
      const endAngle = currentAngle - offsetHours * 30; // negative * negative = positive
      overlayPath = arcPath(cx, cy, r - 1, startAngle, endAngle);
    } else {
      // Ahead: arc from (current hour minus offset) up to current hour
      const startAngle = currentAngle - offsetHours * 30;
      const endAngle = currentAngle;
      overlayPath = arcPath(cx, cy, r - 1, startAngle, endAngle);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="btn-classic btn-classic-outline bg-background rounded-full flex items-center justify-center overflow-hidden pointer-events-none border border-transparent bg-clip-padding"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block shrink-0"
        >
          {/* Offset overlay */}
          {overlayPath && offsetColor && (
            <path
              d={overlayPath}
              fill={offsetColor}
              opacity={0.4}
            />
          )}

          {/* Hour markers */}
          {markers.map((m, i) => (
            <line
              key={i}
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              stroke={m.isQuarter ? '#a3a3a3' : '#d4d4d4'}
              strokeWidth={m.isQuarter ? 1.5 : 0.75}
              strokeLinecap="round"
            />
          ))}

          {time && (
            <>
              {/* Hour hand */}
              <line
                x1={cx}
                y1={cy}
                x2={cx + Math.sin((hrAngle * Math.PI) / 180) * hourLen}
                y2={cy - Math.cos((hrAngle * Math.PI) / 180) * hourLen}
                stroke="#262626"
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* Minute hand */}
              <line
                x1={cx}
                y1={cy}
                x2={cx + Math.sin((minAngle * Math.PI) / 180) * minLen}
                y2={cy - Math.cos((minAngle * Math.PI) / 180) * minLen}
                stroke="#262626"
                strokeWidth={1.5}
                strokeLinecap="round"
              />

              {/* Second hand */}
              <line
                x1={cx}
                y1={cy + r * 0.15}
                x2={cx}
                y2={cy - secLen}
                stroke="#ef4444"
                strokeWidth={0.75}
                strokeLinecap="round"
                transform={`rotate(${secAngle} ${cx} ${cy})`}
              />

              {/* Center dot */}
              <circle cx={cx} cy={cy} r={2} fill="#262626" />
              <circle cx={cx} cy={cy} r={1} fill="#ef4444" />
            </>
          )}
        </svg>
      </div>
      <span className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">
        {label}
      </span>
    </div>
  );
}
