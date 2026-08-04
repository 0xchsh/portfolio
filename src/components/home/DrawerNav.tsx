'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { playHapticClick } from '@/hooks/useHaptics';

type DrawerNavContextType = {
  openIndex: number | null;
  total: number;
  open: (index: number) => void;
  close: () => void;
};

const DrawerNavContext = createContext<DrawerNavContextType>({
  openIndex: null,
  total: 0,
  open: () => {},
  close: () => {},
});

export function DrawerNavProvider({ children, total }: { children: React.ReactNode; total: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setOpenIndex(i), []);
  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        playHapticClick();
        setOpenIndex(prev => {
          if (prev === null) return null;
          return e.key === 'ArrowRight' ? (prev + 1) % total : ((prev - 1) + total) % total;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openIndex, total]);

  return (
    <DrawerNavContext.Provider value={{ openIndex, total, open, close }}>
      {children}
    </DrawerNavContext.Provider>
  );
}

export function useDrawerNav() {
  return useContext(DrawerNavContext);
}
