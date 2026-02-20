export function FooterTicker({ commitHash }: { commitHash: string | null }) {
  if (!commitHash) return null;

  return (
    <span className="text-xs uppercase text-neutral-400 tracking-wide">
      Last commit: {commitHash}
    </span>
  );
}
