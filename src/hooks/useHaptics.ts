'use client';

import { useEffect } from 'react';
import { play } from 'cuelume';

export function playHapticClick() {
  play('toggle');
  if (navigator.vibrate) navigator.vibrate(8);
}

export function useGlobalHaptics() {
  useEffect(() => {
    function handleClick() {
      if (localStorage.getItem('haptics-muted') !== 'true') {
        playHapticClick();
      }
    }

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}
