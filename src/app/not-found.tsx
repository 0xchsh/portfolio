import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
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
          <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-100 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 px-4 py-2 rounded-full transition-colors duration-100">
            <ArrowLeft size={12} weight="bold" className="mr-0.5" />
            Back home
          </Link>
        </FadeIn>

      </div>
    </div>
  );
}
