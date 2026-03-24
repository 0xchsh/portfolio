'use client';

import { useAgentMode } from '@/components/providers/AgentModeProvider';

export function V2TopFade() {
  const { agentMode } = useAgentMode();
  return (
    <div
      className={`fixed top-0 left-0 right-0 pointer-events-none z-30 ${agentMode ? 'hidden dark:block' : ''}`}
    >
      <div className="bg-background" style={{ height: 'env(safe-area-inset-top)' }} />
      <div className="h-20 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}
