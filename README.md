# Journey Audit Skill

A comprehensive user journey mapper and auditor for any web application. Discovers every user role, enumerates all end-to-end journeys, and traces each atomic step for visual and functional shortcomings.

Works on any framework — Next.js, Nuxt, SvelteKit, Astro, Vite, or vanilla HTML.

## Installation

Clone into your global skills directory:

```bash
git clone https://github.com/shervinemp/journey_skill.git ~/.agents/skills/journey-audit
```

The skill loads automatically when you invoke `$journey-audit` in any project.

## Commands

| Command | Description |
|---------|-------------|
| `$journey-audit init` | Set up project context (PRODUCT.md) |
| `$journey-audit scan` | Quick role discovery without deep tracing |
| `$journey-audit trace [role]` | Full atomic journey trace for one or all roles |
| `$journey-audit report` | Generate markdown summary from existing findings |

## How it works

1. **Discover** — detect framework, map routes, identify auth boundaries
2. **Enumerate** — for each role, list 10+ complete end-to-end goals
3. **Trace** — decompose each journey into atomic steps, evaluate visual + functional at each step
4. **Classify** — tag findings P0–S with severity
5. **Report** — produce the Journey Audit Matrix

## Output

```
## [Role] — N journeys, M findings

### Journey 1: Concrete end-to-end goal
| # | Step | Visual | Functional | Finding | Severity |
|---|------|--------|------------|---------|----------|

## Cross-Role Summary
- P0 (blocks task)
- P1 (major friction)
- Feature suggestions
```

## License

MIT
