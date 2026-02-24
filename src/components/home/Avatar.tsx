'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

export function Avatar() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;

      const max = 2;
      setOffset({ x: dx * max, y: dy * max });
    }

    function handleMouseLeave() {
      setOffset({ x: 0, y: 0 });
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className="w-12 h-12 rounded-full overflow-hidden">
      <Image
        src="/images/pfp.png"
        alt="Charles Shin"
        width={56}
        height={56}
        className="w-14 h-14 -mb-1"
        style={{
          transformOrigin: 'center bottom',
          transform: `translate(${offset.x}px, ${offset.y}px) skewX(${offset.x * -0.4}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
    </div>
  );
}
