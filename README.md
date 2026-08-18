# ch.sh

Personal portfolio built with Next.js.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Geist Font

## Development

```bash
npm install
npm run dev
```

Create `.env.local` with a GitHub token so the homepage can load the contribution calendar:

```bash
GITHUB_TOKEN=github_pat_...
GITHUB_USERNAME=0xchsh
```

The token must belong to the profile being displayed and be allowed to read the
user profile (`read:user` for a classic token). It does not need access to Exa's
repositories. On GitHub, enable **Profile → Contribution settings → Private
contributions** so private activity is included as anonymous daily counts.

GitHub attributes commits by author email, not username. Make sure the email in
your Exa commits is added to the same GitHub account; after adding it, GitHub may
take up to 24 hours to rebuild the contribution graph.

## License

MIT
