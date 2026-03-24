export const projectSummaries: Record<string, string> = {
  'RGB Signatures': `RGB is an onchain framework built around the RGB color model. Three channels - R, G, and B - each ranging from 0 to 255. 16,777,216 possible combinations.

Color is just one expression of that constraint. rgb(255,153,0) could map to 🎩🤗😊 just as easily as Orange. Three inputs, 16,777,216 unique outputs.

Signatures are the visual representation of RGB values in the metadata. Non-arbitrary, equally unique, equally rare. There will only ever be 16,777,216 of them.`,

  ClawPanel: `ClawPanel is the dashboard for OpenClaw, my browser automation backend for running persistent agents, scrapers, and long-running task queues. Without it, OpenClaw was a black box.

The goal was legibility. See what's active, what failed, how the system is performing - without touching the API.

Failures surface with high contrast. A quick glance tells you if things are healthy. Each task is expandable: URLs visited, retry counts, timing, any structured data extracted.

Still in active development. I treat it as ongoing research into what a human-facing interface for AI agents should actually look like.`,

  Otto: `AI assistant for car owners. Car problems show up as symptoms - strange sounds, warning lights, unusual behavior - but translating those into something actionable usually means a shop visit or hours of forum research. Otto short-circuits that.

Started from a specific frustration. I got a new car and noticed the reverse camera had no beep. Took it to the dealership - they said it was a software issue. Took it to a second shop - same answer. A third specialist finally told me what was actually going on: it was a trim-level feature that had been cut. Three visits to learn one fact that should have taken thirty seconds.

The tone is confident and plain. No excessive disclaimers, no boilerplate. Otto assumes you're an adult.

Add your car once - year, make, model, trim - and every conversation draws on that context without needing to restate it.`,

  Snack: `Snack is the simplest way to save and share links. Started when I tried to build a directory of the best crypto websites and realized there was no tool to just make one.

Paste a URL, Snack scrapes the metadata. No formatting, no organizing - just a running list you can share with one link. Live at snack.xyz.

I spent $30,000 out of pocket on an agency MVP, then Claude Code came out and I rebuilt everything and more from scratch in a month. The leverage is real and it compounds.

Creating a list takes under thirty seconds. No separate edit mode - if you're the creator, the list is always editable. Drag to reorder. Paste to add.

Distribution is still the hardest part. Browser extension and mobile app in progress.`,

  ShinCN: `ShinCN is my personal design system - a component library and visual language I use across all my projects. The name combines my last name with shadcn/ui, which it builds on top of.

Makes my preferences explicit and reusable. Same foundational decisions, every time, without redoing them from scratch.

Built on Tailwind and shadcn/ui. Custom font stack anchored by Open Runde, color system in OKLCH, layered button shadows that create subtle depth without being obvious about it.

The base for this portfolio, Otto, ClawPanel, and everything else I build.`,

  'Rat Labs': `Rat Labs is the onchain product studio I co-founded. The name was a deliberate contrast to the earnestness of most crypto branding - scrappy, prolific, more interested in shipping than manifesto-writing.

Design lead across everything: product definition, interface design, front-end, brand.

- RGB · Onchain color protocol
- Noundation · Design studio for DAOs
- Gerund · Crypto-native apparel
- Squads · Community coordination
- Lag Sucks · Gaming media & content
- Nounhood · Generative art collection
- Nounable · Nourish goods & merch`,

  'Hyperbrand: Opepen': `Opepen is a cultural canvas - the result of a hyperculture around VV, pfps, and digital natives.

I wanted to experiment with combining an internet-native constraint and established brands, so I made a piece every day for 100 days using Opepen as a canvas.

Credit to [Jack Butcher](https://x.com/jalilwahdat/status/1858508196593185144?s=20) for creating Opepen and for the many bits of inspiration.`,

  'RGB Friends': `RGB Friends is a CC0 generative pixel character collection - a collaboration between Internet Friends and RGB. Each character is built on the RGB color framework, a small figure rendered in a distinct RGB value.

Free and open mint, no allowlists or presale. Intentionally general - a shared canvas where communities could naturally form around it.

CC0, no rights reserved. Anyone can use, remix, or build on it. Open and free forever.`,

  Zorps: `Zorps is a collection of 100 PFPs derived from Zorbs - the glossy 3D orb from Zora. Each one reframes the Zorb as a portrait: a sphere floating above its reflection, cropped to read as a head and shoulders.

100 tokens, one shape, differentiated only by color. Same glassy material across all of them - specular highlight, soft shadow, colored reflection below.`,

  'rgb.fun': `rgb.fun is an NFT collection representing every possible RGB color: 16,777,216 tokens, each a unique combination of red, green, and blue. Each token is its color. No artwork, no traits, no rarity - just pure color, onchain.

The question was: what's the most minimal meaningful NFT? For designers and developers who think about color obsessively, the answer was yes.

Most NFT interfaces are built for collections of 5-10k tokens. Sixteen million required rethinking almost every assumption.

Main interface decision: prioritize search over browse. Pagination at 100 per page would take 167,772 pages. Instead, the primary interaction is color search - enter hex, RGB, or HSL and get the token directly.

For browsing, I built a spectrum grid mapping a sampled slice of the color space. Thousands of tokens at once as colored squares, arranged by hue, saturation, and lightness.

Individual token pages are minimal: full-screen color swatch, hex and RGB values, ownership. Nothing else, because there's nothing else to say.`,

  Freighter: `Freighter is Stellar's flagship non-custodial wallet. Launched in 2020 as a browser extension, expanded to mobile as smart contracts arrived on Stellar.

Three engineers, one PM, me as sole designer. Five months to ship before Meridian, our annual conference where attendees would use it live.

Home screen organizes holdings into Tokens, Positions, and Collectibles. Wallets managed from a dedicated sheet. Primary actions minimal: Send, Swap, Copy.

Transaction history gets noisy on Stellar. We wrote human-readable summaries for every operation type - "Swapped XLM to USDC" instead of raw data. Tap to expand full details. Clarity first, completeness on request.

Discover is the gateway to the Stellar ecosystem. No other Stellar wallet has a dedicated screen for this. DeFi, Learn, and Trending - each app opens in an in-app browser with WalletConnect.

Every transaction runs through Blockaid for real-time simulation and risk scoring before signing.

Launched at Meridian, September 2025. 3K monthly active users through organic growth.`,

  Laboratory: `Stellar Laboratory is the developer sandbox for the Stellar network - for building transactions, testing endpoints, and exploring the ledger.

The original Lab was functional but outdated. Soroban (smart contracts) and new network features required a full rebuild. My job was to modernize without breaking the workflows developers had built around it.

The transaction builder is the heart of the Lab. Source account, sequence number, base fee, memo, time bounds, operations. Every field has validation, helper text, and doc links. Signing supports secret key, browser wallet, hardware wallet, or pre-computed signature.

Contract Explorer: paste a contract ID and get everything - creation date, creator, Wasm hash, source code, storage state, version history, and generated bindings for TypeScript, Rust, Python, Java. Invoke methods directly from the browser.

Since relaunch: 21K monthly active users, sessions averaging nearly 8 minutes.`,
};
