'use client';

import { useState, useEffect, useRef } from 'react';
import { WeatherIcon } from '@/components/home/WeatherIcon';
import { LiveClock } from '@/components/home/LiveClock';
import { AnalogClock } from '@/components/home/AnalogClock';

type Weather = {
  code: number;
  tempF: number;
  desc: string;
  highF: number | null;
  lowF: number | null;
};

type CryptoPrice = {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  sparkline: number[];
};

function Sparkline({ data, up, width = 60, height = 24 }: { data: number[]; up: boolean; width?: number; height?: number }) {
  const pathRef = useRef<SVGPolylineElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 800ms cubic-bezier(0.215, 0.61, 0.355, 1)';
        el.style.strokeDashoffset = '0';
      });
    });
  }, [data, up]);

  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <polyline
        ref={pathRef}
        points={points}
        fill="none"
        stroke={up ? '#22c55e' : '#ef4444'}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPrices() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&sparkline=true&price_change_percentage=24h',
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setPrices(
          data.map((coin: { symbol: string; current_price: number; price_change_percentage_24h: number; sparkline_in_7d?: { price: number[] } }) => {
            const change = coin.price_change_percentage_24h ?? 0;
            // Use last 24 data points from 7d sparkline (each point ≈ 1hr, last 24 = last day)
            const fullSparkline = coin.sparkline_in_7d?.price ?? [];
            const sparkline = fullSparkline.slice(-24);
            return {
              symbol: coin.symbol.toUpperCase(),
              price: Math.round(coin.current_price).toLocaleString(),
              change: change.toFixed(2),
              up: change >= 0,
              sparkline,
            };
          }),
        );
      } catch {}
    }
    fetchPrices();
    return () => { cancelled = true; };
  }, []);

  return prices;
}

const widgetCard = 'btn-classic btn-classic-outline bg-background rounded-xl pointer-events-none border border-transparent bg-clip-padding';

export function WeatherPill({ weather }: { weather: Weather }) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prices = useCryptoPrices();
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
        onClick={() => {
          setOpen((v) => {
            if (!v) setOpenCount((c) => c + 1);
            return !v;
          });
        }}
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
                  {weather.tempF}°
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] text-neutral-400">{weather.desc}</span>
              {weather.highF !== null && weather.lowF !== null && (
                <span className="text-[10px] text-neutral-400">
                  H:{weather.highF}° L:{weather.lowF}°
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Crypto */}
        <div
          className="flex gap-3"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            transition: open
              ? 'opacity 200ms 100ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 200ms 100ms cubic-bezier(0.215, 0.61, 0.355, 1)'
              : 'opacity 120ms 0ms ease, transform 120ms 0ms ease',
          }}
        >
          {(prices ?? [
            { symbol: 'BTC', price: '—', change: '0.00', up: true, sparkline: [] },
            { symbol: 'ETH', price: '—', change: '0.00', up: true, sparkline: [] },
          ]).map((coin) => (
            <div key={coin.symbol} className={`${widgetCard} flex-1 p-3 overflow-hidden`}>
              <div className="flex items-center justify-between leading-none">
                <span className="text-xs font-semibold text-neutral-950">{coin.symbol}</span>
                <span className={`text-[10px] font-medium ${coin.up ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.up ? '+' : ''}{coin.change}%
                </span>
              </div>
              {coin.sparkline.length > 0 && (
                <div className="mt-1.5 -mx-1">
                  <Sparkline key={openCount} data={coin.sparkline} up={coin.up} width={80} height={32} />
                </div>
              )}
              <div className="text-sm font-semibold text-neutral-950 leading-tight mt-2">
                ${coin.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
