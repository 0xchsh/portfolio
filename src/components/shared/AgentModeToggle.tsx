'use client';

import { useState } from 'react';

export function AgentModeToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="flex items-center gap-1.5 text-xs tracking-wide text-neutral-400 hover:text-neutral-600 transition-colors duration-150 cursor-pointer"
    >
      <span>Agent Mode</span>
      <div
        className={`relative w-6 h-3.5 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-neutral-950' : 'bg-neutral-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-2.5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
