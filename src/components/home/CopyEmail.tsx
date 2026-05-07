'use client';

import { Envelope, Copy } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CopyEmailRow() {
  const handleCopy = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    toast.success('Email copied to clipboard');
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 w-[calc(100%+1.5rem)] cursor-pointer text-left"
    >
      <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
        <Envelope size={20} weight="bold" className="text-foreground transition-transform duration-150 group-hover:scale-110" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground leading-[20px]">hi@ch.sh</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">Email</p>
      </div>
      <Copy size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
    </button>
  );
}

export function CopyEmail({ className, variant, noIcon }: { className?: string; variant?: 'pill'; noIcon?: boolean }) {
  const handleCopy = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    toast.success('Email copied to clipboard');
  };

  if (variant === 'pill') {
    return (
      <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
        <Envelope weight="bold" data-icon="inline-start" className="text-muted-foreground" />
        hi@ch.sh
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn('inline-flex items-center gap-1 h-auto px-0 py-0 hover:bg-transparent dark:hover:bg-transparent', className)}
      onClick={handleCopy}
    >
      hi@ch.sh
      {!noIcon && <Copy weight="bold" className="opacity-50" />}
    </Button>
  );
}
