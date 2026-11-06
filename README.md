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

The homepage contribution graph reads the public GitHub profile calendar, so no
token is needed. Optionally set `GITHUB_USERNAME` (defaults to `0xchsh`). On
GitHub, enable **Profile → Contribution settings → Private contributions** so
private activity is included as anonymous daily counts.

GitHub attributes commits by author email, not username. Make sure the email in
your Exa commits is added to the same GitHub account; after adding it, GitHub may
take up to 24 hours to rebuild the contribution graph.

## License

MIT
