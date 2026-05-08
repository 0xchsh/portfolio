import { FileText, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { FadeIn } from '@/components/shared/FadeIn';
import skillsData from '@/data/skills.json';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const { created: CREATED_SKILLS, installed: INSTALLED_SKILLS } = skillsData;

const STAGGER_CAP = 12;
function staggerDelay(i: number, step: number) {
  return Math.min(i, STAGGER_CAP) * step;
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

const rowClass =
  'flex items-center gap-3 pl-3 pr-4 py-1.5 -mx-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 w-[calc(100%+1.5rem)] text-left';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">{children}</span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700" />
    </div>
  );
}

function SkillRow({ name, description, href }: { name: string; description: string; href?: string }) {
  const inner = (
    <>
      <FileText size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[3px]" />
      <div>
        <p className="text-sm font-medium text-foreground leading-5">/{name}</p>
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
// Page
// ---------------------------------------------------------------------------

export default function SkillsPage() {
  return (
    <div className="flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:items-start desktop:w-fit desktop:mx-auto">
      {/* Left column — Created Skills + For Agents */}
      <div>
        <section>
          <FadeIn delay={75}><SectionLabel>Created Skills</SectionLabel></FadeIn>
          <div className="mt-4 flex flex-col gap-2">
            {CREATED_SKILLS.map((skill, i) => (
              <FadeIn key={skill.name} delay={100 + staggerDelay(i, 40)}>
                <SkillRow {...skill} />
              </FadeIn>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <FadeIn delay={100 + staggerDelay(CREATED_SKILLS.length, 40)}><SectionLabel>For Agents</SectionLabel></FadeIn>
          <div className="mt-4 flex flex-col gap-2">
            <FadeIn delay={125 + staggerDelay(CREATED_SKILLS.length, 40)}>
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
            </FadeIn>
          </div>
        </section>
      </div>

      {/* Right column — Installed Skills */}
      <div className="mt-8 desktop:mt-0">
        <section>
          <FadeIn delay={75}><SectionLabel>Installed Skills</SectionLabel></FadeIn>
          <div className="mt-4 flex flex-col gap-2">
            {INSTALLED_SKILLS.map((skill, i) => (
              <FadeIn key={skill.name} delay={100 + staggerDelay(i, 30)}>
                <SkillRow {...skill} />
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
