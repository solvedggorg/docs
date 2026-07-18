# Documentation project instructions

## About this project

- Documentation site for **solved.gg** products, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Primary navigation is **`navigation.languages`** wrapping **`products` → `versions` → groups**
- English is the default language (`en`); Spanish (`es`) lives under `es/` with the same product/version path shape
- Site root (**Home**) is welcome + legal — **not** product docs (legal pages stay English-only until counsel-reviewed)
- Product docs live under path prefixes: `/rusty`, `/scripty`, `/worgo`, `/pyppi`, `/yappy`, `/deploy`, `/git`, `/depotsdk-go` (locale copies under `/es/...`)
- Translate with DeepL via `scripts/translate-mdx.mjs` (protects brands/code with keep placeholders); re-wrap nav with `scripts/wrap-languages.mjs` after adding locales

## Site structure

| Product switcher entry | Path prefix | Contents |
| --- | --- | --- |
| **Home** | `/`, `/legal/*` | Welcome page + Privacy, Terms, EULA, CLA |
| **rusty** | `/rusty` | Rust PM + toolchains (Linux-only) |
| **scripty** | `/scripty` | JS runtime + PM; pre-v0.0.1 program under `/scripty/v0.0.1-dev` |
| **worgo** | `/worgo` | Go workspace PM (intro) |
| **pyppi** | `/pyppi` | Python package manager (intro) |
| **yappy** | `/yappy` | Native Linux desktop shell — Qt + GTK, scripty logic (intro) |
| **deploy** | `/deploy` | Next.js → Cloudflare Workers CLI (intro) |
| **git** | `/git` | solved.gg git host UI (intro) |
| **depotsdk-go** | `/depotsdk-go` | Go SDK for Depot API (intro) |

## Terminology

- Product names in UI and headings: lowercase **rusty**, **scripty**, **worgo**, **pyppi**, **yappy**, **deploy**, **git**, **depotsdk-go**
- **worgo** is the product/package name (repo: solvedggorg/worgo; site: worgo.pm.solved.gg)
- Marketing sites for the PM suite: `pm.solved.gg` (hub) and `<product>.pm.solved.gg` (rusty, scripty, worgo, yappy, pyppi, deploy)
- **yappy** is permanently Linux-only and always native UI (Qt + GTK; no webview) — state that when platform or UI is discussed
- **scripty** is the JS runtime/PM yappy embeds; do not describe yappy as Electron-with-Zig
- **deploy** is init-time Next.js → Cloudflare Workers with an **owned** runtime — not OpenNext; do not claim full Next/Vercel parity before the compat matrix does
- **git** is the solved.gg org-scoped git host UI (Clerk + Depot CI); not a public mass multi-tenant forge
- **pyppi** is Python tooling; do not claim full pip/uv parity while early access
- Prefer **toolchain** over "rustup install" when describing `rusty env`
- Prefer **rusty-format** / **cargo-format** for project layouts
- Prefer **native** vs **interop** for cargo process vs Zig implementation
- Never claim full Cargo parity; rusty is dual-mode early access
- rusty is **permanently Linux-only** — state that whenever install or platform is discussed
- Legal pages are under `legal/`; do not bury legal-only content inside product trees

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Prefer honest early-access language over marketing hyperbole; performance claims should cite the origin story (3,676-crate client monorepo) when using the ~400× figure
- Legal pages: clear effective/last-updated dates, entity name **iResolved, LLC**, contact **intake@solved.gg**

## Content boundaries

- Document user-facing CLI and workflows; do not document internal agent-only policy files as product docs
- Do not invent install URLs or version numbers that are not real — point to rusty.pm.solved.gg / intake@solved.gg when channels are unsettled
- scripty, worgo, pyppi, yappy, deploy, git, depotsdk-go: keep intros accurate to public positioning; expand only when CLI/SDK surfaces exist
- **scripty pre-v0.0.1 program** lives under `/scripty/v0.0.1-dev` (ES2026 engine gate + Bun-exclusive + Deno-exclusive initiatives). Do not claim ES/Bun/Deno parity unless the matrices in that tree say `supported` or `dogfooded`. Prefer linking the program over inventing install/CLI docs early.
- For depotsdk-go, do not invent a module path that is not in `go.mod` / release notes — link the org repo and note path when unsettled
- For deploy, do not invent published npm package versions; build-from-source is the honest path until install channels freeze
- Legal text is operational starting copy — flag for counsel review before treating as final corporate policy
