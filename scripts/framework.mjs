import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

export function detectFramework(projectRoot) {
  if (existsSync(join(projectRoot, "next.config.js")) || existsSync(join(projectRoot, "next.config.mjs"))) return "next";
  if (existsSync(join(projectRoot, "nuxt.config.js")) || existsSync(join(projectRoot, "nuxt.config.ts"))) return "nuxt";
  if (existsSync(join(projectRoot, "svelte.config.js"))) return "sveltekit";
  if (existsSync(join(projectRoot, "astro.config.mjs"))) return "astro";
  if (existsSync(join(projectRoot, "vite.config.ts")) || existsSync(join(projectRoot, "vite.config.js"))) return "vite";
  if (existsSync(join(projectRoot, "package.json"))) {
    const pkg = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf-8"));
    const dev = pkg.scripts?.dev ?? "";
    if (dev.includes("next")) return "next";
    if (dev.includes("nuxt")) return "nuxt";
    if (dev.includes("svelte")) return "sveltekit";
    if (dev.includes("astro")) return "astro";
    if (dev.includes("vite")) return "vite";
  }
  return "unknown";
}

export function findRoutes(projectRoot, framework) {
  const dirs = routeDirs(framework);
  const all = [];
  for (const dir of dirs) {
    const full = join(projectRoot, dir);
    if (existsSync(full)) walk(full, "", framework, all);
  }
  return [...new Set(all)].sort();
}

function routeDirs(framework) {
  return { next: ["src/app", "app", "src/pages", "pages"], sveltekit: ["src/routes"], nuxt: ["pages"], astro: ["src/pages"] }[framework] ?? ["src", "."];
}

function walk(dir, base, framework, routes) {
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith(".") || ["node_modules", ".next", ".svelte-kit", ".nuxt", "dist"].includes(item.name)) continue;
      const full = join(dir, item.name);
      const name = item.name.replace(/^\[(.+)\]$/, ":$1").replace(/^\((.+)\)$/, "").replace(/\.(tsx?|jsx?|vue|svelte|astro)$/, "");
      if (item.isDirectory()) walk(full, `${base}/${name}`, framework, routes);
      if (isPage(item.name, framework)) routes.push(base || "/");
    }
  } catch {}
}

function isPage(name, fw) {
  if (fw === "next") return /^page\.(tsx?|jsx?)$/.test(name);
  if (fw === "sveltekit") return name === "+page.svelte";
  return name.endsWith(".vue") || name.endsWith(".astro") || name.endsWith(".html") || name.endsWith(".tsx");
}

export function findAuthDir(projectRoot) {
  for (const c of ["src/server/auth", "src/app/api/auth", "pages/api/auth", "src/routes/auth"]) {
    if (existsSync(join(projectRoot, c))) return c;
  }
  return null;
}
