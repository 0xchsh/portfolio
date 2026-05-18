import { WeatherPill } from '@/components/home/WeatherPill';
import { AgentModeToggle } from '@/components/shared/AgentModeToggle';
import { AgentModeOverlay } from '@/components/shared/AgentModeOverlay';
import { KeyboardNav } from '@/components/home/KeyboardNav';
import { AnimatedNav } from '@/components/shared/AnimatedNav';
import { PageTransition } from '@/components/shared/PageTransition';

const WMO_DESC: Record<number, string> = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

async function getWeather() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=41.8781&longitude=-87.6298&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=1',
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    const code = data.current.weather_code as number;
    return {
      code,
      tempF: Math.round(data.current.temperature_2m) as number,
      desc: WMO_DESC[code] ?? 'Clear',
      highF: Math.round(data.daily.temperature_2m_max[0]) as number,
      lowF: Math.round(data.daily.temperature_2m_min[0]) as number,
    };
  } catch {
    return { code: 0, tempF: null, desc: 'Clear', highF: null, lowF: null };
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

const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';

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
    <div className={`min-h-screen flex flex-col ${isCanvas ? '' : 'bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900'}`}>
      <AgentModeOverlay />
      <KeyboardNav />
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex justify-between items-start px-4 py-6 sm:px-6 [&>*]:pointer-events-auto">
          <AnimatedNav />
          <WeatherPill weather={weather} />
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <PageTransition>
        {children}
      </PageTransition>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      {!isCanvas && (
        <footer className="w-full z-10 sm:fixed sm:bottom-0 sm:left-0 sm:right-0">
          <div className="flex justify-between items-end px-4 py-6 sm:px-6"
            style={{
              background: 'linear-gradient(to top, var(--background) 0%, var(--background) 72%, oklch(from var(--background) l c h / 0) 100%)',
              paddingTop: '1.5rem',
            }}
          >
            <AgentModeToggle />
            <div className="flex items-center gap-1 translate-y-[4px]">
              {commitHash && (
                <>
                  <a
                    href={commitHash.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-normal uppercase text-neutral-400 tracking-wide underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100"
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
