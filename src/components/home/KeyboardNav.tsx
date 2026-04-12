'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const routes = ['/', '/stack'];

export function KeyboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentIndex = routes.indexOf(pathname);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (currentIndex + 1) % routes.length;
        router.push(routes[next]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (currentIndex - 1 + routes.length) % routes.length;
        router.push(routes[prev]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, router]);

  return null;
}
