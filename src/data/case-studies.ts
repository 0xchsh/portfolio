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
      text: `Freighter is Stellar's main crypto wallet. It started as a browser extension in 2020 and got a mobile app when smart contracts came to Stellar. Our team was small: three engineers, one PM, and me as the only designer. Five months to ship before Meridian, our annual conference where thousands of people would use it for the first time.`,
    },
    {
      text: `In 2024, Stellar launched smart contracts, which meant the network could now support DeFi and NFTs. The wallet had to keep up. We were building for people who'd never touched crypto before, people already deep in DeFi, and people sending money home to family. We used Stellar's own design system and pushed to ship fast rather than wait for perfect.`,
    },
    {
      text: `The home screen splits your holdings into Tokens, Positions, and Collectibles. Your balance is front and center. Tabs handle the rest without burying anything. To manage wallets, you pull up a sheet where you can add, import, or create new accounts. The main buttons stay minimal: Send, Swap, Copy. Anything else is one tap deeper.`,
      mockups: [
        { src: '/videos/freighter/Tokens.webp', type: 'mobile' },
        { src: '/videos/freighter/Positions.webp', type: 'mobile' },
        { src: '/videos/freighter/Collectibles.webp', type: 'mobile' },
        { src: '/videos/freighter/wallets.mp4', type: 'mobile' },
      ],
    },
    {
      text: `Stellar transactions come in a lot of types, most of which mean nothing to a regular user. Trustline changes, path payments, claimable balances — the raw data is a mess. We wrote plain descriptions for every transaction type. Instead of technical operation data, you see "Swapped XLM to USDC." Tap the transaction if you want the full details: status, rate, fee, raw XDR. Start simple, go deeper only if you need to.`,
      mockups: [
        { src: '/videos/freighter/Past Transactions.webp', type: 'mobile' },
        { src: '/videos/freighter/history-details.mp4', type: 'mobile' },
      ],
    },
    {
      text: `Discover is a screen no other Stellar wallet has. It's a list of apps built on Stellar — DeFi tools, learning resources, trending projects — organized and searchable. Tap one and it opens inside Freighter with your wallet already connected. You never have to leave the app. We wanted Freighter to feel like more than a place to hold tokens.`,
      mockups: [
        { src: '/videos/freighter/discover-1.mp4', type: 'mobile' },
        { src: '/videos/freighter/discover-2.mp4', type: 'mobile' },
        { src: '/videos/freighter/in-app-browser.webp', type: 'mobile' },
      ],
    },
    {
      text: `Every transaction type — sending, swapping, signing dApp requests, adding trustlines — has its own flow with validation at each step. Mistakes get caught early, not at the end. We also integrated Blockaid, which runs a simulation of every transaction before you sign it. If an address is flagged or something looks off, you see it on the review screen before anything goes through.`,
      mockups: [{ src: '/videos/freighter/review-transactions.mp4', type: 'mobile' }],
    },
    {
      text: `Freighter Mobile launched at Meridian in September 2025. We're at 3K monthly active users, growing through word of mouth. Looking back: we built a lot of things that only helped the team, not the users. Ship to real people faster. Crypto is already intimidating — if the interface adds to that, you've failed.`,
    },
  ],

  Snack: [
    {
      text: `Snack started because I wanted to build a directory of the best crypto websites and there was nothing simple enough to do it with. Every option was either too complicated or had to be built from scratch. So I built Snack: paste a link, and it saves automatically with the title and image pulled in. No formatting, no categories. Just a list you can share with one URL.`,
    },
    {
      text: `I spent $30,000 out of pocket building an MVP with an agency. Then Claude Code came out and I rebuilt everything myself in a month. Same product, better, faster. Clean design. You can make a list in under 30 seconds. Built for people who live online — the ones with 47 tabs open right now.`,
      mockups: [{ src: '/videos/snack/website.mp4', type: 'frame' }],
    },
    {
      text: `Making a list: pick an emoji, add a title, paste your links. That's it. The fastest version: copy a URL, paste it directly into Snack. It fetches the page title, description, and icon automatically. You don't label anything. Found something good, it's in your list.`,
      mockups: [{ src: '/videos/snack/create-list.mp4', type: 'frame' }],
    },
    {
      text: `There's no edit mode to switch into. If you made the list, it's always editable. Click the emoji to change it, click the title to rename it, drag to reorder, paste to add more links. You're never hunting for a setting you know should exist somewhere.`,
      mockups: [{ src: '/videos/snack/edit-list.mp4', type: 'frame' }],
    },
    {
      text: `Your dashboard shows all your lists at once — how many links each has, how many people have viewed them, how many have saved them. Sharing is one button. When you share a list, a preview image generates automatically using the emoji, title, and your username. No extra work to make it look good when posted.`,
      mockups: [{ src: '/videos/snack/dashboard.webp', type: 'frame' }],
    },
    {
      text: `The $30K agency lesson: building the right thing slowly is still slower than shipping something fast and fixing it. Distribution is the part I'm still figuring out. A browser extension and mobile app are both in progress.`,
    },
  ],

  Laboratory: [
    {
      text: `Stellar Laboratory is the main sandbox for Stellar developers — the place to build and test transactions, call API endpoints, and look things up on the ledger. The old version worked but it was outdated and couldn't support everything the network could do. When Soroban (Stellar's smart contract platform) launched, we needed a full rebuild. My job: update the design without breaking workflows that developers had been using for years.`,
    },
    {
      text: `New features were shipping faster than the old Lab could handle. We rebuilt it from the ground up. It was also the first real test of Stellar Design System v3, which we were rolling out across all products. The users: Stellar developers, people curious about the protocol, hackathon teams learning as they go.`,
      mockups: [{ src: '/videos/lab/build.webp', type: 'frame' }],
    },
    {
      text: `The home screen links to everything: transaction builder, account tools, API endpoints, smart contracts, utilities. New users can scan and figure out what's there. Experienced users click straight to what they need. No buried features.`,
      mockups: [{ src: '/videos/lab/home.webp', type: 'frame' }],
    },
    {
      text: `The first thing you pick is which network you're on. Testnet is for experimenting without real money. Mainnet is production. Futurenet is for testing things that haven't shipped yet. Whichever you pick, it sticks across the whole Lab — all your saved data, endpoints, and account state update to match.`,
      mockups: [{ src: '/videos/lab/select-network.webp', type: 'frame' }],
    },
    {
      text: `Connecting a wallet lets you sign transactions directly from the Lab instead of copying XDR around. Works with Freighter and other Stellar browser extensions. Once connected, your public key fills in automatically wherever it's needed.`,
      mockups: [{ src: '/videos/lab/connect-wallet.webp', type: 'frame' }],
    },
    {
      text: `XDR is how Stellar encodes everything — transactions, operations, results. It's binary data that computers love and humans hate. The View XDR tool converts it to readable JSON. Paste in a string, see what it actually says. First stop when something isn't working.`,
      mockups: [{ src: '/videos/lab/xdr.webp', type: 'frame' }],
    },
    {
      text: `To create a Stellar account, you generate a keypair (a public key and a private key) and then fund it. On test networks, Friendbot gives you 10,000 test XLM for free with one click. The new account flow keeps that all in one place: generate, name it, fund it. Saved keypairs show your balance and last activity. Before, this was scattered across different tools.`,
      mockups: [{ src: '/videos/lab/account.mp4', type: 'frame' }],
    },
    {
      text: `The transaction builder is where the most complex work happens. Source account, sequence number, fee, memo, time bounds, then operations. Every field has inline help and links to docs. For signing, there are four options: secret key, browser wallet, hardware wallet, or pre-computed signature. We show all four at once. It looks like a lot because it is a lot — that's what multi-signature transactions actually require.`,
      mockups: [{ src: '/videos/lab/transaction.mp4', type: 'frame' }],
    },
    {
      text: `Contract Explorer lets you look up any Soroban smart contract by its ID. You get the creation date, creator, source code, storage state, version history, and auto-generated code bindings for TypeScript, Rust, Python, and Java. You can call the contract's methods directly from the browser. The goal was to make smart contracts as easy to inspect as anything else in the Lab.`,
      mockups: [{ src: '/videos/lab/contract-explorer.webp', type: 'frame' }],
    },
    {
      text: `Since relaunch: 21K monthly active users, sessions averaging nearly 8 minutes. The old Lab users made the switch without complaining, which was the main thing we were worried about. Building developer tools means actually using them. I was in Lab every day during the project. If I didn't hit the friction myself, it didn't get fixed.`,
    },
  ],
};
