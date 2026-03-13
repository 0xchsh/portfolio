'use client';

import { useAgentMode } from '@/components/providers/AgentModeProvider';

export function AgentModeToggle({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { agentMode, toggleAgentMode } = useAgentMode();

  const isDark = variant === 'dark';

  return (
    <button
      onClick={toggleAgentMode}
      className={`flex items-center gap-1.5 text-sm leading-[14px] tracking-wide transition-colors duration-150 cursor-pointer ${
        isDark
          ? 'text-neutral-500 hover:text-neutral-300'
          : 'text-neutral-400 hover:text-neutral-600'
      }`}
    >
      <span>For agents</span>
      <div
        className={`relative w-6 h-3.5 rounded-full transition-colors duration-200 ${
          agentMode
            ? isDark ? 'bg-neutral-300' : 'bg-neutral-950'
            : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full transition-transform duration-200 ${
            isDark ? 'bg-neutral-900' : 'bg-white'
          } ${agentMode ? 'translate-x-2.5' : 'translate-x-0'}`}
        />
      </div>
    </button>
  );
}
