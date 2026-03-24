'use client';

import { useState, useEffect } from 'react';
import { Robot, FileText, DownloadSimple } from '@phosphor-icons/react';
import { useAgentMode } from '@/components/providers/AgentModeProvider';

const MARKDOWN = `# Charles Shin


## About

Currently the Lead Product Designer at Stellar (https://stellar.org). Previously at Warby Parker, Uber, and Weebly.

Designing interfaces and interactions that feel simple, clear, and enjoyable, especially in blockchain and AI, where new patterns are being shaped for the first time.

Writing code through conversation and wiring agents together (Claude Code, OpenClaw, Paperclip).

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

const ALL_LINES = MARKDOWN.split('\n');
const LINE_NUM_WIDTH = String(ALL_LINES.length).length;
const CHARS_PER_FRAME = 30;

// ---------------------------------------------------------------------------
// Section label (mirrors the one in v2/page.tsx)
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600 shrink-0">{children}</span>
      <div className="flex-1 border-t border-dotted border-neutral-200 dark:border-neutral-700" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agent mode section rows
// ---------------------------------------------------------------------------

const rowClass =
  'flex items-center gap-3 px-3 py-1.5 -mx-3 rounded-[6px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer w-[calc(100%+1.5rem)] text-left';

function AgentModeRow() {
  const { toggleAgentMode } = useAgentMode();
  return (
    <button onClick={toggleAgentMode} className={rowClass}>
      <Robot size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[1px]" />
      <span className="text-sm font-medium text-foreground">Agent Mode</span>
    </button>
  );
}

function CharlesMdRow() {
  const handleDownload = async () => {
    const res = await fetch('https://raw.githubusercontent.com/0xchsh/charles-md/main/charles.md');
    const text = await res.text();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'charles.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className={`${rowClass} items-start group`}>
      <FileText size={14} weight="bold" className="shrink-0 text-neutral-500 dark:text-neutral-400 mt-[3px]" />
      <div>
        <p className="text-sm font-medium text-foreground leading-[20px] uppercase">charles.md</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-[20px]">Design instructions for LLMs</p>
      </div>
      <DownloadSimple size={14} weight="bold" className="ml-auto shrink-0 self-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Terminal window (agent mode view)
// ---------------------------------------------------------------------------

function highlightLine(line: string, i: number) {
  if (/^#{1,2}\s/.test(line)) {
    const match = line.match(/^(#{1,2}\s)(.*)/);
    if (match) {
      return (
        <span key={i}>
          <span style={{ color: '#555' }}>{match[1]}</span>
          <span style={{ color: '#e5e5e5', fontWeight: 500 }}>{match[2]}</span>
        </span>
      );
    }
  }

  if (line.startsWith('- ')) {
    const parts: React.ReactNode[] = [];
    let rest = line.slice(2);
    let key = 0;
    const regex = /(\*\*.*?\*\*)|(https?:\/\/[^\s)]+)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(rest)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++} style={{ color: '#999' }}>{rest.slice(lastIndex, match.index)}</span>);
      }
      if (match[1]) {
        parts.push(
          <span key={key++}>
            <span style={{ color: '#555' }}>**</span>
            <span style={{ color: '#e5e5e5' }}>{match[1].slice(2, -2)}</span>
            <span style={{ color: '#555' }}>**</span>
          </span>
        );
      } else if (match[2]) {
        parts.push(<span key={key++} style={{ color: '#666', textDecoration: 'underline' }}>{match[2]}</span>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < rest.length) {
      parts.push(<span key={key++} style={{ color: '#999' }}>{rest.slice(lastIndex)}</span>);
    }
    return (
      <span key={i}>
        <span style={{ color: '#555' }}>- </span>
        {parts}
      </span>
    );
  }

  if (/^\s+https?:\/\//.test(line)) {
    const leading = line.match(/^(\s+)/)?.[1] || '';
    return (
      <span key={i}>
        {leading}<span style={{ color: '#666', textDecoration: 'underline' }}>{line.trim()}</span>
      </span>
    );
  }

  return <span key={i} style={{ color: '#999' }}>{line}</span>;
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TerminalWindow() {
  const [copied, setCopied] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const total = MARKDOWN.length;

  useEffect(() => {
    if (visibleChars >= total) return;
    const id = requestAnimationFrame(() => {
      setVisibleChars(c => Math.min(c + CHARS_PER_FRAME, total));
    });
    return () => cancelAnimationFrame(id);
  }, [visibleChars, total]);

  const visibleText = MARKDOWN.slice(0, visibleChars);
  const lines = visibleText.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fade-in"
      style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a', background: '#161616' }}
    >
      {/* Header bar */}
      <div style={{ background: '#222', borderBottom: '1px solid #2a2a2a', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.06em', color: '#666', textTransform: 'uppercase' }}>
          CH.SH
        </span>
        <button
          onClick={handleCopy}
          style={{ color: copied ? '#6ee7b7' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>

      {/* Code body */}
      <div style={{ padding: '12px 0' }}>
        <pre style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', lineHeight: '20px', whiteSpace: 'pre-wrap', margin: 0 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', paddingLeft: 12, paddingRight: 16 }}>
              <span style={{ color: '#3a3a3a', userSelect: 'none', minWidth: `${LINE_NUM_WIDTH + 1}ch`, textAlign: 'right', marginRight: 16, flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ flex: 1 }}>
                {highlightLine(line, i)}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export — swaps content on agent mode toggle
// ---------------------------------------------------------------------------

export function V2LeftContent({ children }: { children: React.ReactNode }) {
  const { agentMode } = useAgentMode();

  if (agentMode) {
    return (
      <div>
        <section>
          <SectionLabel>Skills</SectionLabel>
          <div className="mt-4 flex flex-col gap-2">
            <CharlesMdRow />
          </div>
        </section>
        <section className="mt-8">
          <SectionLabel>For Agents</SectionLabel>
        </section>
        <div className="mt-8">
          <TerminalWindow />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
