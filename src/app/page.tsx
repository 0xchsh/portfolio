import Image from 'next/image';
import { XLogo, GithubLogo, LinkedinLogo, Envelope, ArrowUpRight, Copy } from '@phosphor-icons/react/dist/ssr';
import { WorkCarousel } from '@/components/home/WorkCarousel';
import { WeatherIcon } from '@/components/home/WeatherIcon';
import { CommitGraph } from '@/components/home/CommitGraph';
import { CopyEmail, CopyEmailRow } from '@/components/home/CopyEmail';
import { V2LeftContent } from '@/components/home/V2LeftContent';
import { FadeIn } from '@/components/shared/FadeIn';
import { ProjectRow, type ProjectItem } from '@/components/home/ProjectRow';
import { ArtDrawer } from '@/components/home/ArtDrawer';
import { DrawerNavProvider } from '@/components/home/DrawerNav';
import feedData from '@/data/feed.json';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommitDay = {
  date: string;
  count: number;
  repos: string[];
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getCommitData() {
  try {
    const TZ = 'America/Chicago';
    const toLocalDate = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });

    const now = new Date();

    const commitsByDay = new Map<string, { count: number; repos: Set<string> }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000);
      commitsByDay.set(toLocalDate(d), { count: 0, repos: new Set() });
    }

    const token = process.env.GITHUB_TOKEN?.trim();
    if (!token) return { days: [] as CommitDay[], totalCommits: 0 };

    // Oldest day bucket (YYYY-MM-DD) — lower bound for the commit search.
    const since = Array.from(commitsByDay.keys()).sort()[0];

    // Use the commit search API rather than contributionsCollection. The
    // contributions API omits private-repo commits unless GitHub's "include
    // private contributions on my profile" toggle is on *and* a long list of
    // other visibility rules line up — so private/org commits silently vanish.
    // search/commits returns every commit the token can see, so private and
    // org (exa-labs) commits show as long as the token has access to the repo.
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.cloak-preview+json',
    };

    const MAX_PAGES = 10; // 100/page → up to 1000 commits, well past 30d of activity
    for (let page = 1; page <= MAX_PAGES; page++) {
      const q = encodeURIComponent(`author:0xchsh author-date:>=${since}`);
      const url = `https://api.github.com/search/commits?q=${q}&sort=author-date&order=desc&per_page=100&page=${page}`;

      const res = await fetch(url, { headers, next: { revalidate: 3600 } });
      if (!res.ok) {
        console.error('[CommitGraph] search/commits error:', res.status, await res.text().catch(() => ''));
        break;
      }

      const json = await res.json();
      const items: Array<{
        commit?: { author?: { date?: string } };
        repository?: { name?: string; private?: boolean; owner?: { login?: string } };
      }> = json?.items ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        const occurredAt = item?.commit?.author?.date;
        if (!occurredAt) continue;
        const date = toLocalDate(new Date(occurredAt));
        const entry = commitsByDay.get(date);
        if (!entry) continue; // outside the 30-day window

        const repo = item.repository ?? {};
        const ownerLogin = repo.owner?.login ?? '';
        const isExa = ownerLogin === 'exa-labs';
        const displayName = isExa ? 'exa' : repo.private ? 'private' : repo.name;
        entry.count += 1;
        if (displayName) entry.repos.add(displayName);
      }

      if (items.length < 100) break;
    }

    const days: CommitDay[] = Array.from(commitsByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { count, repos }]) => ({ date, count, repos: Array.from(repos) }));

    return { days, totalCommits: days.reduce((s, d) => s + d.count, 0) };
  } catch (err) {
    console.error('[CommitGraph] Exception:', err);
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

const caseStudies = [
  { name: 'Freighter', desc: 'Flagship Stellar wallet', href: 'https://freighter.app', icon: '/icons/freighter.svg', workTitle: 'Freighter' },
  { name: 'Snack', desc: 'List curation tool', href: 'https://snack.xyz', icon: '/icons/snack.svg', workTitle: 'Snack' },
  { name: 'Laboratory', desc: 'Stellar developer sandbox', href: 'https://laboratory.stellar.org', icon: '/icons/lab.svg', workTitle: 'Laboratory' },
];

// directLink: true = external link, false/undefined = opens drawer
const projects: (ProjectItem & { directLink?: boolean })[] = [
  { name: 'ElevenRooms', desc: 'ASCII Soundscapes', href: 'https://elevenrooms.vercel.app', icon: '/icons/elevenrooms.svg', workTitle: 'ElevenRooms', directLink: true },
  { name: 'AI Design Jobs', desc: 'Curated design jobs', href: 'https://ai-design-jobs.vercel.app/', icon: '/icons/ai-jobs.svg', workTitle: 'AI Design Jobs', directLink: true },
  { name: 'RGB', desc: 'Onchain identity framework', href: 'https://rgb.fun', icon: '/icons/rgb.svg', workTitle: 'RGB', directLink: true },
  { name: 'Rat Labs', desc: 'Onchain product studio', href: 'https://www.ratlabs.xyz/', icon: '/icons/ratlabs.svg', directLink: true },
  { name: 'Noundation', desc: 'Community design system', href: 'https://noundation.framer.website/', icon: '/icons/noundation.svg', directLink: true },
  { name: 'Noundation UI', desc: 'Framer design kit', href: 'https://noundationkit.framer.website/landing', icon: '/icons/noundation.svg', directLink: true },
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
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">{children}</span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700" />
    </div>
  );
}

// ProjectRow lives in src/components/home/ProjectRow.tsx (client component) so
// the <button> child it passes to ProjectDrawer is a real React element rather
// than a server-component lazy reference. vaul's Drawer.Root suppresses lazy
// children during dev-mode SSR streaming, which left Featured rows blank.

type ArtItem = {
  title: string;
  desc?: string;
  year: string;
  icon?: string;
  images: string[];
  size: string;
  type: string[];
  collectionHref: string;
  collectionLabel: string;
  links?: { label: string; href: string }[];
};

const artItems = feedData.art as ArtItem[];

function ArtRow({ item, navIndex }: { item: ArtItem; navIndex?: number }) {
  const rowClass =
    'group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';
  return (
    <ArtDrawer item={item} navIndex={navIndex}>
      <button className={rowClass}>
        <div className="shrink-0 w-10 h-10 rounded-[10px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150">
          <Image src={item.icon ?? item.images[0]} alt={item.title} width={40} height={40} unoptimized className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-[20px]">{item.title}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">{item.desc ?? 'NFT Collection'}</p>
        </div>
      </button>
    </ArtDrawer>
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

  const projectsWithDrawer = projects.filter(p => !p.directLink);
  const navTotal = caseStudies.length + projectsWithDrawer.length + artItems.length;
  const artNavStart = caseStudies.length + projectsWithDrawer.length;
  const projectNavMap = new Map<string, number>();
  let pIdx = caseStudies.length;
  for (const p of projectsWithDrawer) projectNavMap.set(p.name, pIdx++);

  return (
    <div className="flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:items-start desktop:w-fit desktop:mx-auto">

      {/* Left column — Bio + sections */}
      <div className="order-[3] mt-2 desktop:mt-0 desktop:order-none">
      <DrawerNavProvider total={navTotal}>
      <V2LeftContent>

        {/* Bio */}
        <FadeIn delay={75}>
        <div className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 flex flex-col gap-3">
          <p>
            Currently the Lead Product Designer at{' '}
            <a href="https://exa.ai" target="_blank" rel="noopener noreferrer" className={linkClass}>Exa</a>.
            {' '}Previously at{' '}
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Stellar</a>,{' '}
            <a href="https://warbyparker.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Warby Parker</a>,{' '}
            <a href="https://uber.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Uber</a>, and{' '}
            <a href="https://weebly.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Weebly</a>.
          </p>
          <p>
            Designing interfaces and interactions that feel simple, clear, and enjoyable, especially in blockchain and AI, where new patterns are being shaped for the first time.
          </p>
          <p>
            Spending my time writing code through conversation and wiring agents together.
          </p>
          <p>
            Reach me at <CopyEmail className={linkClass} /> or dm on{' '}
            <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className={linkClass}>x.com</a>
          </p>
        </div>
        </FadeIn>

        {/* Case Studies */}
        <section className="mt-8">
          <FadeIn delay={150}><SectionLabel>Featured</SectionLabel></FadeIn>
          <div className="mt-3 desktop:mt-4 flex flex-col gap-3">
            {caseStudies.map((item, i) => (
              <FadeIn key={item.name} delay={175 + i * 40}>
                <ProjectRow item={item} navIndex={i} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mt-8">
          <FadeIn delay={175 + caseStudies.length * 40}><SectionLabel>Projects</SectionLabel></FadeIn>
          <div className="mt-3 desktop:mt-4 flex flex-col gap-3">
            {projects.map((item, i) => (
              <FadeIn key={item.name} delay={200 + caseStudies.length * 40 + i * 40}>
                <ProjectRow item={item} directLink={item.directLink} navIndex={projectNavMap.get(item.name)} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Art */}
        <section className="mt-8">
          <FadeIn delay={200 + (caseStudies.length + projects.length) * 40}><SectionLabel>Art</SectionLabel></FadeIn>
          <div className="mt-3 desktop:mt-4 flex flex-col gap-3">
            {artItems.map((item, i) => (
              <FadeIn key={item.title} delay={225 + (caseStudies.length + projects.length) * 40 + i * 40}>
                <ArtRow item={item} navIndex={artNavStart + i} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Connect */}
        <section className="mt-8">
          <FadeIn delay={225 + (caseStudies.length + projects.length + artItems.length) * 40}><SectionLabel>Connect</SectionLabel></FadeIn>
          <div className="mt-3 desktop:mt-4 flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const connectBase = 250 + (caseStudies.length + projects.length + artItems.length) * 40;
              const d = connectBase + i * 40;
              if (i === 0) return <FadeIn key="email" delay={d}><CopyEmailRow /></FadeIn>;
              if (i === 1) return (
                <FadeIn key="x" delay={d}>
                  <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 w-[calc(100%+1.5rem)]">
                    <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
                      <XLogo size={20} weight="bold" className="text-foreground transition-transform duration-150 group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-[20px]">chshux</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">X.com</p>
                    </div>
                    <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
                  </a>
                </FadeIn>
              );
              if (i === 2) return (
                <FadeIn key="github" delay={d}>
                  <a href="https://github.com/0xchsh" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 w-[calc(100%+1.5rem)]">
                    <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
                      <GithubLogo size={20} weight="fill" className="text-foreground transition-transform duration-150 group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-[20px]">0xchsh</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">GitHub</p>
                    </div>
                    <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
                  </a>
                </FadeIn>
              );
              if (i === 3) return (
                <FadeIn key="linkedin" delay={d}>
                  <a href="https://www.linkedin.com/in/chshux/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 w-[calc(100%+1.5rem)]">
                    <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
                      <LinkedinLogo size={20} weight="fill" className="text-foreground transition-transform duration-150 group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-[20px]">chshux</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">LinkedIn</p>
                    </div>
                    <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
                  </a>
                </FadeIn>
              );
              return (
                <FadeIn key="farcaster" delay={d}>
                  <a href="https://farcaster.xyz/chsh.eth" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 pl-3 pr-4 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 w-[calc(100%+1.5rem)]">
                    <div className="shrink-0 w-10 h-10 rounded-[10px] bg-neutral-50 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 transition-colors duration-150 flex items-center justify-center overflow-hidden">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground transition-transform duration-150 group-hover:scale-110" aria-hidden="true">
                        <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-[20px]">chsh</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">Farcaster</p>
                    </div>
                    <ArrowUpRight size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150" />
                  </a>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* Footer — pfp + copyright + hash + weather */}
        <FadeIn delay={275}>
        <div className="flex items-center justify-between mt-[72px]">
          <div className="flex items-center gap-[4px]">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                <video
                  src="/images/pfp.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">신 © 2026</span>
            </div>
            {commitHash && (
              <>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">·</span>
                <a
                  href={commitHash.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-100 underline decoration-dotted underline-offset-2"
                >
                  {commitHash.sha.toUpperCase()}
                </a>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <WeatherIcon code={weather.code} size={24} />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Chicago, IL</span>
          </div>
        </div>
        </FadeIn>
      </V2LeftContent>
      </DrawerNavProvider>
      </div>

      {/* Right column — carousel + commits */}
      <FadeIn delay={50} className="order-[2] desktop:order-none desktop:sticky desktop:top-12">
        <WorkCarousel />

        <section className="mt-6 flex flex-col gap-3">
          <CommitGraph days={days} />
          <div className="flex items-center justify-between">
            <span className={metaLabel}>Last 30 days</span>
            <span className={`${metaLabel} tabular-nums`}>{totalCommits} commits</span>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
