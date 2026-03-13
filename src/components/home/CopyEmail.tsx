'use client';

import { Envelope } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyEmail({ className, variant }: { className?: string; variant?: 'pill' }) {
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
      className={`cursor-pointer ${className}`}
      onClick={handleCopy}
    >
      hi@ch.sh
    </button>
  );
}
