type MockupType = 'frame' | 'mobile';

type Mockup = {
  src: string;
  type: MockupType;
  blurDataURL?: string;
};

export type CaseStudySection = {
  title?: string;
  text: string;
  mockups?: Mockup[];
  footnote?: string;
};

export const caseStudySections: Record<string, CaseStudySection[]> = {
  Freighter: [
    {
      title: 'Overview',
      text: `Freighter is Stellar's flagship non-custodial wallet. It launched in 2020 as a browser extension and expanded to mobile as smart contracts arrived on Stellar and mobile crypto usage grew.\n\nA small team: three engineers, one PM, and me as the sole designer. Five months to ship before Meridian, our annual conference where attendees would use it live.`,
    },
    {
      title: 'Approach',
      text: `## Context\nSmart contracts launched on Stellar in 2024, unlocking DeFi, NFTs, and more. We needed a mobile wallet simple enough for newcomers but powerful enough for what the network could do now.\n\n## Principles\n- Followed Stellar Design System v3\n- Bias toward shipping fast and refining after launch\n\n## Audience\nFirst-time crypto users, DeFi-curious people who weren't yet native to the space, remittance senders, and English-speaking users outside the US.`,
    },
    {
      title: 'Home',
      text: `The home screen organizes holdings into Tokens, Positions, and Collectibles. Balance sits at the top. Below, tabs let users navigate without overwhelming the default view.\n\nWallets are managed from a dedicated sheet. Switch between accounts, create new ones, or import existing keys. Primary actions are minimal: Send, Swap, Copy. Everything else lives a tap away.`,
      mockups: [
        { src: '/videos/freighter/Tokens.webp', type: 'mobile', blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAQCAYAAADagWXwAAAACXBIWXMAABYlAAAWJQFJUiTwAAABa0lEQVR4nD2Rv0sCYRjH38k4usRM8x1eTHAQusFFQuL0LrrTy06w4hRaQpfC1MHIAhcDVwOh/8B/wKGtJaK1oaaCoLWtqSm8bzwv2fDwfd/3+/z48LxMCPHJOQfn3J+rEIL0i5lWDolEgi7/kU6noWkaWHwt7gcCAUSjUSSTSdBZVVUIIXymLCjo9/sYj8eYTCaYTqfodDpQFhWwUCiEbreL0egag8GVTGg2T6GqQbBC0YGu51Au70HXDeRzJhynhIP9KljRtlCwbZjmFrLZLCzLgq7rMtjRcQulXRfBpSWsRCIShuiJmN3cvqBx0oZtbRMhwsth5A0D3mENDP6PpK3XGzKbADOZDDzPA7t/eMNZ7xKGkZcLIJPmebUq2PP7N1rtLkzTlLOoLXXYqbhgd49POO9dyAcyaVOpVAobm1kwTVufOY4jW5Ix19hqbMZon0RJ6rquVAqqZpzzVzI9z/OHwyEqlYr/90sfvz2XwUERdj3pAAAAAElFTkSuQmCC' },
        { src: '/videos/freighter/Positions.webp', type: 'mobile', blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAQCAYAAADagWXwAAAACXBIWXMAABYlAAAWJQFJUiTwAAABgklEQVR4nD3RTWsTURTG8UtrhhIm9+YOTWbmzuTOS6ZNTcIwxrRWLIhVCtUUcSN0Ka2IO3WnuCruFL+GX6DfQUHcCy7cunPnQuj8ZSK6eg784DkHjlBK/ZBSIqWs/6VSqsmfIoj7zYB0l4BUCt/36fV6iCQK6tTGuFKhpMuKEKy12w3WIrp6QDq7iekpumHC4aMX7G7P0J6HKOZ7THb2sHGIsRlHxydsz2f4foAYZgnjrRGhMUQm5PJmQRTHy71isVhwa38fz+tSbJTcvveEKAowxiDyfEhVVVhrsUnCzrXr5Hn+F61NGI8n/88vimJZHzS1AztgtFkscc1xcFotRLvDqtttcEi+NSW2KX2T45ucu/2A4zJApNmcavclw/IBaXGH16fP+XV+n4/PriCG6Q1Gk8dEoyPKjUO+vXoPv5/y6d0BIgwHF8aW6DCjyuecn53x+csH3rx9eCG01mitWF/XWDvA6bisrF6i5XQQUsqvzYvSNK2n0yl5ltWe56G1/v4HvjSkJ42KACEAAAAASUVORK5CYII=' },
        { src: '/videos/freighter/Collectibles.webp', type: 'mobile', blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAQCAYAAADagWXwAAAACXBIWXMAABYlAAAWJQFJUiTwAAABeElEQVR4nD2RPWsUYRSFr2xWk2Xe907eyY47yWRmhx1ks04+BEnEjcI2wYCmsFHBD7C3sFhECMFGbMSU+QGBNNqIELBL7x8QQbS0E2vJPDLjanE43PPAvXCuqOoPVcUYUxpjap/MP6WzEOJ5Xq0KVh6GIWG7jcRxXPb7F+rAa7VQ62Gdz6wLSkmSlF4vI4o6qO/TalnmzkwTO4sspksM1h/S7W8S50O2t27z8emI94+WkDy7TrE2JhvcJe/d4PjJC/g64mS8Wt3sk2Qj2ourbOQjvr85gN/vOD58gETzEWmW0YkXiM5HXLm8wvq1q+TLKbKz/ZpnO295ufacYThARGhIg7PNaWR884gPt074lO1xzxWIbRLM+lhV5NXGLl829/kVbfFY5hDfw1lbFyLD+YvciS9xfyqk8GZoGoP+gzLTRM41EGuYUv0PaqhWT53q31WTfic6Fd/3qb4QBAFJkuCco8oqiTHmcwW73W5ZFAVpmpYVMMZ8+wMQdaRMFFJPHwAAAABJRU5ErkJggg==' },
        { src: '/videos/freighter/wallets.mp4', type: 'mobile' },
      ],
    },
    {
      title: 'History',
      text: `Transaction history on Stellar can get noisy. Trustline changes, path payments, claimable balances. Most of it means nothing to someone who just wants to know "did my payment go through?"\n\nWe wrote human-readable summaries for each operation type. "Swapped XLM to USDC" instead of raw operation data. Tapping a transaction expands full details: status, rate, fee, XDR. Progressive disclosure. Clarity first, completeness on request.`,
      mockups: [
        { src: '/videos/freighter/Past Transactions.webp', type: 'mobile' },
        { src: '/videos/freighter/history-details.mp4', type: 'mobile' },
      ],
    },
    {
      title: 'Discover',
      text: `Discover is the gateway to Stellar ecosystem apps. No other Stellar wallet has a dedicated screen for this. We wanted Freighter to feel less like a vault and more like a portal.\n\nApps are organized into DeFi, Learn, and Trending categories. Each opens in an in-app browser with WalletConnect handling the connection. You never leave Freighter.\n\nFor developers, Discover is distribution. For users, it's access.`,
      footnote: `No other Stellar wallet has this. We're betting on the ecosystem growing into it.`,
      mockups: [
        { src: '/videos/freighter/discover-1.mp4', type: 'mobile' },
        { src: '/videos/freighter/discover-2.mp4', type: 'mobile' },
        { src: '/videos/freighter/in-app-browser.webp', type: 'mobile' },
      ],
    },
    {
      title: 'Transactions',
      text: `Transactions cover everything from sending and swapping to signing dApp requests and adding trustlines. Each flow validates at every step so errors are caught early, not at final submission.\n\nSecurity is layered throughout. Blockaid runs real-time simulation on every transaction, surfacing risk levels from suspicious to malicious with specific messaging. Flagged addresses and tokens are called out before interaction. The review screen shows simulated results before signing, with full details available on expansion.\n\nThe pattern across all transaction flows: human-readable first, raw data for those who want it.`,
      footnote: `Blockaid simulates what will happen before you sign, surfacing risks before they cost anything.`,
      mockups: [{ src: '/videos/freighter/review-transactions.mp4', type: 'mobile' }],
    },
    {
      title: 'Takeaways',
      text: `Freighter Mobile launched at Meridian in September 2025. It's grown to 3K monthly active users through organic growth.\n\nBuilding in phases felt safe, but a lot of that work only served the team. Ship to real hands sooner. Prioritize what benefits users, not the process.\n\nCrypto is already unfamiliar. Don't add friction to anxiety. Lean into patterns people trust. Familiar interactions make unfamiliar actions feel safe.`,
      footnote: `Error states are first impressions`,
    },
  ],

  Snack: [
    {
      title: 'Overview',
      text: `Snack is the simplest way to save and share links. It started when I tried to build a directory of the best crypto websites. Every directory was custom-built, and there was no simple tool to create and manage one.\n\nThe core interaction is paste-to-save: drop a URL, and Snack scrapes the metadata instantly. No formatting, no organizing, just a running list you can share with one link. It's live at [snack.xyz](https://snack.xyz).`,
    },
    {
      title: 'Approach',
      text: `## Context\nLast year I spent $30,000 out of pocket on an agency MVP, and it became too costly to continue. Then Claude Code came out and I rebuilt everything and more from scratch within a month.\n\n## Principles\n- Clean and unopinionated design\n- A minimum expandable product\n- Create a list in less than 30 seconds\n\n## Audience\nTerminally online people, tab hoarders, and creators and curators.`,
      mockups: [{ src: '/videos/snack/website.mp4', type: 'frame' }],
    },
    {
      title: 'Create',
      text: `Creating a list takes under thirty seconds. Set an emoji, add a title, paste your links.\n\nThe fastest flow is clipboard-first: copy a URL, paste it directly. Snack scrapes the metadata automatically (title, description, favicon) so you don't format anything. The goal was muscle memory over form-filling.\n\nOne action, one result. No friction between "I found something good" and "it's in my list."`,
      footnote: `Clipboard-first means zero learning curve.`,
      mockups: [{ src: '/videos/snack/create-list.mp4', type: 'frame' }],
    },
    {
      title: 'Edit',
      text: `There's no separate edit mode. If you're the creator, the list is always editable. Click the emoji to change it. Click the title to rename. Drag to reorder. Paste from your clipboard to add one link or twenty.\n\nThis collapses the gap between viewing and editing to zero. You're always in the right context.`,
      mockups: [{ src: '/videos/snack/edit-list.mp4', type: 'frame' }],
    },
    {
      title: 'Manage',
      text: `Managing lists is where the product comes together. Your dashboard shows all your lists with stats: total links, total views, and saves by others.\n\nSharing is a copy-link button. Dynamic OG images are generated automatically based on the emoji, title, and username. Every list looks good when shared without any manual setup.`,
      mockups: [{ src: '/videos/snack/dashboard.webp', type: 'frame' }],
    },
    {
      title: 'Takeaways',
      text: `After an agency approach proved too costly, AI tooling made it possible to rebuild from scratch. The leverage is real and it compounds.\n\nDistribution is still the hardest part. Doesn't matter how good the product is if no one sees it. Getting it into hands is the real work.\n\nA browser extension and mobile app are both in progress.`,
      footnote: `The individual is now one to the nth power.`,
    },
  ],

  Laboratory: [
    {
      title: 'Overview',
      text: `Stellar Laboratory is the preferred developer sandbox for the Stellar network. The core tool for building transactions, testing endpoints, and exploring the ledger.\n\nThe original Lab was functional but outdated. Soroban (smart contracts) and new network features required a full rebuild. My job was to bring the visual language in line with the rest of Stellar's products without alienating developers who'd built muscle memory around the existing flow.`,
    },
    {
      title: 'Approach',
      text: `## Context\nSoroban and new network features were shipping fast. The existing Lab couldn't keep up. We rebuilt it from the ground up.\n\n## Principles\n- First stress test of SDS v3\n- Familiar flows on a new foundation\n- Supporting every network feature\n\n## Audience\nStellar developers, protocol-curious builders, and hackathon teams.`,
      mockups: [{ src: '/videos/lab/build.webp', type: 'frame' }],
    },
    {
      title: 'Home',
      text: `The home screen serves as the navigation hub. Every feature of the Lab is reachable from here: transactions, accounts, endpoints, contracts, and tools.\n\nThe layout prioritizes discoverability. New users can scan what's available. Returning users jump straight to their workflow. The information architecture mirrors the developer mental model: what do I have, what do I want to build, where do I look things up.`,
      mockups: [{ src: '/videos/lab/home.webp', type: 'frame' }],
    },
    {
      title: 'Select Network',
      text: `Network selection is the first decision a developer makes. Testnet for experimentation, Mainnet for production, Futurenet for bleeding-edge features.\n\nThe network selector persists across the entire Lab. Switching networks updates all saved items, endpoints, and account states. No ambiguity about which environment you're working in.`,
      mockups: [{ src: '/videos/lab/select-network.webp', type: 'frame' }],
    },
    {
      title: 'Connect Wallet',
      text: `Connecting a wallet lets developers sign transactions directly from the Lab using their browser wallet. This bridges the gap between building a transaction and submitting it.\n\nSupported wallets include Freighter and other Stellar-compatible extensions. Once connected, the wallet's public key is available for prefilling source accounts and signing.`,
      mockups: [{ src: '/videos/lab/connect-wallet.webp', type: 'frame' }],
    },
    {
      title: 'View XDR',
      text: `XDR is Stellar's binary encoding format. Every transaction, operation, and result is encoded in it. The View XDR tool converts XDR to human-readable JSON.\n\nPaste an XDR string, see the decoded structure. This is essential for debugging: when a transaction fails or behaves unexpectedly, XDR decoding is the first place developers go.`,
      footnote: `Most developers hit View XDR before anything else when debugging.`,
      mockups: [{ src: '/videos/lab/xdr.webp', type: 'frame' }],
    },
    {
      title: 'Account',
      text: `Creating an account on Stellar means generating a keypair, then funding it. On Testnet and Futurenet, Friendbot handles funding with 10,000 test XLM.\n\nThe new flow keeps everything together. Generate, optionally save with a name, fund with one click. Saved keypairs display the account's XLM balance, last saved date, and quick actions. Account management as a proper dashboard rather than disconnected utilities.`,
      footnote: `Friendbot is Stellar's faucet, a bot that gives you free test tokens.`,
      mockups: [{ src: '/videos/lab/account.mp4', type: 'frame' }],
    },
    {
      title: 'Transactions',
      text: `The transaction builder is the heart of the Lab. Source account, sequence number, base fee, memo, time bounds, then operations. Every field has validation, helper text, and links to docs.\n\nSigning supports multiple methods: secret key, browser wallet, hardware wallet, or pre-computed signature. We show all four at once. It looks dense because it is dense, but it matches how developers actually work with multi-sig.`,
      mockups: [{ src: '/videos/lab/transaction.mp4', type: 'frame' }],
    },
    {
      title: 'Contract Explorer',
      text: `Contract Explorer lets you learn about any Soroban smart contract. Paste a contract ID and get everything: creation date, creator, Wasm hash, source code, storage state, version history, and generated bindings for TypeScript, Rust, Python, Java.\n\nInvoke methods directly from the browser with type hints from the contract spec. The goal: make smart contracts feel as accessible as the rest of the Lab.`,
      mockups: [{ src: '/videos/lab/contract-explorer.webp', type: 'frame' }],
    },
    {
      title: 'Takeaways',
      text: `Since relaunch: 21K monthly active users with sessions averaging nearly 8 minutes. No drop-off from the old Lab. Devs made the switch without friction.\n\nYou can't design developer tools without using them. I had to dogfood Lab constantly. If I didn't feel the friction myself, I'd have missed it entirely.\n\nThe old Lab had rough edges but devs knew how it worked. We kept the patterns they relied on. Familiar doesn't mean outdated, it means trusted.`,
      footnote: `Respect users' muscle memory`,
    },
  ],
};
