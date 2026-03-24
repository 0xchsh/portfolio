'use client';

import { Envelope, Copy } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      className={cn('inline-flex items-center gap-1 h-auto px-0 py-0 hover:bg-transparent', className)}
      onClick={handleCopy}
    >
      hi@ch.sh
      {!noIcon && <Copy weight="bold" className="opacity-50" />}
    </Button>
  );
}
