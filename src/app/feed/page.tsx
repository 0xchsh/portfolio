import Image from 'next/image';
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
      <main className="flex-1 w-full max-w-[420px] mx-auto px-4 pt-16 desktop:pt-20 pb-8">
        {/* ── Experiments ─────────────────────────────────────────── */}
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

        {/* ── Lists ───────────────────────────────────────────────── */}
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

        {/* ── Writing ─────────────────────────────────────────────── */}
        <section className="mt-12 flex flex-col gap-4">
          <span className={mutedLabel}>Writing</span>
          <div className="flex flex-col gap-2">
            {feedData.writing.map((item) => (
              <div key={item.slug} className="flex items-center gap-2">
                <a href={item.href} className={`text-sm ${linkClass}`}>
                  {item.title}
                </a>
                <span className="text-sm text-neutral-400">·</span>
                <span className="text-sm text-neutral-400">
                  {item.slug}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Art ──────────────────────────────────────────────────── */}
        <section className="mt-12 flex flex-col gap-8">
          <span className={mutedLabel}>Art</span>
          {feedData.art.map((project) => (
            <div key={project.title} className="flex flex-col gap-4">
              {/* Title + year */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-950">
                  {project.title}
                </span>
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 w-8">Size</span>
                  <span className="text-xs text-neutral-950 font-medium">
                    {project.size}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 w-8">Type</span>
                  <div className="flex items-center gap-1">
                    {project.type.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-neutral-950 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Link */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  See full collection
                </span>
                <a
                  href={project.collectionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${linkClass}`}
                >
                  {project.collectionLabel}
                </a>
              </div>
            </div>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
