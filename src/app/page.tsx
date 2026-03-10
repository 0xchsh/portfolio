import Image from 'next/image';
import Link from 'next/link';
import { XLogo, GithubLogo, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { Avatar } from '@/components/home/Avatar';
import { CommitGraph } from '@/components/home/CommitGraph';
import { CopyEmail } from '@/components/home/CopyEmail';
import { FadeIn } from '@/components/shared/FadeIn';
import { PageShell } from '@/components/shared/PageShell';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

export type CommitDay = {
  date: string;
  count: number;
  repos: string[];
};

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
    const toLocalDate = (d: Date) =>
      d.toLocaleDateString('en-CA', { timeZone: TZ }); // en-CA gives YYYY-MM-DD

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

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function Dot() {
  return <div className="flex-1 border-t border-dotted border-neutral-300" />;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const experience = [
  { name: 'Stellar', desc: 'Blockchain for payments', year: 'Current', icon: '/icons/stellar.svg', href: 'https://stellar.org' },
  { name: 'Warby Parker', desc: 'Lifestyle eyewear brand', year: '2018', icon: '/icons/warbyparker.svg', href: 'https://warbyparker.com' },
  { name: 'Uber', desc: 'Ride-sharing platform', year: '2017', icon: '/icons/uber.svg', href: 'https://uber.com' },
  { name: 'Weebly', desc: 'Drag-and-drop website builder', year: '2016', icon: '/icons/weebly.svg', href: 'https://weebly.com' },
];

const projects = [
  { name: 'ClawPanel', desc: 'Dashboard for OpenClaw', href: '#', icon: '/icons/clawpanel.svg', status: 'in-progress' as const },
  { name: 'Otto', desc: 'Ask anything about your cars', href: '#', icon: '/icons/otto.svg', status: 'in-progress' as const },
  { name: 'Snack', desc: 'List curation tool', href: 'https://snack.xyz', icon: '/icons/snack.svg', status: 'live' as const },
  { name: 'Rat Labs', desc: 'Onchain product studio', href: 'https://www.ratlabs.xyz/', icon: '/icons/ratlabs.svg', status: 'live' as const },
  { name: 'rgb.fun', desc: 'NFT collection (16,777,216)', href: 'https://rgb.fun', icon: '/icons/rgb.svg', status: 'live' as const },
  { name: 'rgb.so', desc: 'Onchain media', href: 'https://rgbso.framer.website/', icon: '/icons/rgb.svg', status: 'archived' as const },
  { name: 'Noundation', desc: 'Community design system', href: 'https://noundation.framer.website/', icon: '/icons/noundation.svg', status: 'archived' as const },
  { name: 'Noundation UI', desc: 'Framer design kit', href: 'https://noundationkit.framer.website/landing', icon: '/icons/noundation.svg', status: 'archived' as const },
];

function FarcasterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
    </svg>
  );
}

const connect = [
  { name: 'X.com', desc: '@chshux', href: 'https://x.com/chshux', icon: 'x' },
  { name: 'GitHub', desc: '@0xchsh', href: 'https://github.com/0xchsh', icon: 'github' },
  { name: 'Farcaster', desc: '@chsh.eth', href: 'https://warpcast.com/chsh.eth', icon: 'farcaster' },
] as const;

const linkClass = 'text-neutral-950 font-medium underline decoration-dotted decoration-neutral-300 underline-offset-[4px] hover:text-neutral-500 hover:decoration-neutral-400 transition-colors duration-100';
const mutedLabel = 'text-xs uppercase text-neutral-400 tracking-wide';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home() {
  const commitData = await getCommitData();

  return (
    <PageShell>
      <main className="flex-1 w-full max-w-[452px] mx-auto px-4 pt-24 desktop:pt-20 pb-[72px] sm:pb-[120px]">
        {/* Avatar */}
        <FadeIn>
          <Avatar />
        </FadeIn>

        {/* Bio */}
        <FadeIn delay={50}>
          <div className="mt-6 text-base leading-relaxed text-neutral-400">
            <p>
              I&apos;m <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className={linkClass}>Charles</a>, a product designer based in Chicago. I care about making interfaces and interactions that feel simple, clear, and enjoyable to use — especially in blockchain and AI, where these patterns are being designed for the first time.
            </p>

            <p className="mt-4">
              I&apos;m currently the Lead Product Designer at{' '}
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className={linkClass}>Stellar</a>.
            </p>

            <p className="mt-4">
              Previously at{' '}
              <a href="https://warbyparker.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Warby Parker</a>
              ,{' '}
              <a href="https://uber.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Uber</a>, and{' '}
              <a href="https://weebly.com" target="_blank" rel="noopener noreferrer" className={linkClass}>Weebly</a>. I do my best work iterating fast with talented engineers, staying close to the thing we&apos;re making.
            </p>

            <p className="mt-4">
              If you&apos;re working on something interesting, let&apos;s chat. Send me an email at{' '}
              <CopyEmail className={linkClass} /> or dm on{' '}
              <a href="https://x.com/chshux" target="_blank" rel="noopener noreferrer" className={linkClass}>x.com</a>
            </p>
          </div>
        </FadeIn>

        {/* ── Commit Activity ─────────────────────────────────────────── */}
        <FadeIn delay={100}>
          <section className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={mutedLabel}>Last 30 Days</span>
              <Dot />
              <span className={mutedLabel}>{commitData.totalCommits} Commits</span>
            </div>
            <CommitGraph days={commitData.days} />
          </section>
        </FadeIn>

        {/* ── Experience ──────────────────────────────────────────────── */}
        <FadeIn delay={150}>
        <section className="mt-8 flex flex-col gap-4">
          <span className={mutedLabel}>Experience</span>
          <div className="flex flex-col gap-2">
            {experience.map((item) => (
              <div key={item.name} className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Image src={item.icon} alt={item.name} width={16} height={16} className="shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`text-sm shrink-0 ${linkClass}`}>{item.name}</a>
                    <span className="text-sm text-neutral-400">·</span>
                    <span className="text-sm text-neutral-400 truncate">{item.desc}</span>
                  </div>
                </div>
                <Dot />
                <span className="text-sm text-neutral-400 shrink-0">{item.year}</span>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* ── Projects ────────────────────────────────────────────────── */}
        <FadeIn delay={200}>
        <section className="mt-8 flex flex-col gap-4">
          <span className={mutedLabel}>Projects</span>
          <div className="flex flex-col gap-2">
            {projects.map((item) => (
              <div key={item.name} className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Image src={item.icon} alt={item.name} width={16} height={16} className="shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    {item.href === '#' ? (
                      <span className="text-sm text-neutral-950 font-medium shrink-0">{item.name}</span>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm shrink-0 ${linkClass}`}
                      >
                        {item.name}
                      </a>
                    )}
                    {item.desc ? (
                      <>
                        <span className="text-sm text-neutral-400">·</span>
                        <span className="text-sm text-neutral-400 truncate">{item.desc}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <Dot />
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.status === 'in-progress' && (
                    <span className="text-sm text-blue-500 badge-shimmer">In Progress</span>
                  )}
                  {item.status === 'live' && (
                    <span className="flex items-center gap-1 text-sm text-neutral-400">Live<span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" /><span className="relative rounded-full h-1.5 w-1.5 bg-green-500" /></span></span>
                  )}
                  {item.status === 'archived' && (
                    <span className="text-sm text-neutral-300 line-through">Archived</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        </FadeIn>

        {/* ── Connect ────────────────────────────────────────────────── */}
        <FadeIn delay={250}>
        <section className="mt-8 flex flex-col gap-4">
          <span className={mutedLabel}>Connect</span>
          <div className="flex flex-col gap-2">
            {connect.map((item) => (
              <div key={item.name} className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-neutral-950 shrink-0">
                    {item.icon === 'x' && <XLogo size={16} weight="bold" />}
                    {item.icon === 'github' && <GithubLogo size={16} weight="bold" />}
                    {item.icon === 'farcaster' && <FarcasterIcon size={16} />}
                  </span>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={`text-sm ${linkClass}`}>{item.name}</a>
                </div>
                <Dot />
                <span className="text-sm text-neutral-400">{item.desc}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-neutral-950 shrink-0">
                  <EnvelopeSimple size={16} weight="regular" />
                </span>
                <CopyEmail className={`text-sm ${linkClass}`} />
              </div>
              <Dot />
              <span className="text-sm text-neutral-400">Email</span>
            </div>
          </div>
        </section>
        </FadeIn>
      </main>
    </PageShell>
  );
}
