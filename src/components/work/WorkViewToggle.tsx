'use client';

import { Stack, GridFour } from '@phosphor-icons/react';

export type WorkView = 'stack' | 'canvas';

export function WorkViewToggle({
  view,
  onChange,
}: {
  view: WorkView;
  onChange: (view: WorkView) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/80 backdrop-blur-md rounded-full border border-neutral-200 p-1 shadow-sm">
      <button
        onClick={() => onChange('stack')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
          view === 'stack'
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-400 hover:text-neutral-600'
        }`}
        aria-label="Stack view"
      >
        <Stack size={14} weight="bold" />
        Stack
      </button>
      <button
        onClick={() => onChange('canvas')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
          view === 'canvas'
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-400 hover:text-neutral-600'
        }`}
        aria-label="Canvas view"
      >
        <GridFour size={14} weight="bold" />
        Canvas
      </button>
    </div>
  );
}
