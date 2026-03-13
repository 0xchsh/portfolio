'use client';

import { useEffect, useRef } from 'react';

export function useGlobalHaptics() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    function playClick() {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const duration = 0.008;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.value = 1.0;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.onended = () => source.disconnect();
      source.start();

      if (navigator.vibrate) navigator.vibrate(8);
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [data-haptic]')) {
        playClick();
      }
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);
}
