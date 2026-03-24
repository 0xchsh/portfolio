import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';
import { WorkCardContent } from '@/components/work/WorkCard';
import { WorkCanvas } from '@/components/work/WorkCanvas';
import workItems from '@/data/work.json';

export type WorkItem = {
  title: string;
  description: string;
  src: string[];
  link: string | null;
  logo: string | null;
  ratio: '16:9' | '1:1';
  objectPosition?: string;
};

export default function Work() {
  const items = workItems as WorkItem[];

  return (
    <PageShell variant="canvas">
      {/* Desktop: infinite canvas */}
      <div className="hidden desktop:block flex-1">
        <WorkCanvas items={items} />
      </div>

      {/* Mobile: vertical list */}
      <main className="desktop:hidden flex-1 w-full px-6 pt-24 pb-16">
        <FadeIn>
          <div className="flex flex-col gap-0">
            {items.map((item, i) => (
              <WorkCardContent key={`${item.title}-${i}`} item={item} />
            ))}
          </div>
        </FadeIn>
      </main>
    </PageShell>
  );
}
