'use client';

import { useAgentMode } from '@/components/providers/AgentModeProvider';

export function V2BottomFade() {
  const { agentMode } = useAgentMode();
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 pointer-events-none z-30 ${agentMode ? 'hidden dark:block' : ''}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="h-20 bg-gradient-to-t from-background to-transparent" />
      <div className="bg-background" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </div>
  );
}
