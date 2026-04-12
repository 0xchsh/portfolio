import Link from 'next/link';
import { V2TopFade } from '@/components/home/V2TopFade';
import { V2BottomFade } from '@/components/home/V2BottomFade';
import { V2Controls, DesktopControlsRow } from '@/components/home/V2Controls';
import { LiveClock } from '@/components/home/LiveClock';
import { FadeIn } from '@/components/shared/FadeIn';
import { Subtitle } from '@/components/shared/Subtitle';
import { PlayerProvider } from '@/components/shared/MiniPlayer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-clip">
        <V2TopFade />
        <V2BottomFade />

        <div className="group/page max-w-[900px] mx-auto px-5 sm:px-8 pt-12 pb-16">
            {/* Persistent header */}
            <div className="flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:w-fit desktop:mx-auto">
              <div>
                <FadeIn>
                  <div className="mb-6 desktop:mb-8">
                    <Link href="/" className="block w-fit">
                      <h1 className="text-sm font-semibold text-foreground leading-snug group/name select-none w-fit">
                        <span>Ch</span>
                        <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">arles</span>{' '}
                        <span>Sh</span>
                        <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">in</span>
                      </h1>
                    </Link>
                    <Subtitle />
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={50}>
                <div className="desktop:pt-5">
                  {/* Controls + Time — desktop */}
                  <div className="hidden desktop:flex mb-8 items-center justify-between">
                    <DesktopControlsRow />
                    <span className="text-sm text-neutral-400 dark:text-neutral-600">
                      <LiveClock />
                    </span>
                  </div>

                  {/* Controls + Time — mobile */}
                  <div className="flex desktop:hidden mb-4 items-center justify-between">
                    <V2Controls />
                    <span className="text-sm text-neutral-400 dark:text-neutral-600">
                      <LiveClock />
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Page content */}
            {children}
        </div>
      </div>
    </PlayerProvider>
  );
}
