'use client';

import { Squircle } from '@squircle-js/react';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

interface SquircleButtonProps extends ComponentProps<'button'> {
  active?: boolean;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function SquircleButton({
  children,
  active = false,
  cornerRadius = 8,
  cornerSmoothing = 1,
  className,
  ...props
}: SquircleButtonProps) {
  return (
    <Squircle
      asChild
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
    >
      <button
        className={cn(
          'px-2.5 py-1 transition-colors cursor-pointer text-base leading-6',
          'hover:bg-accent hover:text-accent-foreground',
          active
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </button>
    </Squircle>
  );
}

interface SquircleLinkProps extends ComponentProps<'a'> {
  active?: boolean;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function SquircleLink({
  children,
  active = false,
  cornerRadius = 8,
  cornerSmoothing = 1,
  className,
  ...props
}: SquircleLinkProps) {
  return (
    <Squircle
      asChild
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
    >
      <a
        className={cn(
          'px-2.5 py-1 transition-colors cursor-pointer text-base leading-6',
          'hover:bg-accent hover:text-accent-foreground',
          active
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </a>
    </Squircle>
  );
}
