import Image from 'next/image';
import { XLogo, GithubLogo, Envelope, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { WorkCarousel } from '@/components/home/WorkCarousel';
import { WeatherIcon } from '@/components/home/WeatherIcon';
import { CommitGraph } from '@/components/home/CommitGraph';
import { CopyEmail } from '@/components/home/CopyEmail';
import { WeatherPill } from '@/components/home/WeatherPill';
import { LiveClock } from '@/components/home/LiveClock';
import { V2Controls } from '@/components/home/V2Controls';
import { AgentModeOverlay } from '@/components/shared/AgentModeOverlay';
import { FadeIn } from '@/components/shared/FadeIn';
import { ProjectDrawer } from '@/components/home/ProjectDrawer';
import { ArtDrawer } from '@/components/home/ArtDrawer';
import feedData from '@/data/feed.json';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommitDay = {
  date: string;
  count: number;
  repos: string[];
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getCommitData() {
  try {
    const responses = await Promise.all(
      [1, 2].map((page) =>
        fetch(
          `https://api.github.com/users/0xchsh/events?per_page=100&page=${page}`,
          { next: { revalidate: 3600 } },
        ).then((r) => (r.ok ? r.json() : [])),
      ),
    );
    const events = responses.flat();
    if (!Array.isArray(events)) return { days: [] as CommitDay[], totalCommits: 0 };

    const TZ = 'America/Chicago';
    const toLocalDate = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });

    const now = new Date();
    const commitsByDay = new Map<string, { count: number; repos: Set<string> }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000);
      commitsByDay.set(toLocalDate(d), { count: 0, repos: new Set() });
    }

    for (const event of events) {
      if (event.type === 'PushEvent') {
        const date = toLocalDate(new Date(event.created_at));
        const entry = commitsByDay.get(date);
        if (entry) {
          entry.count += event.payload?.commits?.length || event.payload?.size || 1;
          const repo = event.repo?.name?.split('/')[1] || event.repo?.name;
          if (repo) entry.repos.add(repo);
        }
      }
    }

    const days: CommitDay[] = Array.from(commitsByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { count, repos }]) => ({ date, count, repos: Array.from(repos) }));

    return { days, totalCommits: days.reduce((s, d) => s + d.count, 0) };
  } catch {
    return { days: [] as CommitDay[], totalCommits: 0 };
  }
}

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

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const projects = [
  { name: 'Snack', desc: 'List curation tool', href: 'https://snack.xyz', icon: '/icons/snack.svg', workTitle: 'Snack' },
  { name: 'Otto', desc: 'Ask anything about your cars', href: '#', icon: '/icons/otto.svg', workTitle: 'Otto' },
  { name: 'Rat Labs', desc: 'Onchain product studio', href: 'https://www.ratlabs.xyz/', icon: '/icons/ratlabs.svg', workTitle: 'Rat Labs' },
  { name: 'RGB', desc: 'Onchain media app', href: 'https://rgb.fun', icon: '/icons/rgb.svg', workTitle: 'RGB' },
];

const caseStudies = [
  { name: 'Freighter', desc: 'Flagship Stellar wallet', href: 'https://freighter.app', icon: '/icons/freighter.svg', workTitle: 'Freighter' },
  { name: 'Laboratory', desc: 'Stellar developer sandbox', href: 'https://laboratory.stellar.org', icon: '/icons/lab.svg', workTitle: 'Laboratory' },
];

const archives = [
  { name: 'ShinCN', desc: 'Personal brand design system', href: 'https://ui.ch.sh', icon: '/icons/shin.svg' },
  { name: 'AI Design Jobs', desc: 'Curated roles at AI companies', href: 'https://ai-design-jobs.vercel.app/', icon: '/icons/aidesignjobs.png', workTitle: 'AI Design Jobs' },
  { name: 'Noundation', desc: 'Community design system', href: 'https://noundation.framer.website/', icon: '/icons/noundation.svg' },
  { name: 'Noundation UI', desc: 'Framer design kit', href: 'https://noundationkit.framer.website/landing', icon: '/icons/noundation.svg' },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const linkClass =
  'text-neutral-800 dark:text-neutral-200 font-medium underline decoration-dotted decoration-neutral-300 dark:decoration-neutral-600 underline-offset-[3px] hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors duration-100';

const metaLabel =
  'text-xs text-neutral-400 dark:text-neutral-600';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">{children}</span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700 mt-px" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project list
// ---------------------------------------------------------------------------

type ProjectItem = {
  name: string;
  desc: string;
  href: string;
  icon: string;
  workTitle?: string;
};

function ProjectRow({ item, hideIcon, directLink }: { item: ProjectItem; hideIcon?: boolean; directLink?: boolean }) {
  const rowClass =
    'flex items-start gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';
  const inner = (
    <>
      {!hideIcon && (
        <Image src={item.icon} alt={item.name} width={14} height={14} className="shrink-0 dark:invert mt-[3px]" />
      )}
      <div>
        <p className="text-sm font-medium text-foreground leading-[20px]">{item.name}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">{item.desc}</p>
      </div>
    </>
  );

  if (directLink) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${rowClass} group`}>
        {inner}
        <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      </a>
    );
  }

  return (
    <ProjectDrawer project={item}>
      <button className={rowClass}>{inner}</button>
    </ProjectDrawer>
  );
}

type ArtItem = {
  title: string;
  desc?: string;
  year: string;
  images: string[];
  size: string;
  type: string[];
  collectionHref: string;
  collectionLabel: string;
};

const artItems = feedData.art as ArtItem[];

function ArtRow({ item }: { item: ArtItem }) {
  const rowClass =
    'flex items-start gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';
  return (
    <ArtDrawer item={item}>
      <button className={rowClass}>
        <div className="shrink-0 w-3.5 h-3.5 rounded-[3px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 mt-[3px]">
          <Image src={item.images[0]} alt={item.title} width={14} height={14} unoptimized className="object-contain" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-[20px]">{item.title}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">{item.desc ?? 'NFT Collection'}</p>
        </div>
      </button>
    </ArtDrawer>
  );
}

function ProjectList({ items, hideIcon, directLink }: { items: ProjectItem[]; hideIcon?: boolean; directLink?: boolean }) {
  if (items.length === 0) return <div className="mt-4" />;
  return (
    <div className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <ProjectRow key={item.name} item={item} hideIcon={hideIcon} directLink={directLink} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function V2Home() {
  const [{ days, totalCommits }, weather, commitHash] = await Promise.all([
    getCommitData(),
    getWeather(),
    getLatestCommit(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AgentModeOverlay />

      {/* Top fade */}
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-30 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-30 bg-gradient-to-t from-background to-transparent" />

      <div className="max-w-[900px] mx-auto px-5 sm:px-8 pt-12 pb-16">

        {/* ── Two-column grid ──────────────────────────────────────────── */}
        <div className="group/page flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:items-start desktop:w-fit desktop:mx-auto">

          {/* Name / title — col 1 row 1 on desktop, order 1 on mobile */}
          <div className="desktop:col-start-1 desktop:row-start-1">
            <FadeIn>
            <div className="mb-6 desktop:mb-8">
              <h1 className="text-sm font-semibold text-foreground leading-snug group/name cursor-default select-none w-fit">
                <span>Ch</span><span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">arles</span>{' '}
                <span>Sh</span><span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">in</span>
              </h1>
              <p className="text-sm text-neutral-400 dark:text-neutral-600 w-fit">Software Designer</p>
            </div>
            </FadeIn>
          </div>

          {/* Bio + sections — col 1 row 2 on desktop, order 3 on mobile */}
          <div className="order-[3] desktop:order-none desktop:col-start-1 desktop:row-start-2">

            {/* Bio */}
            <FadeIn delay={75}>
            <div className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 flex flex-col gap-4">
              <p>
                Currently the Lead Product Designer at{' '}
                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Stellar</a>.
                {' '}Previously at{' '}
                <a href="https://warbyparker.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Warby Parker</a>,{' '}
                <a href="https://uber.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Uber</a>, and{' '}
                <a href="https://weebly.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Weebly</a>.
              </p>
              <p>
                Designing interfaces and interactions that feel simple, clear, and enjoyable, especially in blockchain and AI, where new patterns are being shaped for the first time.
              </p>
              <p>
                Writing code through conversation and wiring agents together (Claude Code, OpenClaw, Paperclip).
              </p>
              <p>
                Reach me at <CopyEmail className={linkClass} /> or dm on{' '}
                <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className={linkClass}>x.com</a>
              </p>
            </div>
            </FadeIn>

            <FadeIn delay={150}>
            {/* Case Studies */}
            <section className="mt-8">
              <SectionLabel>Case Studies</SectionLabel>
              <ProjectList items={caseStudies} />
            </section>
            </FadeIn>

            {/* Projects */}
            <FadeIn delay={160}>
            <section className="mt-8">
              <SectionLabel>Projects</SectionLabel>
              <ProjectList items={projects} />
            </section>
            </FadeIn>

            <FadeIn delay={175}>
            {/* More */}
            <section className="mt-8">
              <SectionLabel>Additional</SectionLabel>
              <ProjectList items={archives} directLink />
            </section>
            </FadeIn>

            <FadeIn delay={200}>
            {/* Art */}
            <section className="mt-8">
              <SectionLabel>Art</SectionLabel>
              <div className="mt-4 flex flex-col gap-2">
                {artItems.map((item) => (
                  <ArtRow key={item.title} item={item} />
                ))}
              </div>
            </section>
            </FadeIn>

            {/* Connect */}
            <FadeIn delay={225}>
            <section className="mt-8">
              <SectionLabel>Connect</SectionLabel>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 w-[calc(100%+1.5rem)]">
                  <Envelope size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" />
                  <CopyEmail noIcon className="text-sm font-medium text-foreground cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors duration-100" />
                </div>
                <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 w-[calc(100%+1.5rem)] group">
                  <XLogo size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" />
                  <span className="text-sm font-medium text-foreground">chshux</span>
                </a>
                <a href="https://github.com/0xchsh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 w-[calc(100%+1.5rem)] group">
                  <GithubLogo size={14} weight="fill" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" />
                  <span className="text-sm font-medium text-foreground">0xchsh</span>
                </a>
                <a href="https://farcaster.xyz/chsh.eth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 w-[calc(100%+1.5rem)] group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" aria-hidden="true">
                    <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">chsh</span>
                </a>
              </div>
            </section>
            </FadeIn>

            {/* Footer — pfp + copyright + hash + weather */}
            <FadeIn delay={275}>
            <div className="flex items-center justify-between mt-[72px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-2">
                  <video
                    src="/images/pfp.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs text-neutral-400 dark:text-neutral-600">신 © 2026</span>
                </div>
                {commitHash && (
                  <>
                    <span className="text-xs text-neutral-400 dark:text-neutral-600">·</span>
                    <a
                      href={commitHash.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-100 underline decoration-dotted underline-offset-2"
                    >
                      {commitHash.sha.toUpperCase()}
                    </a>
                  </>
                )}
              </div>
              <div className="hidden desktop:flex items-center gap-[2px]">
                <WeatherIcon code={weather.code} size={16} />
                <span className="text-xs text-neutral-400 dark:text-neutral-600">Chicago, IL</span>
              </div>
            </div>
            </FadeIn>
          </div>

          {/* Right column — col 2 rows 1-2 on desktop, order 2 on mobile */}
          <FadeIn delay={50} className="order-[2] desktop:order-none desktop:col-start-2 desktop:row-start-1 desktop:row-span-2 mt-6 desktop:mt-0 desktop:sticky desktop:top-12">
          <div className="desktop:pt-5">

            {/* Controls + Time — desktop only, top of right column */}
            <div className="hidden desktop:flex mb-8 items-center justify-between">
              <div className="opacity-0 group-hover/page:opacity-100 transition-opacity duration-200">
              <V2Controls />
              </div>
              <span className="text-sm text-neutral-400 dark:text-neutral-600"><LiveClock /></span>
            </div>

            {/* Weather pill — mobile only */}
            <div className="flex desktop:hidden mb-4">
              <WeatherPill weather={weather} variant="static" />
            </div>

            <WorkCarousel />

            <section className="mt-6 flex flex-col gap-2">
              <CommitGraph days={days} />
              <div className="flex items-center justify-between">
                <span className={metaLabel}>Last 30 days</span>
                <span className={metaLabel}>{totalCommits} commits</span>
              </div>
            </section>

          </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
