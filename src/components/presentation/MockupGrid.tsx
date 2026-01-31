'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MockupFrame } from './MockupFrame';
import type { Mockup } from '@/types/presentation';

function MobileCarousel({
  mockups,
  currentIndex,
  setCurrentIndex,
}: {
  mockups: Mockup[];
  currentIndex: number;
  setCurrentIndex: (fn: (prev: number) => number) => void;
}) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (delta > threshold) {
      // Swipe left → next
      setCurrentIndex((prev) =>
        prev === mockups.length - 1 ? 0 : prev + 1
      );
    } else if (delta < -threshold) {
      // Swipe right → prev
      setCurrentIndex((prev) =>
        prev === 0 ? mockups.length - 1 : prev - 1
      );
    }
  }, [mockups.length, setCurrentIndex]);

  return (
    <div className="desktop:hidden">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center">
          <MockupFrame
            mockup={mockups[currentIndex]}
            className="w-full max-w-[280px]"
          />
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? mockups.length - 1 : prev - 1
              )
            }
            className="p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Previous mockup"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {mockups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(() => index)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors cursor-pointer',
                  index === currentIndex
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/30'
                )}
                aria-label={`Go to mockup ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === mockups.length - 1 ? 0 : prev + 1
              )
            }
            className="p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Next mockup"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MockupGridProps {
  mockups: Mockup[];
  className?: string;
}

export function MockupGrid({ mockups, className }: MockupGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset carousel index when mockups change
  useEffect(() => {
    setCurrentIndex(0);
  }, [mockups]);

  if (!mockups || mockups.length === 0) return null;

  const isSingle = mockups.length === 1;
  const allMobile = mockups.every((m) => m.type === 'mobile');
  const mobileCount = mockups.filter((m) => m.type === 'mobile').length;

  // Desktop: show grid for multiple mobile mockups, single for others
  // Mobile viewport: carousel for multiple, full-width for single
  if (isSingle) {
    return (
      <div className={cn('w-full flex justify-center', className)}>
        <MockupFrame mockup={mockups[0]} />
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop: grid layout */}
      <div
        className={cn(
          'hidden desktop:flex flex-wrap justify-center',
          allMobile && mobileCount <= 3 ? 'flex-nowrap gap-4' : allMobile ? 'gap-4 max-w-[520px] mx-auto' : 'gap-6'
        )}
      >
        {mockups.map((mockup) => (
          <MockupFrame key={mockup.id} mockup={mockup} />
        ))}
      </div>

      {/* Mobile: carousel with swipe */}
      <MobileCarousel
        mockups={mockups}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
