import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';
import { WorkCard } from '@/components/work/WorkCard';
import workItems from '@/data/work.json';

export type WorkItem = {
  title: string;
  description: string;
  src: string[];
  blurDataURLs?: (string | null)[];
  link: string | null;
  logo: string | null;
  ratio: '16:9' | '1:1';
  objectPosition?: string;
};

export default function Work() {
  return (
    <PageShell staticFooter>
      <main className="flex-1 w-full px-4 pt-12 desktop:pt-14 pb-16">
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3" style={{ gridAutoRows: '1px' }}>
            {(workItems as WorkItem[]).map((item, i) => (
              <WorkCard key={`${item.title}-${i}`} item={item} />
            ))}
          </div>
        </FadeIn>
      </main>
    </PageShell>
  );
}
