'use client';

import { EnvelopeSimple } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function CopyEmail({ className, variant }: { className?: string; variant?: 'pill' }) {
  const handleCopy = () => {
    navigator.clipboard.writeText('hi@ch.sh');
    toast.success('Email copied to clipboard');
  };

  if (variant === 'pill') {
    return (
      <Badge
        variant="outline"
        render={<button type="button" onClick={handleCopy} className="cursor-pointer" />}
      >
        <EnvelopeSimple size={12} weight="regular" />
        hi@ch.sh
      </Badge>
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
