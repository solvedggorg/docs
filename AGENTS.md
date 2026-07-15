# Documentation project instructions

## About this project

- Documentation site for **solved.gg** products, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Primary navigation is **`navigation.products`**
- Site root (**Home**) is welcome + legal — **not** product docs
- Product docs live under path prefixes: `/rusty`, `/scripty`, `/wargo`

## Site structure

| Product switcher entry | Path prefix | Contents |
| --- | --- | --- |
| **Home** | `/`, `/legal/*` | Welcome page + Privacy, Terms, EULA, CLA |
| **rusty** | `/rusty` | Rust PM + toolchains (Linux-only) |
| **scripty** | `/scripty` | JS runtime + PM (intro) |
| **wargo** | `/wargo` | Go workspace PM (intro) |

## Terminology

- Product names in UI and headings: lowercase **rusty**, **scripty**, **wargo**
- **wargo** is the product/package name; public site may say **Worgo** / worgopm.com — both refer to the same product
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
- Do not invent install URLs or version numbers that are not real — point to rustypm.com / intake@solved.gg when channels are unsettled
- scripty and wargo: keep intros accurate to public positioning; expand only when CLI surfaces exist
- Legal text is operational starting copy — flag for counsel review before treating as final corporate policy
