'use client';

import { useState, useEffect, useRef } from 'react';

function AnimatedChar({ char, className }: { char: string; className?: string }) {
  const [display, setDisplay] = useState(char);
  const [animating, setAnimating] = useState(false);
  const prevChar = useRef(char);

  useEffect(() => {
    if (char !== prevChar.current) {
      prevChar.current = char;
      setAnimating(true);
      // Brief blur-out, then swap and blur-in
      const swap = setTimeout(() => {
        setDisplay(char);
        // Trigger blur-in on next frame
        requestAnimationFrame(() => {
          setAnimating(false);
        });
      }, 80);
      return () => clearTimeout(swap);
    }
  }, [char]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        filter: animating ? 'blur(4px)' : 'blur(0px)',
        opacity: animating ? 0.3 : 1,
        transform: animating ? 'translateY(2px)' : 'translateY(0)',
        transition: animating
          ? 'filter 80ms ease-out, opacity 80ms ease-out, transform 80ms ease-out'
          : 'filter 150ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 150ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 150ms cubic-bezier(0.215, 0.61, 0.355, 1)',
      }}
    >
      {display}
    </span>
  );
}

export function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function updateTime() {
      const raw = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(raw.replace(/^(\d):/, '0$1:'));
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <span className="tabular-nums">{'\u00A0'}</span>;

  return (
    <span className="tabular-nums">
      {time.split('').map((char, i) => (
        <AnimatedChar key={i} char={char} className={char === ' ' ? 'w-[0.25em]' : undefined} />
      ))}
    </span>
  );
}
