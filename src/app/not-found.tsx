import Link from 'next/link';
import { FadeIn } from '@/components/shared/FadeIn';
import { NotFoundBg } from './NotFoundBg';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5">
      <NotFoundBg />
      <div className="max-w-[320px] w-full flex flex-col items-center text-center gap-8">

        {/* 404 display */}
        <FadeIn delay={60}>
          <div className="select-none" aria-label="404">
            <span className="font-sans text-[88px] font-bold leading-none tracking-tighter text-neutral-900 dark:text-neutral-100">404</span>
          </div>
        </FadeIn>

        {/* Message */}
        <FadeIn delay={120}>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            This page doesn't exist. It may have been moved, deleted, or is still being designed.
          </p>
        </FadeIn>

        {/* Back home */}
        <FadeIn delay={175}>
          <Link href="/" className="px-3.5 py-1.5 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-200 backdrop-blur-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-150 hover:bg-neutral-200 dark:hover:bg-neutral-700">
            Back home
          </Link>
        </FadeIn>

      </div>
    </div>
  );
}
