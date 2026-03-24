export const projectSummaries: Record<string, string> = {
  'RGB Signatures': `RGB is an onchain framework based on the RGB color model. It uses the constraint of three channels — R, G, and B. Each channel ranges from 0 to 255, allowing for 16,777,216 possible combinations.

Color is just one expression of RGB. What if RGB values could be represented by emojis instead? rgb(255,153,0) could represent 🎩🤗😊 just as easily as Orange. This is the fundamental constraint RGB is centered around: the combination of 3 inputs to create 16,777,216 unique outputs.

Signatures are the visual representations of RGB values contained in the metadata. The RGB Signature is the entry into the RGB ecosystem — non-arbitrary, equally unique, and equally rare. There will only ever be 16,777,216 of them.`,

  ClawPanel: `ClawPanel is the operational dashboard for OpenClaw, a browser automation backend built to run persistent agents, web scrapers, and long-running task queues. Without an interface, OpenClaw was a black box — jobs ran, sessions opened and closed, but there was no way to tell what was active, what had failed, or how the system was performing.

The goal was to make OpenClaw legible. Operators needed to see task status, inspect session logs, monitor queue depth, and pause or kill jobs without touching the API directly.

The dashboard surfaces critical data immediately — active sessions, recent completions, error rates, queue length. The information hierarchy was carefully tuned: healthy states fade into the background while failures surface with high contrast, so a quick scan tells you whether the system is healthy.

Each task entry is expandable, showing the full execution trace: URLs visited, retry counts, timing breakdowns, and any structured data extracted. I designed this drill-down after watching early users struggle to debug failures — they needed to go from "something went wrong" to "here's exactly where and why" in as few clicks as possible.

The interface is density-optimized — this is a tool operators keep open in a side window. It needs to communicate at low attention, not demand it. Tabular number formatting throughout means changing counts never shift layout.

ClawPanel is still in active development alongside OpenClaw. I treat it less as a finished product and more as ongoing design research into what a human-facing interface for AI agents should actually look like.`,

  Otto: `Otto is a conversational AI assistant for car owners who want to understand their vehicles without needing to be mechanics. Most car problems reveal themselves through symptoms — strange sounds, warning lights, unusual behavior — but translating those into actionable understanding typically requires a shop visit or hours of forum research. Otto short-circuits that process.

The product started as a personal frustration. I had a car throwing an error code I didn't understand, and looking it up was poor: forum threads full of conflicting advice, generic OBD lookups with no context, sponsored diagnostic ads. What I wanted was someone to tell me what was probably happening and what I should do about it.

Otto's design centers on a conversational interface that feels closer to texting a knowledgeable friend than querying a database. The tone is confident and plain-spoken — no excessive disclaimers, no boilerplate on every response. Otto assumes the user is an adult capable of making their own decisions.

The core interaction is a chat thread anchored to a specific vehicle. Users add their cars once — year, make, model, engine variant — and every conversation draws on that context without needing to restate it.

When Otto references a specific component or procedure, it surfaces a card with structured information — part numbers, torque specs, tool requirements — that persists as a reference artifact in the thread. The visual design is deliberately restrained: clean and high-contrast, working equally well in a dark garage and bright daylight.`,

  Snack: `Snack is the simplest way to save and share links. It started when I tried to build a directory of the best crypto websites. Every directory was custom-built, and there was no simple tool to create and manage one.

The core interaction is paste-to-save: drop a URL, and Snack scrapes the metadata instantly. No formatting, no organizing, just a running list you can share with one link. It's live at snack.xyz.

I spent $30,000 out of pocket on an agency MVP, then Claude Code came out and I rebuilt everything and more from scratch within a month. The leverage is real and it compounds.

Creating a list takes under thirty seconds. Set an emoji, add a title, paste your links. The fastest flow is clipboard-first: copy a URL, paste it directly. Snack scrapes the metadata automatically — title, description, favicon — so you don't format anything. One action, one result. No friction between "I found something good" and "it's in my list."

There's no separate edit mode. If you're the creator, the list is always editable. Click the emoji to change it. Click the title to rename. Drag to reorder. Paste from your clipboard to add one link or twenty. No gap between viewing and editing.

Your dashboard shows all your lists with stats: total links, total views, and saves by others. Dynamic OG images are generated automatically based on the emoji, title, and username. Every list looks good when shared without any manual setup.

Distribution is still the hardest part. Doesn't matter how good the product is if no one sees it. A browser extension and mobile app are both in progress.`,

  ShinCN: `ShinCN is my personal design system — a component library and visual language maintained for use across my own projects. The name combines my last name with shadcn/ui, the component library it builds on top of.

Most designers carry informal preferences from project to project — colors they gravitate toward, typographic scales that feel right, spacing rhythms that have proven themselves. ShinCN makes those preferences explicit and reusable. Instead of making the same foundational decisions slightly differently on every side project, I have a documented, version-controlled starting point.

The system layers a distinct visual language on top of Tailwind CSS and shadcn/ui: a custom font stack anchored by Open Runde, a typographic scale optimized for both tight product UIs and open marketing contexts, and a color system using OKLCH for perceptually uniform mixing and dark mode generation.

Buttons use a layered shadow system that creates subtle depth — an inner highlight, a mid-shadow, an outer shadow, and context-dependent insets for hover and pressed states. It's a detail most users never consciously notice, but it contributes to a perception of quality that flat buttons don't achieve.

The dark mode implementation uses semantic tokens rather than simple color inversions. In some cases a lighter dark surface outperforms a direct inversion for perceived contrast. I iterated on this by building representative screens in both modes until the system felt equally intentional in each.

ShinCN is the foundation for this portfolio, Otto, ClawPanel, and various experiments. Having a working system changes how I build: less time on foundational decisions, more on product-specific problems.`,

  'Rat Labs': `Rat Labs is the onchain product studio I co-founded to build software at the intersection of blockchain infrastructure and everyday utility. The name was chosen for its deliberate contrast with the earnestness of most crypto branding — a scrappy, prolific operation more interested in shipping than manifesto-writing.

My role was design lead across all products: product definition, interface design, front-end development, and brand direction. Building and designing simultaneously created a feedback loop that compressed iteration significantly.

- RGB · Onchain color protocol
- Noundation · Design studio for DAOs
- Gerund · Crypto-native apparel
- Squads · Community coordination
- Lag Sucks · Gaming media & content
- Nounhood · Generative art collection
- Nounable · Nourish goods & merch`,

  'Hyperbrand: Opepen': `Opepen is a cultural canvas — the result of a hyperculture around VV, pfps, and digital natives.

I wanted to experiment with combining an internet-native constraint and established, well-known brands, so I created a piece every day for 100 days using Opepen as a canvas.

Credit to Jack Butcher for creating Opepen as a canvas and for the many bits of inspiration.`,

  RGB: `RGB is an onchain media app — a feed for digital collectibles where what you own is the content. Most onchain platforms are built around creation and trading. RGB takes a different angle: your collection is your profile, and curation is the product.

Following someone on RGB means following what they collect, not just what they create. The feed surfaces owned work — organized by collector, by collection, by creator. Taste becomes visible. Provenance and aesthetics are primary. Price is secondary.

The design challenge was making a feed of heterogeneous content feel cohesive. NFTs come in every shape, ratio, and medium — generative art, photography, 1/1 pieces, large editions. The layout adapts to the content without flattening it.

Discovery is organized around collections rather than individual tokens. Browsing a collection on RGB is closer to browsing a gallery than a marketplace. The experience is cultural, not transactional.

RGB extends the onchain infrastructure behind rgb.fun into a full media layer for the collector community. The goal: make onchain collecting feel as natural as scrolling a feed.

RGB Signatures are the identity system. Each signature is a unique binary visual encoding of an RGB value — your color, your mark. On RGB the app, your signature is your avatar. 16,777,216 possible identities, each one yours the moment you mint it.`,

  'rgb.fun': `rgb.fun is an NFT collection representing every possible RGB color: 16,777,216 tokens, each a unique combination of red, green, and blue values. Each token is its color. No artwork, no generative traits, no rarity tiers — just pure color, onchain.

The premise emerged from a question about the most minimal meaningful NFT. Most collections derive value from imagery, community, or narrative. rgb.fun strips all of that away and asks: is color alone interesting enough to collect? For designers, developers, and people who think about color obsessively, the answer was yes.

The product challenges were significant. Most NFT interfaces are designed for collections of 5,000 to 10,000 tokens. Sixteen million required rethinking almost every assumption that standard marketplace patterns are built on.

The central interface decision was to prioritize search over browse. Even at 100 items per page, pagination would take 167,772 pages to see everything. Instead, the primary interaction is a color search: enter hex, RGB, or HSL values, move sliders across the color space, and see the corresponding token directly.

For browsing, I built a spectrum grid view mapping a sampled slice of the color space — thousands of tokens at once as colored squares arranged by hue, saturation, and lightness. The visual density makes clear that the collection is comprehensive, not curated.

Individual token pages are deliberately minimal: a full-screen color swatch, hex and RGB values, ownership information. Nothing else, because there's nothing else to say.

Brand design presented a useful constraint: build an identity for a product whose content is all color. I settled on a maximally neutral container — white background, black type, minimal chrome — so whatever color is in focus dominates the page.`,

  Freighter: `Freighter is Stellar's flagship non-custodial wallet. It launched in 2020 as a browser extension and expanded to mobile as smart contracts arrived on Stellar and mobile crypto usage grew.

A small team: three engineers, one PM, and me as the sole designer. Five months to ship before Meridian, our annual conference where attendees would use it live.

Smart contracts launched on Stellar in 2024, unlocking DeFi, NFTs, and more. We needed a mobile wallet simple enough for newcomers but powerful enough for what the network could do now. Designed for first-time crypto users, DeFi-curious people, remittance senders, and English-speaking users outside the US.

The home screen organizes holdings into Tokens, Positions, and Collectibles. Balance sits at the top. Wallets are managed from a dedicated sheet — switch between accounts, create new ones, or import existing keys. Primary actions are minimal: Send, Swap, Copy.

Transaction history on Stellar can get noisy. We wrote human-readable summaries for each operation type. "Swapped XLM to USDC" instead of raw operation data. Tapping a transaction expands full details: status, rate, fee, XDR. Progressive disclosure — clarity first, completeness on request.

Discover is the gateway to Stellar ecosystem apps. No other Stellar wallet has a dedicated screen for this. Apps are organized into DeFi, Learn, and Trending categories. Each opens in an in-app browser with WalletConnect. For developers, it's distribution. For users, it's access.

Transactions cover everything from sending and swapping to signing dApp requests and adding trustlines. Security is layered throughout — Blockaid runs real-time simulation on every transaction, surfacing risk levels with specific messaging before signing.

Freighter Mobile launched at Meridian in September 2025. It's grown to 3K monthly active users through organic growth. The pattern across all flows: human-readable first, raw data for those who want it.`,

  Laboratory: `Stellar Laboratory is the preferred developer sandbox for the Stellar network — the core tool for building transactions, testing endpoints, and exploring the ledger.

The original Lab was functional but outdated. Soroban (smart contracts) and new network features required a full rebuild. My job was to bring the visual language in line with the rest of Stellar's products without alienating developers who'd built muscle memory around the existing flow.

The home screen serves as the navigation hub. Every feature of the Lab is reachable from here: transactions, accounts, endpoints, contracts, and tools. The information architecture mirrors the developer mental model: what do I have, what do I want to build, where do I look things up.

The transaction builder is the heart of the Lab. Source account, sequence number, base fee, memo, time bounds, then operations. Every field has validation, helper text, and links to docs. Signing supports multiple methods: secret key, browser wallet, hardware wallet, or pre-computed signature.

Contract Explorer lets you learn about any Soroban smart contract. Paste a contract ID and get everything: creation date, creator, Wasm hash, source code, storage state, version history, and generated bindings for TypeScript, Rust, Python, Java. Invoke methods directly from the browser with type hints from the contract spec.

Since relaunch: 21K monthly active users with sessions averaging nearly 8 minutes. No drop-off from the old Lab. You can't design developer tools without using them — I dogfooded Lab constantly. The old Lab had rough edges but devs knew how it worked. We kept the patterns they relied on. Familiar doesn't mean outdated, it means trusted.`,
};
