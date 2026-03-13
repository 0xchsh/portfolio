'use client';

import { useGlobalHaptics } from '@/hooks/useHaptics';

export function GlobalHaptics() {
  useGlobalHaptics();
  return null;
}
