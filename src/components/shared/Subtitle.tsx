'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const subtitles: Record<string, string> = {
  '/': 'Software Designer',
  '/skills': 'Curated Skills',
  '/stack': 'Curated Resources',
  '/index': 'Personal Index',
  '/work': 'Prepared for Exa',
};

export function Subtitle() {
  const pathname = usePathname();
  const text = subtitles[pathname] ?? 'Software Designer';

  return (
    <div className="relative h-5">
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          className="text-sm text-neutral-400 dark:text-neutral-600 w-fit"
          aria-label={text}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
