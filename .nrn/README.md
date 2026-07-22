# Not right now (`.nrn`)

Deferred docs content that should not ship in the live Mintlify site yet.

| Path | What |
| --- | --- |
| `es/` | Spanish locale (full tree) |
| `deploy/` | **superseded** — live tree is `../deploy/` (kept for Spanish / history) |
| `git/` | git product intro |
| `trunker/` | trunker 0.1.0 guides |
| `navigation.deferred.json` | Nav blocks to restore into `docs.json` (deploy entry may already be live) |

## Restore

1. Move the product/locale dirs back to the repo root (or out of `.nrn/`).
2. Merge `english_products` and `spanish_language` from `navigation.deferred.json` into `docs.json` → `navigation.languages`.
3. Remove the matching `.mintignore` / Vale skip entries if you want the pages built and linted again.
4. Re-link product cards on `index.mdx` and sibling tables on active intros.

Mintlify ignores this directory via `.mintignore`.
