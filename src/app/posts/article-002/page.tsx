import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';

const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';

export default function HyperbrandOpepen() {
  return (
    <PageShell>
      <main className="flex-1 w-full max-w-[452px] mx-auto px-4 pt-16 desktop:pt-20 pb-[120px]">
        <FadeIn>
          <span className={mutedLabel}>Article 002</span>
          <h1 className="text-2xl font-semibold mt-2">Hyperbrand: Opepen</h1>
          <p className="text-sm text-neutral-400 mt-1">2023</p>

          <div className="mt-8 text-base leading-relaxed text-neutral-400 flex flex-col gap-4">
            <p>
              Opepen is one of the most fascinating branding experiments in crypto. What started as an open edition NFT by Jack Butcher evolved into a living, collaborative identity system.
            </p>
            <p>
              The Opepen format — a simple 4-panel grid — became a canvas for hundreds of artists. Each set reimagines the same structural constraint, creating a visual language that&apos;s simultaneously consistent and infinitely varied.
            </p>
            <p>
              This piece explores the idea of &quot;hyperbranding&quot; — what happens when a brand identity is open-sourced, remixed, and owned by its community rather than a single creator.
            </p>
            <p>
              Opepen proves that constraint breeds creativity, and that the strongest brands might be the ones that let go of control.
            </p>
            <p className="text-neutral-300 italic">Full article coming soon.</p>
          </div>
        </FadeIn>
      </main>
    </PageShell>
  );
}
