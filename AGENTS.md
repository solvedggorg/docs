# Documentation project instructions

## About this project

- Documentation site for **solved.gg** products, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Primary navigation is **`navigation.languages`** wrapping **`products` → `versions` → groups**
- English is the default language (`en`); Spanish is deferred under **`.nrn/es/`** (not published)
- Site root (**Home**) is welcome + legal — **not** product docs (legal pages stay English-only until counsel-reviewed)
- Published product docs live under path prefixes: `/rusty`, `/scripty`, `/worgo`, `/pyppi`, `/hasky`, `/yappy`, `/deploy`, `/clerk-zig`, `/zig-libsql`, `/depotsdk-go`
- Deferred product trees (**git**, **trunker**) and Spanish live under **`.nrn/`** — restore via `.nrn/navigation.deferred.json` when ready
- Translate with DeepL via `scripts/translate-mdx.mjs` (protects brands/code with keep placeholders); re-wrap nav with `scripts/wrap-languages.mjs` after adding locales

## Site structure

| Product switcher entry | Path prefix | Contents |
| --- | --- | --- |
| **Home** | `/`, `/legal/*` | Welcome page + Privacy, Terms, EULA, CLA |
| **rusty** | `/rusty` | Rust PM + toolchains (Linux-only) |
| **scripty** | `/scripty` | JS runtime + PM; pre-v0.0.1 program under `/scripty/v0.0.1-dev` |
| **worgo** | `/worgo` | Go workspace PM (intro) |
| **pyppi** | `/pyppi` | Python package manager (intro) |
| **hasky** | `/hasky` | Haskell toolchain + PM (schema + CLI; Linux-only) |
| **yappy** | `/yappy` | Native Linux desktop shell — Qt + GTK, scripty logic (intro + matrices) |
| **deploy** | `/deploy` | Next.js → Cloudflare Workers init-time CLI + owned runtime |
| **clerk-zig** | `/clerk-zig` | Shared Clerk OAuth library + `$PMS_HOME` contract |
| **zig-libsql** | `/zig-libsql` | Zig libSQL / SQLite adapter (library) |
| **depotsdk-go** | `/depotsdk-go` | Go SDK for Depot API (intro) |

Deferred (not in nav / not published): **git**, **trunker**, Spanish (`es`). See `.nrn/README.md`.

## Local monorepo sources

Docs are synced from the **pms** monorepo product trees when possible:

| Docs product | Local tree | Notes |
| --- | --- | --- |
| rusty | `../rusty` | Full docs; CLI/auth from binary help |
| scripty | `../scripty` | Intro + pre-v0.0.1 program |
| worgo | `../worgo` | Scaffold intro |
| pyppi | `../pyppi` | Scaffold intro |
| hasky | `../hasky` | Intro + hasky.json + CLI |
| yappy | `../yappy` | Intro + backend/API matrices |
| deploy | `../deploy` | Intro from README / DESIGN |
| clerk-zig | `../clerk-zig` | Intro + PMS_HOME + consuming |
| zig-libsql | `../zig-libsql` | Intro + consuming |
| depotsdk-go | *(not in pms monorepo)* | Keep intro; expand when checkout available |

When updating docs after product work, prefer CLI `--help`, product `README.md`, and `docs/` under each package over inventing surfaces.

## Terminology

- Product names in UI and headings: lowercase **rusty**, **scripty**, **worgo**, **pyppi**, **hasky**, **yappy**, **deploy**, **git**, **depotsdk-go**, **trunker**, **clerk-zig**, **zig-libsql**
- **worgo** is the product/package name (repo: solvedggorg/worgo; site: worgo.pm.solved.gg)
- Marketing sites for the PM suite: `pm.solved.gg` (hub) and `<product>.pm.solved.gg` (rusty, scripty, worgo, yappy, pyppi, hasky, deploy)
- **yappy** is permanently Linux-only and always native UI (Qt + GTK; no webview) — state that when platform or UI is discussed
- **scripty** is the JS runtime/PM yappy embeds; do not describe yappy as Electron-with-Zig
- **deploy** is init-time Next.js → Cloudflare Workers with an **owned** runtime — not OpenNext; do not claim full Next/Vercel parity before the compat matrix does
- **git** is the solved.gg org-scoped git host UI (Clerk + Depot CI); not a public mass multi-tenant forge
- **trunker** is the hosted Linear ↔ GitHub control plane (Clerk orgs = workspaces). Do not claim local worktrees, auto-open PR, or Linear write-back as shipped unless the product docs say so. App: trunker.solved.gg; API: trunker.api.solved.gg. Env keys follow the product root `.env` contract (LINEAR_CALLBACK_URL, GITHUB_*, etc.)
- **pyppi** is Python tooling; do not claim full pip/uv parity while early access
- **hasky** is a Linux-only Haskell toolchain (Zig): lock-first `hasky.json` / `hasky.lock`, CAS store, native GHC driver. Cabal/Stack are migration inputs only. Do not claim full Cabal/Stack parity or non-Linux support
- **clerk-zig** is the shared product OAuth library; session at `$PMS_HOME/auth/session.db`. Not a full Clerk Backend SDK
- **zig-libsql** is the Zig libSQL/SQLite adapter (vendored amalgamation + Hrana HTTP); default path has no cargo
- Prefer **toolchain** over "rustup install" when describing `rusty env`
- Prefer **rusty-format** / **cargo-format** for project layouts
- Prefer **native** vs **interop** for cargo process vs Zig implementation
- Never claim full Cargo parity; rusty is dual-mode early access
- rusty is **permanently Linux-only** — state that whenever install or platform is discussed
- rusty `clippy` / `fmt` are **native**; `doc` / `bench` / `tree` remain cargo interop
- Product auth uses `PMS_AUTH_*` + `$PMS_HOME` (legacy `RUSTY_AUTH_*` aliases still accepted)
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
- scripty, worgo, pyppi, hasky, yappy, depotsdk-go: keep intros accurate to public positioning; expand only when CLI/SDK surfaces exist
- Do not re-publish git, trunker, or Spanish from `.nrn/` until intentionally restored to nav
- **scripty pre-v0.0.1 program** lives under `/scripty/v0.0.1-dev` (ES2026 engine gate + Bun-exclusive + Deno-exclusive initiatives). Do not claim ES/Bun/Deno parity unless the matrices in that tree say `supported` or `dogfooded`. Prefer linking the program over inventing install/CLI docs early.
- For depotsdk-go, do not invent a module path that is not in `go.mod` / release notes — link the org repo and note path when unsettled
- For deploy, do not invent published npm package versions; build-from-source is the honest path until install channels freeze
- For clerk-zig / zig-libsql, do not invent release tags; confirm against org releases before documenting pins
- Legal text is operational starting copy — flag for counsel review before treating as final corporate policy
