'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FadeIn } from '@/components/shared/FadeIn';
import { Subtitle } from '@/components/shared/Subtitle';
import { V2Controls, DesktopControlsRow } from '@/components/home/V2Controls';
import { LiveClock } from '@/components/home/LiveClock';
import { BirthdayCake } from '@/components/home/BirthdayCake';

function NameMark() {
  return (
    <Link href="/" className="block w-fit">
      <h1 className="text-sm font-semibold text-foreground leading-snug group/name select-none w-fit">
        <span>Ch</span>
        <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">arles</span>{' '}
        <span>Sh</span>
        <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">in</span>
        <BirthdayCake />
      </h1>
    </Link>
  );
}

export function PageHeader() {
  const pathname = usePathname();

  // /work: full-width header, name on far left, clock aligned with subtitle on far right
  if (pathname === '/work') {
    return (
      <div className="w-full px-5 sm:px-8 pt-12">
        <div className="flex items-start justify-between gap-6">
          <FadeIn>
            <div className="mb-6 desktop:mb-8">
              <NameMark />
              <Subtitle />
            </div>
          </FadeIn>
          <FadeIn delay={50}>
            <span className="text-sm text-neutral-400 dark:text-neutral-600 pt-5 shrink-0 block">
              <LiveClock />
            </span>
          </FadeIn>
        </div>
      </div>
    );
  }

  // Default: centered 900px container with two-column header grid
  return (
    <div className="max-w-[900px] mx-auto px-5 sm:px-8 pt-12">
      <div className="flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:w-fit desktop:mx-auto">
        <div>
          <FadeIn>
            <div className="mb-6 desktop:mb-8">
              <NameMark />
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
    </div>
  );
}
