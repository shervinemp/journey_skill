import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const SESSION_DIR = ".agents/skills/journey-audit/sessions";

function sessionDir(projectRoot) {
  const dir = join(projectRoot, SESSION_DIR);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function createSession(projectRoot, metadata = {}) {
  const id = new Date().toISOString().replace(/[:.]/g, "-");
  const session = { id, createdAt: new Date().toISOString(), status: "in_progress", currentRole: null, currentJourney: null, completedRoles: [], findings: [], checkpoints: [], ...metadata };
  writeFileSync(join(sessionDir(projectRoot), `${id}.json`), JSON.stringify(session, null, 2));
  return session;
}

export function loadSession(projectRoot, id) {
  const path = join(sessionDir(projectRoot), `${id}.json`);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : null;
}

export function saveSession(projectRoot, session) {
  writeFileSync(join(sessionDir(projectRoot), `${session.id}.json`), JSON.stringify(session, null, 2));
}

export function addFinding(projectRoot, session, finding) {
  session.findings.push({ ...finding, timestamp: new Date().toISOString() });
  saveSession(projectRoot, session);
}

export function checkpoint(projectRoot, session, label) {
  session.checkpoints.push({ label, role: session.currentRole, journey: session.currentJourney, findingCount: session.findings.length, timestamp: new Date().toISOString() });
  saveSession(projectRoot, session);
}

export function listSessions(projectRoot) {
  try {
    return readdirSync(sessionDir(projectRoot)).filter((f) => f.endsWith(".json")).map((f) => {
      const d = JSON.parse(readFileSync(join(sessionDir(projectRoot), f), "utf-8"));
      return { id: d.id, status: d.status, createdAt: d.createdAt, findingCount: d.findings.length, completedRoles: d.completedRoles };
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch { return []; }
}
