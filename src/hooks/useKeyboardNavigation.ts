'use client';

import { useEffect } from 'react';

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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNextProject, onPrevProject, onNextSection, onPrevSection, onToggleTheme]);
}
