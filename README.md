# solved.gg Docs

Mintlify documentation for **rusty**, **scripty**, and **wargo**.

## Structure

```text
docs.json          # site config + product switcher navigation
index.mdx          # suite landing page
rusty/             # Rust PM + toolchains (full early-access docs)
scripty/           # JS runtime + PM (intro)
wargo/             # Go workspace PM (intro)
```

Products are configured under `navigation.products` in `docs.json` (product switcher dropdown).

## Development

```bash
npm i -g mint
mint dev
```

Preview at `http://localhost:3000`.

## Publishing

Install the Mintlify GitHub app from your [dashboard](https://dashboard.mintlify.com/settings/organization/github-app). Changes on the default branch deploy automatically.

## Writing

See `AGENTS.md` for product terminology and content boundaries.
