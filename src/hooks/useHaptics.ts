'use client';

import { useEffect, useRef } from 'react';

export function playHapticClick(ctx: AudioContext) {
  if (ctx.state === 'suspended') ctx.resume();

  const when = ctx.currentTime + 0.01;
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
  source.start(when);

  if (navigator.vibrate) navigator.vibrate(8);
}

export function useGlobalHaptics() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    function playClick() {
      // Create context on first interaction — browsers allow it to start
      // in 'running' state when created inside a user gesture
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;

      // If still suspended, force resume synchronously within the gesture
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Schedule sound at a tiny offset to give context time to activate
      const when = ctx.currentTime + 0.01;

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
      source.start(when);

      if (navigator.vibrate) navigator.vibrate(8);
    }

    function handlePointerDown() {
      if (localStorage.getItem('haptics-muted') !== 'true') {
        playClick();
      }
    }

    document.addEventListener('click', handlePointerDown, true);
    return () => {
      document.removeEventListener('click', handlePointerDown, true);
    };
  }, []);
}
