'use client';

import { useState, useEffect } from 'react';

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

  return (
    <span className="text-neutral-400 tabular-nums">
      {time || '\u00A0'}
    </span>
  );
}
