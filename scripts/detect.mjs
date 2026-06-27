import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const RULES = [
  { name: "gradient-text", test: (l) => l.includes("bg-clip-text") && l.includes("bg-gradient"), sev: "warning" },
  { name: "side-stripe-border", test: (l) => /border-(left|right):\s*\d+px/.test(l) || /border-(l|r)-\[\d+px\]/.test(l), sev: "warning" },
  { name: "glassmorphism", test: (l) => l.includes("backdrop-blur") && l.includes("bg-") && !l.includes("card"), sev: "info" },
  { name: "hero-metric", test: (l) => /text-\[?\d+(r?em|px)\]?\s+font-bold/.test(l) && l.includes("stats"), sev: "info" },
  { name: "nested-card", test: (l) => (l.match(/<div\s/g) || []).length >= 3 && (l.includes("card") || l.includes("panel")), sev: "info" },
  { name: "hardcoded-color", test: (l) => /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(l) && !l.trim().startsWith("//") && !l.includes("import") && !l.includes("color:"), sev: "info" },
  { name: "missing-aria-label", test: (l) => l.includes('size="icon"') && !l.includes("aria-label") && !l.includes("aria-hidden") && !l.includes("sr-only"), sev: "warning" },
  { name: "eyebrow-kicker", test: (l) => l.includes("section-kicker") || (l.includes("text-xs") && l.includes("uppercase") && l.includes("tracking")), sev: "info" },
  { name: "numbered-section", test: (l) => /^\s*\/\/\s*(0[1-9]|1[0-9]|2[0-9])\s*[.﹣-]/.test(l.trim()) && (l.includes("Section") || l.includes("section")), sev: "info" },
  { name: "bounce-easing", test: (l) => l.includes("bounce") && (l.includes("easing") || l.includes("transition") || l.includes("animation")), sev: "warning" },
  { name: "repeating-gradient", test: (l) => l.includes("repeating-linear-gradient"), sev: "warning" },
  { name: "sketchy-svg", test: (l) => l.includes("feTurbulence") || l.includes("feDisplacementMap"), sev: "warning" },
  { name: "skeleton-without-content", test: (l) => l.includes("Skeleton") && l.includes("isLoading") && !l.includes("aria-busy"), sev: "info" },
  { name: "missing-empty-state", test: (l) => l.includes("isEmpty") && !l.includes("EmptyState"), sev: "info" },
  { name: "inline-style", test: (l) => /style=\{\{[^}]{40,}\}\}/.test(l), sev: "info" },
  { name: "console-log", test: (l) => /console\.(log|debug)\(/.test(l) && !l.includes("//") && !l.includes("*"), sev: "warning" },
];

const projectRoot = process.cwd();

function scanFile(filePath) {
  const findings = [];
  const relPath = relative(projectRoot, filePath);
  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, i) => {
      const num = i + 1;
      const trimmed = line.trim();
      for (const rule of RULES) {
        if (rule.test(trimmed)) {
          findings.push({ antipattern: rule.name, file: relPath, line: num, severity: rule.sev });
        }
      }
    });
  } catch {}
  return findings;
}

function scanDir(dir) {
  let findings = [];
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith(".") || ["node_modules", ".next", ".svelte-kit", ".nuxt", "dist"].includes(item.name)) continue;
      const full = join(dir, item.name);
      if (item.isDirectory()) findings.push(...scanDir(full));
      else if (/\.(tsx?|jsx?|vue|svelte|astro)$/.test(item.name)) findings.push(...scanFile(full));
    }
  } catch {}
  return findings;
}

const targets = process.argv.slice(2).filter((a) => !a.startsWith("--json"));
const useJson = process.argv.includes("--json");
let allFindings = [];

for (const target of targets) {
  const fullPath = join(projectRoot, target);
  if (!existsSync(fullPath)) continue;
  allFindings.push(...(statSync(fullPath).isDirectory() ? scanDir(fullPath) : scanFile(fullPath)));
}

if (useJson) console.log(JSON.stringify(allFindings, null, 2));
else {
  for (const f of allFindings) console.log(`[${f.severity}] ${f.antipattern} at ${f.file}:${f.line}`);
  if (allFindings.length === 0) console.log("[]");
}
