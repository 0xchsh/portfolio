import { WeatherIcon } from '@/components/home/WeatherIcon';
import { LiveClock } from '@/components/home/LiveClock';
import { FooterTicker } from '@/components/shared/FooterTicker';
import { AgentModeToggle } from '@/components/shared/AgentModeToggle';
import { KeyboardNav } from '@/components/home/KeyboardNav';
import { AnimatedNav } from '@/components/shared/AnimatedNav';
import { PageTransition } from '@/components/shared/PageTransition';

async function getWeather() {
  try {
    const res = await fetch('https://wttr.in/Chicago?format=j1', {
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    return { code: parseInt(data.current_condition[0].weatherCode) };
  } catch {
    return { code: 113 };
  }
}

async function getLatestCommit() {
  try {
    const res = await fetch('https://api.github.com/users/0xchsh/events?per_page=5', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const events = await res.json();
    const pushEvent = events.find((e: Record<string, unknown>) => e.type === 'PushEvent');
    const payload = pushEvent?.payload as Record<string, unknown> | undefined;
    const commits = payload?.commits as Array<Record<string, string>> | undefined;
    if (!commits?.length) return null;
    return commits[commits.length - 1].sha.slice(0, 7);
  } catch {
    return null;
  }
}

const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';

export async function PageShell({
  children,
  staticFooter,
}: {
  currentPath?: string;
  children: React.ReactNode;
  staticFooter?: boolean;
}) {
  const [weather, commitHash] = await Promise.all([getWeather(), getLatestCommit()]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex flex-col">
      <KeyboardNav />
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-start p-4"
          style={{
            background: 'linear-gradient(to bottom, rgb(255 255 255) 0%, rgb(255 255 255) 72%, rgb(255 255 255 / 0) 100%)',
            paddingBottom: '1rem',
          }}
        >
          <AnimatedNav />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-400">Chicago, IL</span>
            <WeatherIcon code={weather.code} />
            <LiveClock />
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <PageTransition>
        {children}
      </PageTransition>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className={staticFooter ? 'w-full z-10' : 'fixed bottom-0 left-0 right-0 z-10'}>
        <div className="flex justify-between items-center p-4"
          style={{
            background: 'linear-gradient(to top, rgb(255 255 255) 0%, rgb(255 255 255) 72%, rgb(255 255 255 / 0) 100%)',
            paddingTop: '1rem',
          }}
        >
          <AgentModeToggle />
          <div className="flex items-center gap-3">
            <FooterTicker commitHash={commitHash} />
            <span className={mutedLabel}>신 © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
