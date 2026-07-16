# solved.gg Docs

Mintlify documentation for **solved.gg** — site home, legal, and product docs.

## Structure

```text
docs.json              # site config + product switcher
index.mdx              # welcome (docs.solved.gg/)
legal/                 # privacy, terms, eula, cla
rusty/                 # product docs → docs.solved.gg/rusty
scripty/               # product docs → docs.solved.gg/scripty
worgo/                 # product docs → docs.solved.gg/worgo
pyppi/                 # product docs → docs.solved.gg/pyppi
yappy/                 # product docs → docs.solved.gg/yappy
deploy/                # product docs → docs.solved.gg/deploy
git/                   # product docs → docs.solved.gg/git
depotsdk-go/           # product docs → docs.solved.gg/depotsdk-go
```

The product switcher lists **Home**, **rusty**, **scripty**, **worgo**, **pyppi**,
**yappy**, **deploy**, **git**, and **depotsdk-go**. Home is the default entry
(welcome + legal). Product documentation is **not** at the site root; each
product lives under its path prefix.

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
