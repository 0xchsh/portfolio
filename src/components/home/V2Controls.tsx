'use client';

import { useState, useEffect } from 'react';
import { SpeakerHigh, SpeakerSlash, Sun, Moon, Robot } from '@phosphor-icons/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAgentMode } from '@/components/providers/AgentModeProvider';

function AgentToggleIcon() {
  const { agentMode, toggleAgentMode } = useAgentMode();
  return (
    <button
      onClick={toggleAgentMode}
      className={`transition-colors duration-150 cursor-pointer ${
        agentMode
          ? 'text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
      }`}
    >
      <Robot size={16} weight="bold" />
    </button>
  );
}

function HapticsToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(localStorage.getItem('haptics-muted') === 'true');
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('haptics-muted', String(next));
  };

  return (
    <button
      onClick={toggle}
      className={`transition-colors duration-150 cursor-pointer ${
        muted
          ? 'text-neutral-300 dark:text-neutral-700'
          : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
      }`}
    >
      {muted ? <SpeakerSlash size={16} weight="bold" /> : <SpeakerHigh size={16} weight="bold" />}
    </button>
  );
}

function DarkModeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  if (!mounted) return <div className="w-4 h-4" />;
  return (
    <button
      onClick={toggleTheme}
      className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150 cursor-pointer"
    >
      {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  );
}

export function V2Controls() {
  return (
    <div className="flex items-center gap-3">
      <AgentToggleIcon />
      <HapticsToggle />
      <DarkModeToggle />
    </div>
  );
}
