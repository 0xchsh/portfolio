'use client';

import { Robot, FileText, ArrowUpRight } from '@phosphor-icons/react';
import { useAgentMode } from '@/components/providers/AgentModeProvider';
import { FadeIn } from '@/components/shared/FadeIn';

// ---------------------------------------------------------------------------
// Section label (mirrors the one in v2/page.tsx)
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">{children}</span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agent mode section rows
// ---------------------------------------------------------------------------

const rowClass =
  'flex items-center gap-3 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';

function AgentModeRow() {
  const { toggleAgentMode } = useAgentMode();
  return (
    <button onClick={toggleAgentMode} className={rowClass}>
      <Robot size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" />
      <span className="text-sm font-medium text-foreground">Agent Mode</span>
    </button>
  );
}

function CharlesMdRow() {
  return (
    <a
      href="https://github.com/0xchsh/agent-skills/blob/main/shincn/SKILL.md"
      target="_blank"
      rel="noopener noreferrer"
      className={`${rowClass} items-start group`}
    >
      <FileText size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[3px]" />
      <div>
        <p className="text-sm font-medium text-foreground leading-[20px]">shincn</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">Design instructions for LLMs</p>
      </div>
      <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// Main export — swaps content on agent mode toggle
// ---------------------------------------------------------------------------

export function V2LeftContent({ children }: { children: React.ReactNode }) {
  const { agentMode } = useAgentMode();

  if (agentMode) {
    return (
      <div>
        <FadeIn delay={75}>
          <section>
            <SectionLabel>Skills</SectionLabel>
            <div className="mt-4 flex flex-col gap-2">
              <CharlesMdRow />
            </div>
          </section>
        </FadeIn>
        <FadeIn delay={150}>
          <section className="mt-8">
            <SectionLabel>For Agents</SectionLabel>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className={`${rowClass} items-start group`}
              >
                <FileText size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[3px]" />
                <div>
                  <p className="text-sm font-medium text-foreground leading-[20px]">llms.txt is set up</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">Structured context at ch.sh/llms.txt</p>
                </div>
                <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
              </a>
            </div>
          </section>
        </FadeIn>
      </div>
    );
  }

  return <>{children}</>;
}
