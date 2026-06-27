# Init Flow

Set up the project for a journey audit. Run when the skill's context script reports `NO_PRODUCT_MD` or when the project has no documented user journeys.

## Step 1: Explore

Read the README, package.json, routing structure, auth configuration. Understand the domain — what does this app do?

## Step 2: Ask strategic questions

Ask 2-3 questions per round to establish:
- **All user roles**: Who uses this? (visitors, members, admins, etc.)
- **Primary domain goal**: What's the single job this app exists to do?
- **Anti-goals**: What should the app NOT be used for?

Skip questions where the answer is clearly discoverable from the codebase.

## Step 3: Write a minimal PRODUCT.md

```markdown
# Product

## Register
product  # or "brand" for marketing/content sites

## Users
[list of roles with 1-line descriptions]

## Product Purpose
[what this app does]

## Routes by role
[table mapping roles to their entry points]
```

## Step 4: Proceed to trace

Once PRODUCT.md exists, run the trace flow.
