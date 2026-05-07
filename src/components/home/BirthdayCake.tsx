'use client';

import { useEffect, useState } from 'react';

export function BirthdayCake() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = new Date();
    setShow(now.getMonth() === 10 && now.getDate() === 2);
  }, []);

  if (!show) return null;

  return (
    <span
      role="img"
      aria-label="Happy birthday"
      className="inline-block ml-1 align-[-3px]"
      style={{
        animation: 'cake-bob 1.6s ease-in-out infinite',
        transformOrigin: 'center bottom',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" overflow="visible">
        {/* plate */}
        <ellipse cx="10" cy="17.5" rx="7.5" ry="0.9" fill="currentColor" opacity="0.18" />
        {/* cake body */}
        <rect x="3.5" y="10" width="13" height="6.8" rx="1" fill="#fbcfe8" />
        {/* frosting drip top */}
        <path d="M3.5 10 Q5 8.6 6.5 10 T9.5 10 T12.5 10 T15.5 10 T16.5 10 L16.5 11 L3.5 11 Z" fill="#f9a8d4" />
        {/* sprinkles */}
        <rect x="5.5" y="13" width="1" height="0.4" rx="0.2" fill="#fde68a" transform="rotate(20 6 13.2)" />
        <rect x="9" y="14.2" width="1" height="0.4" rx="0.2" fill="#bae6fd" transform="rotate(-25 9.5 14.4)" />
        <rect x="12.5" y="13.2" width="1" height="0.4" rx="0.2" fill="#bbf7d0" transform="rotate(15 13 13.4)" />
        {/* candle */}
        <rect x="9.4" y="5.8" width="1.2" height="3.4" rx="0.2" fill="#60a5fa" />
        <rect x="9.4" y="6.8" width="1.2" height="0.6" fill="#3b82f6" opacity="0.5" />
        {/* wick */}
        <rect x="9.85" y="5.2" width="0.3" height="0.8" fill="#52525b" />
        {/* flame */}
        <g
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center bottom',
            animation: 'flame-flicker 0.36s ease-in-out infinite',
          }}
        >
          <path d="M10 2.0 Q11.6 3.4 11.4 4.8 Q11.2 5.9 10 5.9 Q8.8 5.9 8.6 4.8 Q8.4 3.4 10 2.0 Z" fill="#fb923c" />
          <path d="M10 3.2 Q10.8 4.0 10.7 4.7 Q10.6 5.2 10 5.2 Q9.4 5.2 9.3 4.7 Q9.2 4.0 10 3.2 Z" fill="#fde047" />
        </g>
      </svg>
    </span>
  );
}
