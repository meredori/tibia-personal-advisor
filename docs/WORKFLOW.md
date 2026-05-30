# Repository Workflow

## Purpose

This document describes the development workflow for this repository after removing issue-gated task management. It focuses on building, validating, and reviewing code changes safely.

For architecture boundaries and layer definitions, see [docs/ARCHITECTURE.md](ARCHITECTURE.md).
For AI coding agent behavior rules, see [docs/AGENT_WORKFLOW.md](AGENT_WORKFLOW.md).
For safety policy, see [docs/SAFETY_BOUNDARIES.md](SAFETY_BOUNDARIES.md).

---

## Build-First Local Flow

Use this sequence for normal development:

1. Install dependencies: `npm install`
2. Run lint checks: `npm run lint`
3. Run optional tests: `npm test --if-present`
4. Build for production: `npm run build`
5. Run locally if needed: `npm run dev` (or `npm run start` after build)

Changes should be considered ready for review only if lint and build pass.

---

## Scope Control

### Keep Changes Small

Each PR should address one focused problem. Avoid mixing unrelated fixes.

### Do Not Expand Scope Mid-Task

If an out-of-scope problem is discovered during implementation, record it as follow-up work instead of fixing it inline.

### Modify Only Required Files

Change only files and layers required for the task. If unrelated changes appear necessary, confirm scope first.

---

## Required PR Fields

All pull requests should complete the PR template fields before review:

| Field | Description |
|---|---|
| **Summary** | What this PR does and why |
| **Scope** | Which files and layers were changed |
| **Layer** | Architecture layer addressed |
| **Impact Level** | Risk level 1–5 |
| **Files Changed** | Explicit list of changed files |
| **Tests Run** | What checks/tests were executed and their result |
| **Known Limitations** | Anything incomplete or intentionally deferred |
| **Follow-Up Tasks** | Out-of-scope findings discovered during this PR |
| **Safety Checklist** | All safety checklist items must be reviewed and checked |

The safety checklist items are:

- Does not automate Tibia gameplay
- Does not enable unattended gameplay
- Does not read client memory
- Does not scrape the game client
- Does not bypass shared services
- Feature modules do not call external APIs directly
- Preserves manual/static fallback paths
- PR is small enough for human review

---

## Parallel-Safe Work

Tasks that do not share changed contracts or shared service internals may run in parallel.

Examples of parallel-safe work:

- Independent documentation updates in `docs/`
- Isolated feature-module improvements that share no contract
- UI presentation adjustments that do not change shared state contracts

See [docs/AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) for the full parallel-safe and coordination-required rules.

---

## When Coordination Is Required

Any task that touches the following areas requires explicit coordination and sequential scheduling:

- Shared services
- Domain models or contracts
- Provider interfaces
- Recommendation scoring behavior
- Cross-module state flow
- Data migration decisions

Changes in these areas can have wide downstream impact and must be reviewed before dependent work begins.
