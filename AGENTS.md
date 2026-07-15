# Documentation project instructions

## About this project

- Documentation site for **solved.gg** products, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Primary navigation is **`navigation.products`**: `rusty`, `scripty`, `wargo`

## Products

| Product | Path | Ecosystem | Doc depth |
| --- | --- | --- | --- |
| rusty | `rusty/` | Rust PM + toolchains (Linux-only) | Intro + concepts + guides + CLI |
| scripty | `scripty/` | JS runtime + PM (Node/Deno/Bun APIs) | Intro only until product freezes |
| wargo | `wargo/` | Go workspace PM (branded Worgo / worgopm.com) | Intro only until product freezes |

## Terminology

- Product names in UI and headings: lowercase **rusty**, **scripty**, **wargo**
- **wargo** is the product/package name; public site may say **Worgo** / worgopm.com — both refer to the same product
- Prefer **toolchain** over "rustup install" when describing `rusty env`
- Prefer **rusty-format** / **cargo-format** for project layouts
- Prefer **native** vs **interop** for cargo process vs Zig implementation
- Never claim full Cargo parity; rusty is dual-mode early access
- rusty is **permanently Linux-only** — state that whenever install or platform is discussed

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Prefer honest early-access language over marketing hyperbole; performance claims should cite the origin story (3,676-crate client monorepo) when using the ~400× figure

## Content boundaries

- Document user-facing CLI and workflows; do not document internal agent-only policy files as product docs
- Do not invent install URLs or version numbers that are not real — point to rustypm.com / intake@solved.gg when channels are unsettled
- scripty and wargo: keep intros accurate to public positioning; expand only when CLI surfaces exist
