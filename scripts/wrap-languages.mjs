#!/usr/bin/env bun
/**
 * One-shot: wrap docs.json navigation.products under languages (en + es).
 * Spanish nav only lists pages that exist under es/*.mdx.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const esGroupNames = {
  Welcome: "Bienvenida",
  Legal: "Legal",
  "Get started": "Primeros pasos",
  "Core concepts": "Conceptos básicos",
  Guides: "Guías",
  Reference: "Referencia",
};

const esDescriptions = {
  Home: "Bienvenida a la documentación y a los aspectos legales de solved.gg",
  rusty: "Cargo + rustup, reconstruidos en Zig para monorepos de Linux",
  scripty:
    "Entorno de ejecución JS y gestor de proyectos — API de Node, Deno y Bun en Zig",
  worgo:
    "Gestor de proyectos y espacios de trabajo Go de nueva generación, escrito en Zig",
  yappy:
    "Shell de escritorio nativo solo para Linux — Qt + GTK, scripty para la lógica",
  "depotsdk-go": "SDK de Go para la API de Depot",
  deploy: "Next.js → Cloudflare Workers en el momento de la inicialización",
  pyppi: "Gestor de paquetes y herramienta de proyectos Python, escrito en Zig",
  git: "UI del servidor git de solved.gg — auth Clerk, CI Depot",
};

const docs = JSON.parse(readFileSync(join(ROOT, "docs.json"), "utf8"));
const enProducts = docs.navigation.products;
const global = docs.navigation.global;

const esProducts = JSON.parse(JSON.stringify(enProducts));

for (const product of esProducts) {
  if (esDescriptions[product.product]) {
    product.description = esDescriptions[product.product];
  }
  if (!product.versions) continue;
  for (const ver of product.versions) {
    if (!ver.groups) continue;
    const newGroups = [];
    for (const g of ver.groups) {
      g.group = esGroupNames[g.group] || g.group;
      if (!g.pages) continue;
      const mapped = [];
      for (const p of g.pages) {
        if (typeof p !== "string") continue;
        // Legal remains English-only until counsel-reviewed translations exist.
        if (p.startsWith("legal/")) continue;
        const esPath = p === "index" ? "es/index" : `es/${p}`;
        if (existsSync(join(ROOT, `${esPath}.mdx`))) {
          mapped.push(esPath);
        }
      }
      if (mapped.length) newGroups.push({ ...g, pages: mapped });
    }
    ver.groups = newGroups;
  }
  product.versions = (product.versions || []).filter(
    (v) => v.groups && v.groups.some((g) => g.pages?.length),
  );
}

const esProductsFiltered = esProducts.filter((p) => p.versions?.length);

docs.navigation = {
  languages: [
    { language: "en", default: true, products: enProducts },
    { language: "es", products: esProductsFiltered },
  ],
  global,
};

writeFileSync(join(ROOT, "docs.json"), JSON.stringify(docs, null, 2) + "\n");

console.log("en products:", enProducts.length);
console.log(
  "es products:",
  esProductsFiltered.map((p) => p.product).join(", "),
);
for (const p of esProductsFiltered) {
  for (const v of p.versions) {
    for (const g of v.groups) {
      console.log(`  ${p.product} / ${g.group}: ${g.pages.join(", ")}`);
    }
  }
}
