import { WeatherIcon } from '@/components/home/WeatherIcon';
import { LiveClock } from '@/components/home/LiveClock';
import { AgentModeToggle } from '@/components/shared/AgentModeToggle';
import { AgentModeOverlay } from '@/components/shared/AgentModeOverlay';
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
    const res = await fetch('https://api.github.com/repos/0xchsh/portfolio/commits?per_page=1', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const commits = await res.json();
    if (!commits?.length) return null;
    return { sha: commits[0].sha.slice(0, 7), url: commits[0].html_url };
  } catch {
    return null;
  }
}

const mutedLabel = 'text-sm uppercase text-neutral-400 tracking-wide';

export async function PageShell({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'canvas';
}) {
  const isCanvas = variant === 'canvas';
  const [weather, commitHash] = await Promise.all([getWeather(), getLatestCommit()]);

  return (
    <div className={`min-h-screen flex flex-col ${isCanvas ? '' : 'bg-gradient-to-b from-white to-neutral-50'}`}>
      <AgentModeOverlay />
      <KeyboardNav />
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex justify-between items-start px-4 py-6 sm:px-6 [&>*]:pointer-events-auto">
          <AnimatedNav />
          <div className="flex items-center gap-2 text-sm liquid-glass rounded-full px-3 py-1.5">
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
      {!isCanvas && (
        <footer className="w-full z-10 sm:fixed sm:bottom-0 sm:left-0 sm:right-0">
          <div className="flex justify-between items-center p-6"
            style={{
              background: 'linear-gradient(to top, rgb(255 255 255) 0%, rgb(255 255 255) 72%, rgb(255 255 255 / 0) 100%)',
              paddingTop: '1.5rem',
            }}
          >
            <AgentModeToggle />
            <div className="flex items-center gap-1">
              {commitHash && (
                <>
                  <a
                    href={commitHash.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal uppercase text-neutral-400 tracking-wide underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100"
                  >
                    {commitHash.sha}
                  </a>
                  <span className="text-neutral-300">·</span>
                </>
              )}
              <span className={mutedLabel}>신 © 2026</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
