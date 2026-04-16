'use client';

import { useState } from 'react';
import { MobileFrame, VideoWithBlur } from '@/components/work/WorkCard';
import Image from 'next/image';
import { Squircle } from '@squircle-js/react';

type Screen = { src: string; caption: string };

const SCREENS: Record<string, Screen[]> = {
  Freighter: [
    { src: '/work/freighter/img/01-home.mp4', caption: 'Home' },
    { src: '/work/freighter/webp/02-past-transactions.webp', caption: 'Past transactions' },
    { src: '/work/freighter/img/02-history-details.mp4', caption: 'History details' },
    { src: '/work/freighter/img/02-wallets.mp4', caption: 'Wallets' },
    { src: '/work/freighter/img/03-discover-1.mp4', caption: 'Discover' },
    { src: '/work/freighter/img/03-discover-2.mp4', caption: 'Discover detail' },
    { src: '/work/freighter/webp/03-in-app-browser.webp', caption: 'In-app browser' },
    { src: '/work/freighter/img/04-details.mp4', caption: 'Transaction details' },
    { src: '/work/freighter/img/04-details-mal.mp4', caption: 'Malicious transaction warning' },
    { src: '/work/freighter/img/04-review-transactions.mp4', caption: 'Review transaction' },
  ],
  Lab: [
    { src: '/work/lab/img/01 account.mp4', caption: 'Account' },
    { src: '/work/lab/img/02 transaction.mp4', caption: 'Transaction' },
  ],
  Snack: [
    { src: '/work/snack/img/01 create-list.mp4', caption: 'Create list' },
    { src: '/work/snack/img/02 dashboard.png', caption: 'Dashboard' },
    { src: '/work/snack/img/05 stats.png', caption: 'Stats' },
  ],
};

const TABS = ['Freighter', 'Lab', 'Snack'] as const;
type Tab = (typeof TABS)[number];

const LANDSCAPE_RATIO = '1568 / 1080';
const CARD_HEIGHT = 480;

function isVideo(src: string) {
  return src.endsWith('.mp4') || src.endsWith('.webm');
}

function LandscapeCard({ src, alt }: { src: string; alt: string }) {
  return (
    <Squircle
      cornerRadius={16}
      cornerSmoothing={1}
      className="relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 h-full"
      style={{ aspectRatio: LANDSCAPE_RATIO }}
    >
      {isVideo(src) ? (
        <VideoWithBlur src={src} className="absolute inset-0 w-full h-full object-cover" eager />
      ) : (
        <Image src={src} alt={alt} fill sizes="700px" className="object-cover" />
      )}
    </Squircle>
  );
}

export default function WorkPage() {
  const [active, setActive] = useState<Tab>('Freighter');
  const [hoveredSrc, setHoveredSrc] = useState<string | null>(null);
  const screens = SCREENS[active];
  const isPortrait = active === 'Freighter';

  return (
    <div className="relative flex flex-col h-[calc(100svh-200px)] min-h-[600px]">
      {/* Horizontal scroll gallery */}
      <div className="flex-1 w-screen ml-[calc(50%-50vw)] overflow-x-auto overflow-y-hidden scrollbar-none">
        <div className={`h-full flex gap-4 px-5 sm:px-8 w-fit ${isPortrait ? 'items-center' : 'items-start pt-12'}`}>
          {screens.map((screen) => {
            const dimmed = hoveredSrc !== null && hoveredSrc !== screen.src;
            const style = {
              opacity: dimmed ? 0.35 : 1,
              filter: dimmed ? 'blur(2px)' : 'blur(0px)',
              transition: 'opacity 300ms ease, filter 300ms ease',
            };

            return isPortrait ? (
              <div
                key={screen.src}
                className="shrink-0 w-[240px] flex flex-col gap-3"
                style={style}
                onMouseEnter={() => setHoveredSrc(screen.src)}
                onMouseLeave={() => setHoveredSrc(null)}
              >
                <div className="w-full" style={{ aspectRatio: '9 / 19.5' }}>
                  <MobileFrame src={screen.src} alt={screen.caption} />
                </div>
                <p className="text-[14px] leading-5 text-neutral-500 dark:text-neutral-400 text-left">
                  {screen.caption}
                </p>
              </div>
            ) : (
              <div
                key={screen.src}
                className="shrink-0 flex flex-col gap-3"
                style={{ ...style, height: CARD_HEIGHT }}
                onMouseEnter={() => setHoveredSrc(screen.src)}
                onMouseLeave={() => setHoveredSrc(null)}
              >
                <LandscapeCard src={screen.src} alt={screen.caption} />
                <p className="text-[14px] leading-5 text-neutral-500 dark:text-neutral-400 text-left">
                  {screen.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toggle group */}
      <div className="flex justify-center pb-12 pt-2">
        <div className="flex items-center gap-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800/60 p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3.5 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                active === tab
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
