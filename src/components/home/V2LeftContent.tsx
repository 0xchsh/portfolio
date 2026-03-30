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
  'flex items-center gap-3 pl-3 pr-4 py-1.5 -mx-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';

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
        <p className="text-sm font-medium text-foreground leading-5">shincn</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-5">Design instructions for LLMs</p>
      </div>
      <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// My Stack — skill rows
// ---------------------------------------------------------------------------

const MY_STACK: { name: string; description: string; href?: string }[] = [
  { name: 'agent-browser', description: 'Browser automation for agents', href: 'https://skills.sh/vercel-labs/agent-browser/agent-browser' },
  { name: 'agentation', description: 'Agentation toolbar for Next.js', href: 'https://www.agentation.com/' },
  { name: 'copywriting', description: 'Marketing copy for any page', href: 'https://skills.sh/coreyhaines31/marketingskills/copywriting' },
  { name: 'emil-design-engineering', description: 'Polished web interface patterns', href: 'https://animations.dev/learn/emil-skill' },
  { name: 'find-skills', description: 'Discover and install skills', href: 'https://skills.sh/vercel-labs/skills/find-skills' },
  { name: 'frontend-design', description: 'Production-grade UI components', href: 'https://skills.sh/anthropics/skills/frontend-design' },
  { name: 'last30days', description: 'Research topics from last 30d', href: 'https://github.com/mvanhorn/last30days-skill' },
  { name: 'portfolio-audit', description: 'Audit design portfolios', href: 'https://github.com/hey-stefan/portfolio-audit' },
  { name: 'rams', description: 'Accessibility and design review', href: 'https://www.rams.ai/' },
  { name: 'remotion-best-practices', description: 'Best practices for Remotion', href: 'https://www.remotion.dev/docs/ai/skills' },
  { name: 'shadcn', description: 'Add and compose shadcn/ui', href: 'https://ui.shadcn.com' },
  { name: 'shincn', description: 'ShinCN design system setup', href: 'https://ui.ch.sh' },
  { name: 'swiftui-expert-skill', description: 'SwiftUI code and best practices', href: 'https://skills.sh/avdlee/swiftui-agent-skill/swiftui-expert-skill' },
  { name: 'ui-skills', description: 'Constraints for better UI', href: 'https://www.ui-skills.com/' },
  { name: 'userinterface-wiki', description: 'UI/UX best practices wiki', href: 'https://www.userinterface.wiki/' },
  { name: 'vercel-react-best-practices', description: 'React/Next.js perf optimization', href: 'https://skills.sh/vercel-labs/agent-skills/react-best-practices' },
  { name: 'web-design-guidelines', description: 'Web interface design review', href: 'https://github.com/vercel-labs/web-interface-guidelines' },
  { name: 'web-interface-guidelines', description: 'Vercel web interface review', href: 'https://github.com/vercel-labs/web-interface-guidelines' },
];

function SkillRow({ name, description, href }: { name: string; description: string; href?: string }) {
  const inner = (
    <>
      <FileText size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[3px] transition-transform duration-150 group-hover:scale-110" />
      <div>
        <p className="text-sm font-medium text-foreground leading-5">{name}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-5">{description}</p>
      </div>
      {href && (
        <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${rowClass} items-start group`}>
        {inner}
      </a>
    );
  }

  return <div className={`${rowClass} items-start group`}>{inner}</div>;
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
            <SectionLabel>My Skills</SectionLabel>
            <div className="mt-4 flex flex-col gap-2">
              <CharlesMdRow />
            </div>
          </section>
        </FadeIn>
        <FadeIn delay={150}>
          <section className="mt-8">
            <SectionLabel>My Stack</SectionLabel>
            <div className="mt-4 flex flex-col gap-2">
              {MY_STACK.map((skill) => (
                <SkillRow key={skill.name} {...skill} />
              ))}
            </div>
          </section>
        </FadeIn>
        <FadeIn delay={225}>
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
                  <p className="text-sm font-medium text-foreground leading-5">llms.txt is set up</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-5">Structured context at ch.sh/llms.txt</p>
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
