'use client';

import { useState, useEffect, useRef } from 'react';
import { WeatherIcon } from '@/components/home/WeatherIcon';
import { LiveClock } from '@/components/home/LiveClock';
import { AnalogClock } from '@/components/home/AnalogClock';

type Weather = {
  code: number;
  tempF: number | null;
  desc: string;
  highF: number | null;
  lowF: number | null;
};

const widgetCard = 'btn-classic btn-classic-outline bg-background rounded-lg pointer-events-none border border-transparent bg-clip-padding';

export function WeatherPill({ weather, variant }: { weather: Weather; variant?: 'static' }) {
  if (variant === 'static') {
    return (
      <div className="flex w-full items-center justify-between text-sm font-medium text-neutral-400 dark:text-neutral-500">
        <div className="flex items-center gap-1">
          <span>Chicago, IL</span>
          <WeatherIcon code={weather.code} />
        </div>
        <LiveClock />
      </div>
    );
  }
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Mobile-only fade overlay behind widgets */}
      <div
        className="fixed top-0 left-0 right-0 sm:hidden pointer-events-none"
        style={{
          height: '100vh',
          opacity: open ? 1 : 0,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 80%)',
          transition: open
            ? 'opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1)'
            : 'opacity 150ms ease',
        }}
      />
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-transparent bg-clip-padding rounded-lg px-2.5 h-7 cursor-pointer sm:min-w-[204px] sm:w-auto whitespace-nowrap btn-classic btn-classic-outline bg-background"
      >
        <span className="text-neutral-400 hidden sm:inline">Chicago, IL</span>
        <WeatherIcon code={weather.code} />
        <LiveClock />
      </button>

      {/* Widget panel */}
      <div
        className="absolute top-full right-0 mt-3 flex flex-col gap-3 rounded-2xl sm:w-[204px]"
        style={{
          pointerEvents: open ? 'auto' : 'none',
          background: open ? 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.6))' : 'transparent',
          backdropFilter: open ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: open ? 'blur(20px)' : 'none',
          transition: 'background 200ms ease, backdrop-filter 200ms ease',
        }}
      >
        {/* Clocks */}
        <div
          className={`${widgetCard} p-3 flex justify-center gap-4`}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            transition: open
              ? 'opacity 200ms 0ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 200ms 0ms cubic-bezier(0.215, 0.61, 0.355, 1)'
              : 'opacity 120ms 0ms ease, transform 120ms 0ms ease',
          }}
        >
          <AnalogClock timezone="America/Los_Angeles" label="PT" size={44} offsetHours={-2} offsetColor="#ef4444" now={now} />
          <AnalogClock timezone="America/Chicago" label="CT" size={44} now={now} />
          <AnalogClock timezone="America/New_York" label="ET" size={44} offsetHours={1} offsetColor="#22c55e" now={now} />
        </div>

        {/* Weather */}
        <div
          className={`${widgetCard} p-3`}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            transition: open
              ? 'opacity 200ms 50ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 200ms 50ms cubic-bezier(0.215, 0.61, 0.355, 1)'
              : 'opacity 120ms 0ms ease, transform 120ms 0ms ease',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] leading-tight tracking-wide text-neutral-400 font-medium">Chicago, IL</span>
              <div className="flex items-center gap-1 mt-1">
                <WeatherIcon code={weather.code} size={28} />
                <span className="text-2xl font-semibold text-neutral-950 leading-none">
                  {weather.tempF !== null ? `${weather.tempF}°` : '--'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end leading-none gap-1">
              <span className="text-[10px] text-neutral-400">{weather.desc}</span>
              {weather.highF !== null && weather.lowF !== null && (
                <span className="text-[10px] text-neutral-400">
                  H:{weather.highF}° L:{weather.lowF}°
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
