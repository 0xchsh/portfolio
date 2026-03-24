'use client';

import { Envelope, Copy } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyEmail({ className, variant, noIcon }: { className?: string; variant?: 'pill'; noIcon?: boolean }) {
  const handleCopy = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    toast.success('Email copied to clipboard');
  };

  if (variant === 'pill') {
    return (
      <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
        <Envelope size={14} weight="bold" className="text-neutral-400" />
        hi@ch.sh
      </Button>
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 cursor-pointer ${className}`}
      onClick={handleCopy}
    >
      hi@ch.sh
      {!noIcon && <Copy size={14} weight="bold" className="opacity-50" />}
    </button>
  );
}
