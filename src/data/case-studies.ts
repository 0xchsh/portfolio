type MockupType = 'frame' | 'mobile';

type Mockup = {
  src: string;
  type: MockupType;
};

export type CaseStudySection = {
  text: string;
  mockups?: Mockup[];
};

export const caseStudySections: Record<string, CaseStudySection[]> = {
  Freighter: [
    {
      text: `Freighter is Stellar's flagship non-custodial wallet. It launched in 2020 as a browser extension and expanded to mobile as smart contracts arrived on Stellar and mobile crypto usage grew.

A small team: three engineers, one PM, and me as the sole designer. Five months to ship before Meridian, our annual conference where attendees would use it live.`,
    },
    {
      text: `Smart contracts launched on Stellar in 2024, unlocking DeFi, NFTs, and more. We needed a mobile wallet simple enough for newcomers but powerful enough for what the network could do now.

Designed for first-time crypto users, DeFi-curious people, remittance senders, and English-speaking users outside the US. Followed Stellar Design System v3 with a bias toward shipping fast and refining after launch.`,
    },
    {
      text: `The home screen organizes holdings into Tokens, Positions, and Collectibles. Balance sits at the top. Below, tabs let users navigate without overwhelming the default view.

Wallets are managed from a dedicated sheet. Switch between accounts, create new ones, or import existing keys. Primary actions are minimal: Send, Swap, Copy. Everything else lives a tap away.`,
      mockups: [
        { src: '/videos/freighter/Tokens.png', type: 'mobile' },
        { src: '/videos/freighter/Positions.png', type: 'mobile' },
        { src: '/videos/freighter/Collectibles.png', type: 'mobile' },
        { src: '/videos/freighter/wallets.mp4', type: 'mobile' },
      ],
    },
    {
      text: `Transaction history on Stellar can get noisy. Trustline changes, path payments, claimable balances. Most of it means nothing to someone who just wants to know "did my payment go through?"

We wrote human-readable summaries for each operation type. "Swapped XLM to USDC" instead of raw operation data. Tapping a transaction expands full details: status, rate, fee, XDR. Progressive disclosure — clarity first, completeness on request.`,
      mockups: [
        { src: '/videos/freighter/Past Transactions.png', type: 'mobile' },
        { src: '/videos/freighter/history-details.mp4', type: 'mobile' },
      ],
    },
    {
      text: `Discover is the gateway to Stellar ecosystem apps. No other Stellar wallet has a dedicated screen for this. We wanted Freighter to feel less like a vault and more like a portal.

Apps are organized into DeFi, Learn, and Trending categories. Each opens in an in-app browser with WalletConnect. You never leave Freighter. For developers, it's distribution. For users, it's access.`,
      mockups: [
        { src: '/videos/freighter/discover-1.mp4', type: 'mobile' },
        { src: '/videos/freighter/discover-2.mp4', type: 'mobile' },
        { src: '/videos/freighter/in-app-browser.png', type: 'mobile' },
      ],
    },
    {
      text: `Transactions cover everything from sending and swapping to signing dApp requests and adding trustlines. Each flow validates at every step so errors are caught early, not at final submission.

Security is layered throughout. Blockaid runs real-time simulation on every transaction, surfacing risk levels with specific messaging. Flagged addresses and tokens are called out before interaction. The review screen shows simulated results before signing.`,
      mockups: [{ src: '/videos/freighter/review-transactions.mp4', type: 'mobile' }],
    },
    {
      text: `Freighter Mobile launched at Meridian in September 2025. It's grown to 3K monthly active users through organic growth.

Building in phases felt safe, but a lot of that work only served the team. Ship to real hands sooner. Prioritize what benefits users, not the process.

Crypto is already unfamiliar. Don't add friction to anxiety. Lean into patterns people trust. Familiar interactions make unfamiliar actions feel safe.`,
    },
  ],

  Snack: [
    {
      text: `Snack is the simplest way to save and share links. It started when I tried to build a directory of the best crypto websites. Every directory was custom-built, and there was no simple tool to create and manage one.

The core interaction is paste-to-save: drop a URL, and Snack scrapes the metadata instantly. No formatting, no organizing, just a running list you can share with one link.`,
    },
    {
      text: `I spent $30,000 out of pocket on an agency MVP, then Claude Code came out and I rebuilt everything and more from scratch within a month. The leverage is real and it compounds.

Clean and unopinionated design. A minimum expandable product. Create a list in less than 30 seconds. Built for terminally online people, tab hoarders, and creators and curators.`,
      mockups: [{ src: '/videos/snack/website.mp4', type: 'frame' }],
    },
    {
      text: `Creating a list takes under thirty seconds. Set an emoji, add a title, paste your links.

The fastest flow is clipboard-first: copy a URL, paste it directly. Snack scrapes the metadata automatically — title, description, favicon — so you don't format anything. One action, one result. No friction between "I found something good" and "it's in my list."`,
      mockups: [{ src: '/videos/snack/create-list.mp4', type: 'frame' }],
    },
    {
      text: `There's no separate edit mode. If you're the creator, the list is always editable. Click the emoji to change it. Click the title to rename. Drag to reorder. Paste from your clipboard to add one link or twenty.

This collapses the gap between viewing and editing to zero. You're always in the right context.`,
      mockups: [{ src: '/videos/snack/edit-list.mp4', type: 'frame' }],
    },
    {
      text: `Managing lists is where the product comes together. Your dashboard shows all your lists with stats: total links, total views, and saves by others.

Sharing is a copy-link button. Dynamic OG images are generated automatically based on the emoji, title, and username. Every list looks good when shared without any manual setup.`,
      mockups: [{ src: '/videos/snack/dashboard.png', type: 'frame' }],
    },
    {
      text: `After an agency approach proved too costly, AI tooling made it possible to rebuild from scratch. The leverage is real and it compounds.

Distribution is still the hardest part. Doesn't matter how good the product is if no one sees it. A browser extension and mobile app are both in progress.`,
    },
  ],

  Laboratory: [
    {
      text: `Stellar Laboratory is the preferred developer sandbox for the Stellar network — the core tool for building transactions, testing endpoints, and exploring the ledger.

The original Lab was functional but outdated. Soroban (smart contracts) and new network features required a full rebuild. My job was to bring the visual language in line with the rest of Stellar's products without alienating developers who'd built muscle memory around the existing flow.`,
    },
    {
      text: `Soroban and new network features were shipping fast. The existing Lab couldn't keep up. We rebuilt it from the ground up.

This was the first stress test of Stellar Design System v3 — familiar flows on a new foundation, supporting every network feature. Built for Stellar developers, protocol-curious builders, and hackathon teams.`,
      mockups: [{ src: '/videos/lab/build.png', type: 'frame' }],
    },
    {
      text: `The home screen serves as the navigation hub. Every feature of the Lab is reachable from here: transactions, accounts, endpoints, contracts, and tools.

The layout prioritizes discoverability. New users can scan what's available. Returning users jump straight to their workflow. The information architecture mirrors the developer mental model: what do I have, what do I want to build, where do I look things up.`,
      mockups: [{ src: '/videos/lab/home.png', type: 'frame' }],
    },
    {
      text: `Network selection is the first decision a developer makes. Testnet for experimentation, Mainnet for production, Futurenet for bleeding-edge features.

The network selector persists across the entire Lab. Switching networks updates all saved items, endpoints, and account states. No ambiguity about which environment you're working in.`,
      mockups: [{ src: '/videos/lab/select-network.png', type: 'frame' }],
    },
    {
      text: `Connecting a wallet lets developers sign transactions directly from the Lab using their browser wallet. This bridges the gap between building a transaction and submitting it.

Supported wallets include Freighter and other Stellar-compatible extensions. Once connected, the wallet's public key is available for prefilling source accounts and signing.`,
      mockups: [{ src: '/videos/lab/connect-wallet.png', type: 'frame' }],
    },
    {
      text: `XDR is Stellar's binary encoding format. Every transaction, operation, and result is encoded in it. The View XDR tool converts XDR to human-readable JSON.

Paste an XDR string, see the decoded structure. This is essential for debugging: when a transaction fails or behaves unexpectedly, XDR decoding is the first place developers go.`,
      mockups: [{ src: '/videos/lab/xdr.png', type: 'frame' }],
    },
    {
      text: `Creating an account on Stellar means generating a keypair, then funding it. On Testnet and Futurenet, Friendbot handles funding with 10,000 test XLM.

The new flow keeps everything together. Generate, optionally save with a name, fund with one click. Saved keypairs display the account's XLM balance, last saved date, and quick actions. Account management as a proper dashboard rather than disconnected utilities.`,
      mockups: [{ src: '/videos/lab/account.mp4', type: 'frame' }],
    },
    {
      text: `The transaction builder is the heart of the Lab. Source account, sequence number, base fee, memo, time bounds, then operations. Every field has validation, helper text, and links to docs.

Signing supports multiple methods: secret key, browser wallet, hardware wallet, or pre-computed signature. We show all four at once. It looks dense because it is dense, but it matches how developers actually work with multi-sig.`,
      mockups: [{ src: '/videos/lab/transaction.mp4', type: 'frame' }],
    },
    {
      text: `Contract Explorer lets you learn about any Soroban smart contract. Paste a contract ID and get everything: creation date, creator, Wasm hash, source code, storage state, version history, and generated bindings for TypeScript, Rust, Python, Java.

Invoke methods directly from the browser with type hints from the contract spec. The goal: make smart contracts feel as accessible as the rest of the Lab.`,
      mockups: [{ src: '/videos/lab/contract-explorer.png', type: 'frame' }],
    },
    {
      text: `Since relaunch: 21K monthly active users with sessions averaging nearly 8 minutes. No drop-off from the old Lab. Devs made the switch without friction.

You can't design developer tools without using them. I had to dogfood Lab constantly. If I didn't feel the friction myself, I'd have missed it entirely.

The old Lab had rough edges but devs knew how it worked. We kept the patterns they relied on. Familiar doesn't mean outdated, it means trusted.`,
    },
  ],
};
