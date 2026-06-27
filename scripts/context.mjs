import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { detectFramework, findRoutes, findAuthDir } from "./framework.mjs";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node <path>/context.mjs");
  console.log("Detects the project framework, maps all routes, and prints JSON.");
  process.exit(0);
}

const projectRoot = process.cwd();
const framework = detectFramework(projectRoot);
const routes = findRoutes(projectRoot, framework);
const auth = findAuthDir(projectRoot);
const readme = ["README.md", "README.mdx", "readme.md"].find((f) => existsSync(join(projectRoot, f)));

console.log(JSON.stringify({ framework, routes, hasAuth: !!auth, authDir: auth, hasReadme: !!readme, projectRoot }, null, 2));
