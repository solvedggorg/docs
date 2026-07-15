# solved.gg Docs

Mintlify documentation for **solved.gg** — site home, legal, and product docs.

## Structure

```text
docs.json              # site config + product switcher
index.mdx              # welcome (docs.solved.gg/)
legal/                 # privacy, terms, eula, cla
rusty/                 # product docs → docs.solved.gg/rusty
scripty/               # product docs → docs.solved.gg/scripty
wargo/                 # product docs → docs.solved.gg/wargo
```

The product switcher lists **Home**, **rusty**, **scripty**, and **wargo**.
Home is the default entry (welcome + legal). Product documentation is **not**
at the site root; rusty lives under the `/rusty` path.

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
