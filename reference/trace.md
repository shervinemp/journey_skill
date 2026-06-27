# Trace Flow

The core of the journey audit. Run after Setup (routes mapped, framework detected, codebase explored).

## Step 1: Identify all roles and their entry points

Roles are specific to the application. Discover them by scanning:

- **Auth system**: Check for role enums, permission arrays, admin/mod checks. Common roles: visitor, user, business_owner, moderator, admin, super_admin.
- **Route guards**: Middleware files, layout checks, `protectedProcedure` equivalents.
- **Business model**: If the app has listings/posts/events, there's likely an owner role.
- **Domain**: What parties naturally exist? Buyer/seller? Host/guest? Employer/job-seeker?

For each role, list every entry point (URL or trigger) they can use.

## Step 2: Enumerate complete journeys per role

For each role, brainstorm every end-to-end goal. Minimum 10 per role.

A valid journey is a **complete, atomic goal** from the user's perspective — not a partial action.

| Instead of | Use |
|---|---|
| "Search for products" | "Find a specific product, compare prices, read reviews, and add to cart" |
| "Submit a form" | "Register as a business owner, verify email, set up profile, and publish first listing" |
| "View dashboard" | "Check monthly revenue, see new leads, and export a report" |

Include journeys for:
- **Happy path** — everything works as intended
- **Empty/null state** — page has no data to display
- **Error state** — network failure, server 500, validation failure
- **Edge case** — banned user, expired content, soft-deleted item, permission denied, rate limited

## Step 3: Trace each journey atomically

Decompose into atomic user actions. Each action is one indivisible interaction:

```
navigate to /search
→ type "coffee" in search bar
→ press Enter
→ wait for results to load
→ observe loading skeleton
→ results appear
→ scroll to third result
→ click result
→ page navigates to /products/123
→ observe product hero image loading
→ read description
→ scroll to reviews
→ click "Write a review"
→ observe auth modal (user not logged in)
→ click "Sign in"
→ fill email field
→ fill password field
→ click "Submit"
→ observe form validation on empty fields
→ ...
```

For each atomic step, evaluate:

**Visual check:**
- Is the UI clear about what to do next? (affordance)
- Are there competing or confusing CTAs?
- Is the visual hierarchy right?
- Do loading/empty/error states exist and look intentional?
- Is text readable at common viewport widths?
- Are touch targets ≥44px on mobile?
- Is the state transition smooth (no layout shift)?

**Functional check:**
- Does the action produce the correct result?
- Are there loading indicators for async operations?
- Are errors caught and surfaced to the user in plain language?
- Is the data correctly fetched, fresh, and displayed?
- Are there race conditions or stale data?
- Are soft-deleted/inactive items filtered out?
- Is authorization enforced (can a visitor access an owner-only page)?
- Are form validations helpful (specific, inline, actionable)?

## Step 4: Classify every finding

| Column | Value |
|--------|-------|
| Role | Which party / user type |
| Journey | Which end-to-end goal |
| Step # | Index in the atomic sequence |
| Step | The atomic action |
| Location | Route / component / file path |
| Visual | Pass / Fail / N/A |
| Functional | Pass / Fail / N/A |
| Finding | Description of the issue |
| Severity | P0-P3 or S |

**Severity definitions:**
- **P0 — Blocking:** User cannot complete the goal. Showstopper.
- **P1 — Major:** Significant friction. User will struggle or may abandon.
- **P2 — Minor:** Annoyance with a workaround.
- **P3 — Polish:** Cosmetic or nice-to-fix.
- **S — Suggestion:** Missing feature or capability that would unlock a new journey.

## Step 5: Produce the Journey Audit Matrix

Group by role:

```
## [Role] — [N journeys, M findings total]

### Journey 1: [Concrete end-to-end goal]
[1-2 sentence context: who, why, what triggers this?]

**Entry point:** [route or trigger] → **Success state:** [what "done" looks like]

| # | Step | Visual | Functional | Finding | Severity |
|---|------|--------|------------|---------|----------|
| 1 | action description | Pass | Pass | — | — |
| 2 | action description | Fail | Pass | Button has no hover state (P3) | P3 |
```

Then produce a **Cross-Role Summary:**

```
## Cross-Role Summary

### Critical (P0) — [count]
1. [Finding] — [role/journey]
2. [Finding] — [role/journey]

### Major (P1) — [count]
...

### Common patterns
- [Pattern that appeared across multiple roles/journeys]
- [Another pattern]

### Feature suggestions (S)
1. **Suggestion** — [rationale from trace findings]

### Recommended next commands
- `$journey-audit trace <role/journey>` — deep-dive a specific journey
```

## Source verification methods

- **Code inspection:** Read source files to verify behavior, error handling, loading states
- **Detector:** Run `<skill-dir>/scripts/detect.mjs --json <target>` for antipattern scans
- **Browser (if available):** Navigate the live app, inspect network tab, check rendering
- **DevTools (if available):** Check console errors, Lighthouse, a11y tree

When a step can only be verified via one method, note the method used and mark anything uncertain as UNVERIFIED.
