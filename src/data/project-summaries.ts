export const projectSummaries: Record<string, string> = {
  'RGB Signatures': `RGB is an onchain framework based on the RGB color model. It uses the constraint of three channels — R, G, and B. Each channel ranges from 0 to 255, allowing for 16,777,216 possible combinations.

Color is just one expression of RGB. What if RGB values could be represented by emojis instead? rgb(255,153,0) could represent 🎩🤗😊 just as easily as Orange. This is the fundamental constraint RGB is centered around: the combination of 3 inputs to create 16,777,216 unique outputs.

Signatures are the visual representations of RGB values contained in the metadata. The RGB Signature is the entry into the RGB ecosystem — non-arbitrary, equally unique, and equally rare. There will only ever be 16,777,216 of them.

Signatures are generated from the binary representation of each RGB value. Each channel encodes to 8 bits, producing 3 sets of 8 binary strings — 24 values in total. Visually, 0 is a black square and 1 is a white square. These are arranged sequentially around a perfect square, with an empty space in the center. Markers are placed at the R, G, and B starting points, with one in the center.

Combined, this results in an RGB Signature — a unique pixel pattern that encodes a specific color. There are 16,777,216 in total. No two are alike and each one can only be minted once.`,

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

  Snack: `Snack is a list curation tool built on the premise that links deserve better than bookmarks. Most people save dozens of URLs a month — articles, tools, restaurants, products — and almost all end up forgotten in a browser folder or a notes app. Snack was designed to fix that by making lists worth keeping and worth sharing.

The core product is simple: create a named list, add items, share the URL. The design effort was in making each step feel significantly lighter than existing alternatives. Creating a list takes one click and a name. Adding an item is a URL paste that auto-populates title, description, and thumbnail. Sharing produces a clean public page you'd actually want to send someone.

The dashboard surfaces the right list at the right moment without requiring manual organization — recency-first, with visual weight given to recently-updated lists.

Items display with just a thumbnail and title by default — enough to scan and remember why something was saved. Expanding reveals the full description, tags, and any personal note. This two-level structure keeps the list compact and scannable even with fifty items.

The share page is a distinct context from the dashboard. When someone lands on a shared list, they're not in an app — they're reading a recommendation. The layout shifts to an editorial feel: tighter typographic hierarchy, more whitespace, content over chrome. The goal was a page that felt like the list itself was the thing.`,

  ShinCN: `ShinCN is my personal design system — a component library and visual language maintained for use across my own projects. The name combines my last name with shadcn/ui, the component library it builds on top of.

Most designers carry informal preferences from project to project — colors they gravitate toward, typographic scales that feel right, spacing rhythms that have proven themselves. ShinCN makes those preferences explicit and reusable. Instead of making the same foundational decisions slightly differently on every side project, I have a documented, version-controlled starting point.

The system layers a distinct visual language on top of Tailwind CSS and shadcn/ui: a custom font stack anchored by Open Runde, a typographic scale optimized for both tight product UIs and open marketing contexts, and a color system using OKLCH for perceptually uniform mixing and dark mode generation.

Buttons use a layered shadow system that creates subtle depth — an inner highlight, a mid-shadow, an outer shadow, and context-dependent insets for hover and pressed states. It's a detail most users never consciously notice, but it contributes to a perception of quality that flat buttons don't achieve.

The dark mode implementation uses semantic tokens rather than simple color inversions. In some cases a lighter dark surface outperforms a direct inversion for perceived contrast. I iterated on this by building representative screens in both modes until the system felt equally intentional in each.

ShinCN is the foundation for this portfolio, Otto, ClawPanel, and various experiments. Having a working system changes how I build: less time on foundational decisions, more on product-specific problems.`,

  'Rat Labs': `Rat Labs is the onchain product studio I co-founded to build software at the intersection of blockchain infrastructure and everyday utility. The name was chosen for its deliberate contrast with the earnestness of most crypto branding — a scrappy, prolific operation more interested in shipping than manifesto-writing.

The studio was born from frustration with how most onchain products got built: either by protocol teams with no attention to UX, or by startups chasing the same few successful archetypes. Rat Labs was designed to occupy a different space — smaller surface area, sharper utility, higher design quality.

My role was design lead across all products: product definition, interface design, front-end development, and brand direction. Building and designing simultaneously created a feedback loop that compressed iteration significantly — I could test ideas in the browser directly rather than waiting for a handoff.

The studio's first significant product was rgb.fun, an NFT collection encoding all 16,777,216 possible RGB color values as onchain tokens. Other work included onchain media experiments, protocol UI contributions, and utility tools built in days rather than weeks.

The design philosophy was shaped by high user skepticism. Blockchain products have burned users, and the default assumption many bring to a new product is that something is broken or not to be trusted. This shaped everything: progressive disclosure of complexity, conservative use of technical terminology, and a visual language that avoided crypto aesthetic clichés.

Designing for wallets was one of the most valuable lessons — connecting a wallet is a moment of genuine financial decision-making, and every detail of that flow matters.`,

  'Hyperbrand: Opepen': `Opepen is a cultural canvas — the result of a hyperculture around VV, pfps, and digital natives.

I wanted to experiment with combining an internet-native constraint and established, well-known brands, so I created a piece every day for 100 days using Opepen as a canvas.

Credit to Jack Butcher for creating Opepen as a canvas and for the many bits of inspiration.`,

  'rgb.fun': `rgb.fun is an NFT collection representing every possible RGB color: 16,777,216 tokens, each a unique combination of red, green, and blue values. Each token is its color. No artwork, no generative traits, no rarity tiers — just pure color, onchain.

The premise emerged from a question about the most minimal meaningful NFT. Most collections derive value from imagery, community, or narrative. rgb.fun strips all of that away and asks: is color alone interesting enough to collect? For designers, developers, and people who think about color obsessively, the answer was yes.

The product challenges were significant. Most NFT interfaces are designed for collections of 5,000 to 10,000 tokens. Sixteen million required rethinking almost every assumption that standard marketplace patterns are built on.

The central interface decision was to prioritize search over browse. Even at 100 items per page, pagination would take 167,772 pages to see everything. Instead, the primary interaction is a color search: enter hex, RGB, or HSL values, move sliders across the color space, and see the corresponding token directly.

For browsing, I built a spectrum grid view mapping a sampled slice of the color space — thousands of tokens at once as colored squares arranged by hue, saturation, and lightness. The visual density makes clear that the collection is comprehensive, not curated.

Individual token pages are deliberately minimal: a full-screen color swatch, hex and RGB values, ownership information. Nothing else, because there's nothing else to say.

Brand design presented a useful constraint: build an identity for a product whose content is all color. I settled on a maximally neutral container — white background, black type, minimal chrome — so whatever color is in focus dominates the page.`,
};
