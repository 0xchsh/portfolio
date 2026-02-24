import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';

const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';

export default function IntroductionToRGB() {
  return (
    <PageShell staticFooter>
      <main className="flex-1 w-full max-w-[452px] mx-auto px-4 pt-16 desktop:pt-20 pb-[120px]">
        <FadeIn>
          <span className={mutedLabel}>Article 001</span>
          <h1 className="text-2xl font-semibold mt-2">Introduction to RGB</h1>
          <p className="text-sm text-neutral-400 mt-1">2023</p>

          <div className="mt-8 text-base leading-relaxed text-neutral-400 flex flex-col gap-4">
            <p>
              RGB is an experiment in digital ownership and color. The premise is simple: every color in the RGB spectrum — all 16,777,216 of them — can be claimed as a unique onchain asset.
            </p>
            <p>
              Each token represents a single hex color. No metadata beyond the color itself. No generative art. Just pure, atomic color as an NFT.
            </p>
            <p>
              The project explores what happens when you take something universal and abundant — color — and introduce scarcity. It raises questions about value, ownership, and what it means to &quot;own&quot; something as fundamental as a shade of blue.
            </p>
            <p>
              The collection lives onchain and is fully open to mint. There are no roadmaps or promises beyond the art itself.
            </p>
            <p className="text-neutral-300 italic">Full article coming soon.</p>
          </div>
        </FadeIn>
      </main>
    </PageShell>
  );
}
