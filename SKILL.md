---
name: journey-audit
description: Comprehensive user journey mapper and auditor. Use to discover every user role, enumerate all end-to-end journeys, and trace each atomic step for visual and functional shortcomings. Works on any web app — e-commerce, SaaS, marketplace, dashboard, content site. Produces a full role-journey-finding matrix with severity ratings and feature suggestions.
version: 1.1.0
---

Systematically discover every reason any party would use the application, trace their complete end-to-end journey at an atomic level, and flag every shortcoming, hurdle, bug, or feature gap at each step.

## Commands

| Command | Flow |
|---------|------|
| `$journey-audit` (no arg) | Show this menu contextually |
| `$journey-audit init` | Set up project context — run `reference/init.md` |
| `$journey-audit scan` | Quick role discovery — run `reference/scan.md` |
| `$journey-audit trace [role]` | Full atomic journey trace — run `reference/trace.md` |
| `$journey-audit report` | Generate summary from existing findings — run `reference/report.md` |

## Setup

1. Run `node <agents-path>/skills/journey-audit/scripts/context.mjs` to detect framework and routes. The `<agents-path>` is the user's global agents directory (`~/.agents/` on Unix, `%USERPROFILE%\.agents\` on Windows).
2. If the user invoked a sub-command (`scan`, `trace`, `report`, `init`), read `reference/<command>.md` next.
3. **Discover routes and structure.** Map every accessible URL from routing config.
4. **Read project docs.** Check for README, PRODUCT.md, docs/. Understand the domain.
5. **Identify auth boundaries.** Check for middleware, route guards, role-based access control.

## Global rules

### Every party, every reason
Exhaustively enumerate reasons someone would use the app. "Browse products" is too coarse — split into: search by keyword, filter by category, sort by price, view product details, read reviews, add to cart, etc.

### Atomic steps
A journey is a sequence of atomic user actions. Break until no step can be broken further. Each step is one interaction: a navigation, a click, a keystroke, a scroll, a form submission.

### Visual + functional at every step
For every atomic step, evaluate both:
- **Visual:** Is the UI clear? Consistent? Accessible? Do loading/empty/error states exist? Touch targets ≥44px?
- **Functional:** Does it work? Loading indicators? Errors caught and surfaced? Edge cases handled? Auth enforced?

### Trace every permutation
Every journey gets at least four traces:
1. Happy path (everything works)
2. Empty/null state (no data to show)
3. Error state (network failure, server error, validation failure)
4. Edge case (banned user, expired content, soft-deleted item, permission denied)

### No assumptions
If you can't verify something, mark it as **UNVERIFIED**.

### New features from gaps
Every missing capability or painful step is a feature opportunity.

## Output

```
## [Role] — [N journeys, M findings]

### Journey 1: [Concrete end-to-end goal]
[Context: who, why, when]

**Entry:** [route or trigger] → **Exit:** [success or dead-end]

| # | Step | Visual | Functional | Finding | Severity |
|---|------|--------|------------|---------|----------|
```

Followed by a **Cross-Role Summary**:
- Top P0 findings (blocks task completion)
- Common failure patterns across roles
- New feature suggestions (S items)
- Recommended next commands

Severity: P0 = blocks task, P1 = major friction, P2 = minor, P3 = polish, S = new feature suggestion

## Persistence

Findings are persisted to trace session files under `sessions/` (gitignored). Each session tracks:
- Completed roles and journeys
- All findings with timestamps
- Checkpoints for resume on interruption

Use `scripts/session.mjs` to list, load, and resume sessions.

## Parallel tracing

For large audits (5+ roles), launch one sub-agent per role. Each agent returns a JSON findings array. Merge results to produce the final matrix.

## Schema

Findings follow this structure:

```json
{
  "role": "Visitor",
  "journey": "Find a restaurant and book",
  "stepIndex": 3,
  "step": "Click search result",
  "location": "/directory/123",
  "visual": "Pass",
  "functional": "Fail",
  "finding": "Reviews section has no empty state",
  "severity": "P2",
  "verifiedBy": "code",
  "timestamp": "2026-06-27T..."
}
```
