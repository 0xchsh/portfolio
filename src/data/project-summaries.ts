export const projectSummaries: Record<string, string> = {
  'RGB Signatures': `RGB is an onchain framework built around the RGB color model. Three channels - R, G, and B - each ranging from 0 to 255. 16,777,216 possible combinations.

Color is just one expression of that constraint. rgb(255,153,0) could map to 🎩🤗😊 just as easily as Orange. Three inputs, 16,777,216 unique outputs.

Signatures are the visual representation of RGB values in the metadata. Non-arbitrary, equally unique, equally rare. There will only ever be 16,777,216 of them.`,

  ClawPanel: `Hermes is my browser automation backend for running persistent agents, scrapers, and long-running task queues. Without a dashboard it was a black box. ClawPanel fixes that.

Failures surface with high contrast. A quick glance tells you if things are healthy. Each task is expandable: URLs visited, retry counts, timing, structured data extracted.

Still in active development. I'm using it to figure out what a human-facing interface for AI agents should actually look like.`,

  Otto: `Car problems show up as symptoms. Strange sounds, warning lights, behavior that's hard to describe. Getting an answer usually means a shop visit or hours of forum research. Otto cuts that short.

I got a new car and noticed the reverse camera had no beep. Took it to the dealership and they said software issue. Second shop, same answer. Third specialist finally told me it was a trim-level feature that had been cut from my model. Three visits for one fact that should've taken thirty seconds.

The reason Google doesn't work for this is that it has no idea what car you have. Otto does. Add your car once, year, make, model, trim, and every conversation already has your owner's manual loaded.`,

  Snack: `Snack is the simplest way to save and share links. Started when I tried to build a directory of the best crypto websites and realized there was no tool to just make one.

Paste a URL, Snack scrapes the metadata. No formatting, no organizing - just a running list you can share with one link. Live at [snack.xyz](https://snack.xyz).

I spent $30,000 out of pocket on an agency MVP, then Claude Code came out and I rebuilt everything and more from scratch in a month. The leverage is real and it compounds.

Creating a list takes under thirty seconds. No separate edit mode - if you're the creator, the list is always editable. Drag to reorder. Paste to add.

Distribution is still the hardest part. Browser extension and mobile app in progress.`,

  ShinCN: `My personal design system, a component library and visual language I use across all my projects. The name combines my last name with shadcn/ui, which it builds on.

Same decisions every time, without redoing them from scratch. Open Runde as the base font, colors in OKLCH, button shadows that add depth without announcing themselves.

Everything I build starts here.`,

  'Rat Labs': `Rat Labs is the onchain product studio I co-founded. The name was a deliberate contrast to the earnestness of most crypto branding. Scrappy, prolific, more interested in shipping than manifesto-writing.

Product definition, interface design, front-end, brand.

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

  'rgb.fun': `rgb.fun is an NFT collection representing every possible RGB color. 16,777,216 tokens, each a unique combination of red, green, and blue. Each token is its color. No artwork, no traits, no rarity, just pure color onchain.

For designers and developers who think about color obsessively, the question was obvious: what's the most minimal meaningful NFT?

Most NFT interfaces are built for collections of 5-10k tokens. Sixteen million required rethinking almost every assumption.

Search won over browse. Pagination at 100 per page would take 167,772 pages, so the main interaction is color search. Enter a hex, RGB, or HSL value and get the token directly. For browsing, a spectrum grid maps a sampled slice of the color space. Thousands of tokens at once as colored squares, arranged by hue, saturation, and lightness.

Individual token pages are just the color, full screen, with the hex and RGB values. Nothing else to say.`,

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
