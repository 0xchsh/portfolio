'use client';

import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onNextProject: () => void;
  onPrevProject: () => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  onToggleTheme: () => void;
}

export function useKeyboardNavigation({
  onNextProject,
  onPrevProject,
  onNextSection,
  onPrevSection,
  onToggleTheme,
}: UseKeyboardNavigationOptions) {
  const lastScrollTime = useRef(0);
  const scrollThreshold = 300; // ms between scroll navigations
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeThreshold = 50; // min px to trigger swipe

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          onNextProject();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevProject();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onNextSection();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onPrevSection();
          break;
        case 't':
        case 'T':
          event.preventDefault();
          onToggleTheme();
          break;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollThreshold) {
        return;
      }

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      // Horizontal swipe (trackpad) - navigate projects
      if (absX > absY && absX > 30) {
        event.preventDefault();
        lastScrollTime.current = now;

        if (event.deltaX > 0) {
          onNextProject(); // Swipe left = next project
        } else {
          onPrevProject(); // Swipe right = previous project
        }
        return;
      }

      // Vertical scroll - navigate sections
      if (absY > 30) {
        event.preventDefault();
        lastScrollTime.current = now;

        if (event.deltaY > 0) {
          onNextSection();
        } else {
          onPrevSection();
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Only trigger horizontal swipe if it's more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          onPrevProject(); // Swipe right = previous project
        } else {
          onNextProject(); // Swipe left = next project
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNextProject, onPrevProject, onNextSection, onPrevSection, onToggleTheme]);
}
