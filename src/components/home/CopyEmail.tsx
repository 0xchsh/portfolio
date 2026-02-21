'use client';

import { toast } from 'sonner';

export function CopyEmail({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={`cursor-pointer ${className}`}
      onClick={() => {
        navigator.clipboard.writeText('hi@ch.sh');
        toast.success('Email copied to clipboard');
      }}
    >
      hi@ch.sh
    </button>
  );
}
