export function findingsToMarkdown(findings) {
  const byRole = {};
  for (const f of findings) { if (!byRole[f.role]) byRole[f.role] = []; byRole[f.role].push(f); }

  const counts = { P0: 0, P1: 0, P2: 0, P3: 0, S: 0 };
  for (const f of findings) counts[f.severity]++;

  let md = "# Journey Audit Report\n\n";
  md += `## Executive Summary\n\n- **Roles traced:** ${Object.keys(byRole).length}\n- **Total findings:** ${findings.length} (P0: ${counts.P0}, P1: ${counts.P1}, P2: ${counts.P2}, P3: ${counts.P3}, S: ${counts.S})\n\n`;

  for (const [role, items] of Object.entries(byRole)) {
    const roleP0 = items.filter((f) => f.severity === "P0").length;
    const roleP1 = items.filter((f) => f.severity === "P1").length;
    md += `## ${role} — ${items.length} findings (P0: ${roleP0}, P1: ${roleP1})\n\n`;

    const byJourney = {};
    for (const f of items) { if (!byJourney[f.journey]) byJourney[f.journey] = []; byJourney[f.journey].push(f); }

    for (const [journey, steps] of Object.entries(byJourney)) {
      md += `### ${journey}\n\n| # | Step | Visual | Functional | Finding | Severity |\n|---|---|---|---|---|---|\n`;
      steps.sort((a, b) => a.stepIndex - b.stepIndex).forEach((f) => {
        md += `| ${f.stepIndex} | ${f.step} | ${f.visual} | ${f.functional} | ${f.finding} | ${f.severity} |\n`;
      });
      md += "\n";
    }
  }

  const critical = findings.filter((f) => f.severity === "P0");
  if (critical.length > 0) {
    md += `## Critical (P0)\n\n`;
    critical.forEach((f, i) => { md += `${i + 1}. **${f.finding}** — ${f.role}/${f.journey} (${f.location})\n`; });
    md += "\n";
  }

  const suggestions = findings.filter((f) => f.severity === "S");
  if (suggestions.length > 0) {
    md += `## Feature Suggestions\n\n`;
    suggestions.forEach((f, i) => { md += `${i + 1}. **${f.finding}** — ${f.role}/${f.journey}\n`; });
    md += "\n";
  }

  return md;
}

export function findingsToJson(findings) {
  return JSON.stringify(findings, null, 2);
}
