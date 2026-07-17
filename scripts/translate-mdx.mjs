#!/usr/bin/env bun
/**
 * Translate MDX docs with DeepL, protecting brands/code via XML <keep> wrappers.
 *
 * Usage:
 *   bun scripts/translate-mdx.mjs --target es path/to/file.mdx ...
 *   bun scripts/translate-mdx.mjs --target es --all-pilot
 *
 * Loads DEEPL_API_KEY from env or project .env.
 * Free keys (*:fx) use api-free.deepl.com; otherwise api.deepl.com.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const BRANDS = [
  "depotsdk-go",
  "solved.gg",
  "iResolved, LLC",
  "iResolved",
  "rusty",
  "scripty",
  "worgo",
  "pyppi",
  "yappy",
  "deploy",
  "OpenNext",
  "Cloudflare Workers",
  "Cloudflare",
  "Next.js",
  "Clerk",
  "Depot",
  "Linear",
  "Productlane",
  "Workers AI",
  "Hyperdrive",
  "Cargo",
  "cargo",
  "rustup",
  "rustc",
  "rust-std",
  "rustdoc",
  "rustfmt",
  "clippy",
  "crates.io",
  "Node.js",
  "Deno",
  "Bun",
  "Zig",
  "Qt",
  "GTK",
  "Electron",
  "Tauri",
  "Astro",
  "Go",
  "Python",
  "Linux",
  "macOS",
  "Windows",
  "PATH",
  "TTY",
  "CAS",
  "SSR",
  "API",
  "CLI",
  "SDK",
  "UI",
  "PM",
  "CI",
  "SSH",
  "KV",
  "R2",
  "D1",
  "FS",
  "JS",
  "TS",
];

const PILOT_PAGES = [
  "index.mdx",
  "rusty/0.0.1-dev/index.mdx",
  "rusty/0.0.1-dev/quickstart.mdx",
  "rusty/0.0.1-dev/install.mdx",
  "scripty/0.0.1-dev/index.mdx",
  "worgo/0.0.1-dev/index.mdx",
  "yappy/0.0.1-dev/index.mdx",
  "pyppi/0.0.1-dev/index.mdx",
  "deploy/0.0.1-dev/index.mdx",
  "git/index.mdx",
  "depotsdk-go/0.0.1-dev/index.mdx",
];

// Internal product doc roots that get locale-prefixed in translated pages
const LOCALE_LINK_PREFIXES = [
  "/rusty",
  "/scripty",
  "/worgo",
  "/yappy",
  "/pyppi",
  "/deploy",
  "/git",
  "/depotsdk-go",
];

function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

function apiBase(key) {
  return key.includes(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";
}

// Placeholder tokens DeepL leaves alone (not XML — MDX has bare JSX tags).
const SLOT_OPEN = "⟦KEEP";
const SLOT_CLOSE = "⟧";

/** Split MDX into translate-able text vs protected slots (code, JSX, brands). */
function protectMdx(source) {
  const slots = [];
  const put = (raw) => {
    const id = slots.length;
    slots.push(raw);
    return `${SLOT_OPEN}${id}${SLOT_CLOSE}`;
  };

  let text = source;

  // YAML frontmatter — translate title/description separately
  let frontmatter = null;
  if (text.startsWith("---\n")) {
    const end = text.indexOf("\n---\n", 4);
    if (end !== -1) {
      frontmatter = text.slice(0, end + 5);
      text = text.slice(end + 5);
    }
  }

  // Code first so JSX-like tokens inside fences/inline (e.g. `<id>`) stay nested
  // only as literal text inside a single outer slot — never as separate tags.
  text = text.replace(/```[\s\S]*?```/g, (m) => put(m));
  text = text.replace(/`[^`\n]+`/g, (m) => put(m));

  // Full MDX/JSX tags (opening, closing, self-closing) — protect structure
  text = text.replace(/<\/?[A-Za-z][\w.-]*(?:\s[^>]*)?>/g, (m) => put(m));

  // Markdown / MDX links and images: protect destination, keep label free
  text = text.replace(
    /(!?\[[^\]]*\]\()([^)]+)(\))/g,
    (_m, a, url, c) => `${a}${put(url)}${c}`,
  );

  // Brand / product tokens (longest first)
  const sorted = [...BRANDS].sort((a, b) => b.length - a.length);
  for (const brand of sorted) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<![\\w@./-])${escaped}(?![\\w@./-])`, "g");
    text = text.replace(re, (m) => {
      // skip if already inside a keep marker region (simple: don't re-wrap markers)
      return put(m);
    });
  }

  // $ENV_VARS
  text = text.replace(/\$[A-Z][A-Z0-9_]*/g, (m) => put(m));

  return { frontmatter, body: text, slots };
}

function restoreSlots(text, slots) {
  // DeepL may insert spaces around markers; be tolerant.
  // Loop in case a restored slot still contains nested markers (shouldn't after
  // code-first protect order, but keep recovery path).
  const re = new RegExp(`${SLOT_OPEN}\\s*(\\d+)\\s*${SLOT_CLOSE}`, "g");
  let prev;
  do {
    prev = text;
    text = text.replace(re, (_m, id) => {
      const i = Number(id);
      if (slots[i] == null) throw new Error(`Missing slot ${i}`);
      return slots[i];
    });
  } while (text !== prev);
  return text;
}

async function translateText(text, { key, target, source = "EN" }) {
  if (!text.trim()) return text;

  const res = await fetch(`${apiBase(key)}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: source,
      target_lang: target.toUpperCase() === "EN" ? "EN-US" : target.toUpperCase(),
      formality: "prefer_less",
      preserve_formatting: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.translations[0].text;
}

function parseFrontmatter(block) {
  if (!block) return { raw: null, fields: {} };
  const inner = block.replace(/^---\n/, "").replace(/\n---\n?$/, "");
  const fields = {};
  for (const line of inner.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*"(.*)"\s*$/);
    if (m) fields[m[1]] = m[2];
    else {
      const m2 = line.match(/^([A-Za-z0-9_-]+):\s*(.*)\s*$/);
      if (m2) fields[m2[1]] = m2[2];
    }
  }
  return { raw: block, fields };
}

function localeLinks(body, locale) {
  let out = body;
  // Avoid double-prefixing /es/rusty etc.
  const already = new RegExp(`^/${locale}(/|$)`);
  for (const prefix of LOCALE_LINK_PREFIXES) {
    const esc = prefix.replace("/", "\\/");
    // href="/rusty..." or href='/rusty...'
    out = out.replace(
      new RegExp(`(href=["'])${esc}(?=["'/#[?])`, "g"),
      (m, a) => {
        const path = m.slice(a.length);
        if (already.test(path)) return m;
        return `${a}/${locale}${path}`;
      },
    );
    // markdown ](/rusty...) including nested paths
    out = out.replace(
      new RegExp(`(\\]\\()${esc}([^)\\s]*)`, "g"),
      (_m, a, rest) => {
        const path = prefix + rest;
        if (already.test(path)) return `${a}${path}`;
        return `${a}/${locale}${path}`;
      },
    );
  }
  return out;
}

async function translateMdx(relPath, { key, target }) {
  const srcPath = join(ROOT, relPath);
  const source = readFileSync(srcPath, "utf8");
  const { frontmatter, body, slots } = protectMdx(source);

  const { fields } = parseFrontmatter(frontmatter);
  const title = fields.title
    ? await translateText(fields.title, { key, target })
    : null;
  const description = fields.description
    ? await translateText(fields.description, { key, target })
    : null;

  // Chunk body if large (DeepL request size limits)
  const CHUNK = 4000;
  let translatedBody = "";
  if (body.length <= CHUNK) {
    translatedBody = await translateText(body, { key, target });
  } else {
    // Split on double newlines to keep paragraphs together
    const parts = body.split(/\n\n+/);
    let buf = "";
    const chunks = [];
    for (const p of parts) {
      if ((buf + "\n\n" + p).length > CHUNK && buf) {
        chunks.push(buf);
        buf = p;
      } else {
        buf = buf ? buf + "\n\n" + p : p;
      }
    }
    if (buf) chunks.push(buf);
    const outs = [];
    for (const c of chunks) {
      outs.push(await translateText(c, { key, target }));
    }
    translatedBody = outs.join("\n\n");
  }

  let restored = restoreSlots(translatedBody, slots);
  restored = localeLinks(restored, target);

  let fmOut = "---\n";
  if (title != null) fmOut += `title: ${JSON.stringify(title)}\n`;
  if (description != null) fmOut += `description: ${JSON.stringify(description)}\n`;
  // preserve other frontmatter keys as-is
  for (const [k, v] of Object.entries(fields)) {
    if (k === "title" || k === "description") continue;
    fmOut += `${k}: ${JSON.stringify(v)}\n`;
  }
  fmOut += "---\n";

  const outRel = join(target, relPath);
  const outPath = join(ROOT, outRel);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, fmOut + restored);
  return { outRel, chars: body.length + (title?.length || 0) + (description?.length || 0) };
}

function parseArgs(argv) {
  const target = (() => {
    const i = argv.indexOf("--target");
    return i >= 0 ? argv[i + 1] : "es";
  })();
  const allPilot = argv.includes("--all-pilot");
  const files = argv.filter((a) => !a.startsWith("--") && a !== target);
  // drop "es" if it was captured as file after --target
  const cleaned = files.filter((f) => f !== target && f.endsWith(".mdx"));
  return {
    target,
    files: allPilot ? PILOT_PAGES : cleaned,
  };
}

loadEnv();
const key = process.env.DEEPL_API_KEY;
if (!key) {
  console.error("DEEPL_API_KEY not set");
  process.exit(1);
}

const { target, files } = parseArgs(process.argv.slice(2));
if (!files.length) {
  console.error("No files. Pass .mdx paths or --all-pilot");
  process.exit(1);
}

console.log(`DeepL → ${target} (${files.length} file(s)) via ${apiBase(key)}`);
for (const f of files) {
  process.stdout.write(`  ${f} … `);
  try {
    const { outRel } = await translateMdx(f, { key, target });
    console.log(`→ ${outRel}`);
  } catch (e) {
    console.log("FAILED");
    console.error(e);
    process.exit(1);
  }
}
console.log("Done.");
