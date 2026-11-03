# Game Server Config Standard

The specification site for **UnifiedGSC**: an open format for describing and configuring dedicated game servers..

- **Config spec** (`spec/`): game definitions, server values, adapters, permissions, secrets and distribution.
- **Live-state spec** (`live-state/`): what a running server is doing, built on the same definitions.
- **Example games** (`examples/definitions/`): fifteen reference definitions. Their pages under `/games` are generated at build time by `scripts/generate-games.mjs`.

Both specs are **draft 0.1** and still changing.

## Development Notice
This specification is still extremely early in development. Much of the spec needs to be proofed and edited as much of it was generated using automated tooling.

## Working on the site

Requires Node.js 20 or newer.

```bash
npm ci
npm start          # live preview at http://localhost:3000/Specification/
npm run build      # production build into build/, with strict link checking
```

Spec pages are plain Markdown (`.md`), not MDX, because the spec is full of `{value}`-style templates. Use `.mdx` only for a page that needs a React component.

## Publishing

The site is published at <https://unifiedgsc.github.io/Specification/>. Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/publish.yml`). Pull requests build without deploying, so broken links fail the check before merge.

## Layout

| Path | Contents |
| --- | --- |
| `spec/` | Config spec, versioned (`sidebars.spec.ts`) |
| `live-state/` | Live-state spec, versioned separately (`sidebars.live-state.ts`) |
| `examples/` | Definitions, values documents, an access policy, an inventory and the state protocol library |
| `scripts/` | Build-time generators |
| `src/` | Landing page and theme |

To cut a spec version once a draft is ready: `npm run docusaurus docs:version:spec 0.1` (or `docs:version:live-state`).
