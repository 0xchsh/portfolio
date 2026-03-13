'use client';

import { useAgentMode } from '@/components/providers/AgentModeProvider';
import { AgentModeToggle } from '@/components/shared/AgentModeToggle';

const mutedLabel = 'text-sm uppercase tracking-wide';

const lightGradient = 'linear-gradient(to top, rgb(255 255 255) 0%, rgb(255 255 255) 72%, rgb(255 255 255 / 0) 100%)';
const darkGradient = 'linear-gradient(to top, #111111 0%, #111111 72%, rgba(17,17,17,0) 100%)';

export function FooterContent({ commitHash }: { commitHash: { sha: string; url: string } | null }) {
  const { agentMode } = useAgentMode();

  return (
    <div className="relative">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: lightGradient, opacity: agentMode ? 0 : 1 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: darkGradient, opacity: agentMode ? 1 : 0 }}
      />
      <div className="relative flex justify-between items-center p-6" style={{ paddingTop: '1.5rem' }}>
        <AgentModeToggle variant={agentMode ? 'dark' : 'light'} />
        <div className={`flex items-center gap-1 transition-opacity duration-300 ${agentMode ? 'opacity-0' : 'opacity-100'}`}>
          {commitHash && (
            <>
              <a
                href={commitHash.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-normal uppercase text-neutral-400 tracking-wide underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100"
              >
                {commitHash.sha}
              </a>
              <span className="text-neutral-300">·</span>
            </>
          )}
          <span className={`${mutedLabel} text-neutral-400`}>신 © 2026</span>
        </div>
      </div>
    </div>
  );
}
