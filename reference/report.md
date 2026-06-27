# Report Flow

Generate a markdown summary from existing trace findings. Use when you've already traced one or more journeys and want a compiled report.

## Step 1: Gather findings

Collect all finding entries from the traces. Each entry should have: role, journey, step, description, severity.

## Step 2: Classify by severity

Group by P0, P1, P2, P3, S. Sort within each group by estimated fix effort (quick wins first).

## Step 3: Identify patterns

Look for cross-cutting themes:
- Same issue appearing in multiple roles
- Same component failing in multiple contexts
- Missing states (loading, empty, error) across multiple pages

## Step 4: Generate recommendations

For each P0-P1 finding, recommend a concrete fix. Map each to a command.

## Output

```
# Journey Audit Report

## Executive Summary
- Roles traced: [N]
- Journeys traced: [N]
- Total findings: [N] (P0: N, P1: N, P2: N, P3: N, S: N)

## Critical (P0)
1. [Finding] → Fix: [command or code change]

## Cross-cutting patterns
- [Pattern]

## Feature suggestions
- [Suggestion]

## Recommended next commands
1. `$impeccable critique <page>` — design review
2. `$journey-audit trace <role>` — deep dive
```
