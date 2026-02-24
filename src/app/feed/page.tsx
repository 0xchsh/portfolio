import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';
import feedData from '@/data/feed.json';

function Dot() {
  return <div className="flex-1 border-t border-dotted border-neutral-300" />;
}

const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';
const linkClass =
  'text-neutral-950 font-medium underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100';

export default function Feed() {
  return (
    <PageShell>
      <main className="flex-1 w-full max-w-[420px] mx-auto px-4 pt-16 desktop:pt-20 pb-[120px]">
        {/* ── Experiments ─────────────────────────────────────────── */}
        <FadeIn>
        <section className="flex flex-col gap-4">
          <span className={mutedLabel}>
            Exper<span className="text-neutral-300">/</span>Ai
            <span className="text-neutral-300">/</span>Ments
          </span>
          <div className="flex flex-col gap-2">
            {feedData.experiments.map((item) => (
              <div key={item.number} className="flex items-center gap-2">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${linkClass}`}
                >
                  {item.title}
                </a>
                <Dot />
                <span className="text-sm text-neutral-400 shrink-0">
                  {item.number}
                </span>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* ── Lists ───────────────────────────────────────────────── */}
        <FadeIn delay={50}>
        <section className="mt-12 flex flex-col gap-4">
          <span className={mutedLabel}>Lists</span>
          <div className="flex flex-col gap-2">
            {feedData.lists.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${linkClass}`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* ── Art ──────────────────────────────────────────────────── */}
        <FadeIn delay={150}>
        <section className="mt-12 flex flex-col gap-8">
          <span className={mutedLabel}>Art</span>
          {feedData.art.map((project) => (
            <div key={project.title} className="flex flex-col gap-4">
              {/* Title + year */}
              <div className="flex items-center gap-2">
                <a
                  href={project.collectionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-semibold ${linkClass}`}
                >
                  {project.title}
                </a>
                <Dot />
                <span className="text-sm text-neutral-400 shrink-0">
                  {project.year}
                </span>
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-2">
                {project.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={src}
                      alt={`${project.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">Size</span>
                  <span className="text-sm text-neutral-950 font-medium">
                    {project.size}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">Type</span>
                  <span className="text-sm text-neutral-950 font-medium">
                    {project.type.join(', ')}
                  </span>
                </div>
              </div>

              {/* Link */}
            </div>
          ))}
        </section>
        </FadeIn>
      </main>
    </PageShell>
  );
}
