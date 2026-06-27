# Scan Flow

Quick role discovery without deep tracing. Use for an initial overview or when you need to understand the surface before committing to full traces.

## Step 1: Scan routes

Read the routing table from `context.mjs` output. Group routes by access level:
- Public (no auth required)
- Auth required (any logged-in user)
- Role-gated (admin, moderator, owner)
- Owner-only (business owner, event organizer)

## Step 2: Identify roles

For each access level, infer the role:
- Public → Visitor
- Auth required → Authenticated User
- Role-gated → read the role enum, permission checks, middleware
- Owner-only → Business Owner, Event Organizer, Staff

## Step 3: Map entry points per role

For each role, list every route they can access. Note routes that overlap between roles.

## Step 4: Quick findings

Report obvious gaps without tracing:
- Routes that 404 or redirect unexpectedly
- Auth checks that feel wrong
- Missing role-based access for obvious features

## Output

```
## Scan Results

### Roles discovered: [N]

| Role | Entry points | Notes |
|------|-------------|-------|
| Visitor | /, /search | Public routes |

### Quick findings
```
