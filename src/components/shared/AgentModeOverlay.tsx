'use client';

import { useAgentMode } from '@/components/providers/AgentModeProvider';
import { AgentModeToggle } from '@/components/shared/AgentModeToggle';

const MARKDOWN = `# Charles Shin


## About

I'm currently the Lead Product Designer at Stellar (https://stellar.org). Previously at Warby Parker, Uber, and Weebly.

Running a small software factory off a Mac Mini. Wiring together agents — Claude Code, OpenClaw, Paperclip — and watching them ship things without me in the room. Still figuring out where the designer fits when the loop closes itself.

Most of my thinking lives at the intersection of crypto and AI: wallets that act, payments without friction, agents that own resources. These problems don't have design patterns yet. That's the whole point.

Reach me at hi@ch.sh or dm on x.com (@chshux).

## Experience

- **Stellar** · Blockchain for payments · Current
  https://stellar.org
- **Warby Parker** · Lifestyle eyewear brand · 2018
  https://warbyparker.com
- **Uber** · Ride-sharing platform · 2017
  https://uber.com
- **Weebly** · Drag-and-drop website builder · 2016
  https://weebly.com

## Projects

- **ClawPanel** · Dashboard for OpenClaw · 2026
- **Otto** · Ask anything about your cars · 2026
- **Snack** · List curation tool · 2025
  https://snack.xyz
- **ShinCN** · Personal brand design system · 2026
  https://ui.ch.sh
- **Rat Labs** · Onchain product studio · 2021
  https://www.ratlabs.xyz/
- **rgb.fun** · NFT collection (16,777,216) · 2024
  https://rgb.fun
- **rgb.so** · Onchain media · 2023
  https://rgbso.framer.website/
- **Noundation** · Community design system · 2022
- **Noundation UI** · Framer design kit · 2022

## Connect

- X: @chshux — https://x.com/chshux
- GitHub: @0xchsh — https://github.com/0xchsh
- Farcaster: @chsh.eth — https://warpcast.com/chsh.eth
- Email: hi@ch.sh

## Tools

- Figma, Framer, Cursor, Claude Code

## Structured Data

- Name: Charles Shin
- Role: Lead Product Designer
- Company: Stellar (stellar.org)
- Location: Chicago, IL
- Timezone: Central Time (CT)
- Work style: Remote
- Open to: Full-time or freelance opportunities
- Contact: hi@ch.sh or DM on X (@chshux)
- Response time: Within 24 hours
- Website: ch.sh
- Portfolio: ch.sh/work
- Specialties: Product design, blockchain, AI interfaces, interaction design
- Interests: Vibecoding, agentic workflows, automations, OpenClaw agents
- In short: Design lead with 8+ years of experience, quick to adapt with any design tool, comfortable creating code via conversation`;

function highlightLine(line: string, i: number) {
  // Headings: # or ##
  if (/^#{1,2}\s/.test(line)) {
    const match = line.match(/^(#{1,2}\s)(.*)/);
    if (match) {
      return (
        <span key={i}>
          <span className="text-neutral-500">{match[1]}</span>
          <span className="text-neutral-100 font-medium">{match[2]}</span>
        </span>
      );
    }
  }

  // Blockquote
  if (line.startsWith('> ')) {
    return (
      <span key={i}>
        <span className="text-neutral-500">&gt; </span>
        <span className="text-neutral-400 italic">{line.slice(2)}</span>
      </span>
    );
  }

  // List item with bold
  if (line.startsWith('- ')) {
    const parts: React.ReactNode[] = [];
    let rest = line.slice(2);
    let key = 0;

    // Parse inline **bold** and URLs
    const regex = /(\*\*.*?\*\*)|(https?:\/\/[^\s)]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(rest)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++} className="text-neutral-400">{rest.slice(lastIndex, match.index)}</span>);
      }
      if (match[1]) {
        // Bold
        parts.push(
          <span key={key++}>
            <span className="text-neutral-500">**</span>
            <span className="text-neutral-200">{match[1].slice(2, -2)}</span>
            <span className="text-neutral-500">**</span>
          </span>
        );
      } else if (match[2]) {
        // URL
        parts.push(<span key={key++} className="text-neutral-500 underline">{match[2]}</span>);
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < rest.length) {
      parts.push(<span key={key++} className="text-neutral-400">{rest.slice(lastIndex)}</span>);
    }

    return (
      <span key={i}>
        <span className="text-neutral-500">- </span>
        {parts}
      </span>
    );
  }

  // Standalone URL (indented lines like "  https://...")
  if (/^\s+https?:\/\//.test(line)) {
    const leading = line.match(/^(\s+)/)?.[1] || '';
    return (
      <span key={i}>
        {leading}<span className="text-neutral-500 underline">{line.trim()}</span>
      </span>
    );
  }

  // Plain text
  return <span key={i} className="text-neutral-400">{line}</span>;
}

async function downloadMarkdown() {
  const res = await fetch('https://raw.githubusercontent.com/0xchsh/charles-md/main/charles.md');
  const text = await res.text();
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'charles.md';
  a.click();
  URL.revokeObjectURL(url);
}

export function AgentModeOverlay() {
  const { agentMode } = useAgentMode();

  const lines = MARKDOWN.split('\n');

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-300 ${
        agentMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: '#111111' }}
    >
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={downloadMarkdown}
          className="font-mono text-sm text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
        >
          charles.md
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[452px] mx-auto px-4 py-16 pb-24">
          <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap uppercase">
            {lines.map((line, i) => (
              <span key={i}>
                {highlightLine(line, i)}
                {i < lines.length - 1 ? '\n' : ''}
              </span>
            ))}
          </pre>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 flex items-center px-4 py-6 sm:px-6"
        style={{
          background: 'linear-gradient(to top, #111111 0%, #111111 50%, transparent 100%)',
          paddingTop: '2.5rem',
        }}
      >
        <AgentModeToggle variant="dark" />
      </div>
    </div>
  );
}
