'use client';

import { usePathname } from 'next/navigation';
import { useRef, useState, useLayoutEffect } from 'react';

const routes = ['/', '/work', '/feed'];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [anim, setAnim] = useState({ cls: '', key: 0 });

  useLayoutEffect(() => {
    if (prevPathRef.current !== pathname) {
      const prevIdx = routes.indexOf(prevPathRef.current);
      const currIdx = routes.indexOf(pathname);
      prevPathRef.current = pathname;

      if (prevIdx >= 0 && currIdx >= 0) {
        const last = routes.length - 1;
        const isWrapRight = prevIdx === last && currIdx === 0;
        const isWrapLeft = prevIdx === 0 && currIdx === last;
        const goingRight = isWrapRight || (!isWrapLeft && currIdx > prevIdx);
        setAnim((a) => ({
          cls: goingRight
            ? 'animate-slide-in-from-left'
            : 'animate-slide-in-from-right',
          key: a.key + 1,
        }));
      }
    }
  }, [pathname]);

  return (
    <div key={anim.key} className={anim.cls}>
      {children}
    </div>
  );
}
