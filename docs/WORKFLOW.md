# Repository Workflow

## Purpose

This document describes the contributor and agent workflow for this repository. It covers the label model, task-gate behavior, required issue and PR fields, scope control, and when work must be coordinated rather than run in parallel.

For architecture boundaries and layer definitions, see [docs/ARCHITECTURE.md](ARCHITECTURE.md).
For AI coding agent behavior rules, see [docs/AGENT_WORKFLOW.md](AGENT_WORKFLOW.md).
For safety policy, see [docs/SAFETY_BOUNDARIES.md](SAFETY_BOUNDARIES.md).

---

## Label Model

### Status Labels

| Label | Meaning |
|---|---|
| `status:ready` | Issue is scoped, approved, and ready for implementation |
| `status:backlog` | Issue is defined but not yet cleared for work |
| `status:blocked` | Issue is gated by the task gate or a dependency |

### Layer Labels

Issues must carry a layer label to pass the task gate. Current layer labels follow the pattern `layer:NN-name` (for example `layer:01-scaffold`).

### Impact Labels

Issues carry an impact level label indicating risk scope:

| Label | Level | Description |
|---|---|---|
| `impact:1-isolated` | 1 | Low risk. Isolated module change |
| `impact:2-module` | 2 | Moderate risk. Module logic change |
| `impact:3-service` | 3 | High risk. Shared service change |
| `impact:4-contract` | 4 | Very high risk. Domain model/contract change |
| `impact:5-system` | 5 | Highest risk. System behavior change |

### Agent Label

Issues assigned to Copilot carry `agent:copilot`.

---

## Task Gate

The repository enforces a Layer-based task gate through `.github/workflows/task-gate.yml`.

**Current rule:** Only `layer:01-scaffold` issues may carry `status:ready`. All other layer issues are automatically moved to `status:blocked` when labeled `status:ready`.

This prevents work on higher layers before the current layer is sufficiently complete. When the unlock criteria for Layer 1 are met (see [docs/LAYER_ROLLOUT.md](LAYER_ROLLOUT.md)), the gate will be updated to allow the next layer.

---

## Required Issue Fields

All issues filed via the Agent Task template must include the following fields:

| Field | Description |
|---|---|
| **Layer** | Which architecture layer this task belongs to (for example `layer:01-scaffold`) |
| **Module** | Which product module or subsystem is affected |
| **Impact Level** | Risk level 1–5 as defined above |
| **Scope** | What must be changed |
| **Must Not Touch** | Files, layers, or modules explicitly out of scope |
| **Acceptance Criteria** | Conditions that define completion |
| **Meaningful Tests Required** | Behavior and contract tests needed for this task |
| **Dependencies** | Prerequisite contracts, services, or tasks |
| **Follow-Up Work** | Out-of-scope findings to record as separate tasks |

---

## Required PR Fields

All pull requests must complete the PR template fields before review:

| Field | Description |
|---|---|
| **Summary** | What this PR does and why |
| **Scope** | Which files and layers were changed |
| **Layer** | Architecture layer addressed |
| **Impact Level** | Risk level 1–5 |
| **Files Changed** | Explicit list of changed files |
| **Tests Run** | What tests were executed and their result |
| **Known Limitations** | Anything incomplete or intentionally deferred |
| **Follow-Up Tasks** | Out-of-scope issues discovered during this PR |
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

## Scope Control

### Keep PRs Small

Each PR must address one focused problem. Mixing unrelated fixes in a single PR is not permitted.

### Do Not Fix Out-Of-Scope Issues

If an out-of-scope problem is discovered during implementation, record it as a follow-up task in the PR rather than fixing it inline.

### Modify Only Required Files

Change only the files and layers that the assigned task requires. If changes to unrelated files seem necessary, stop and confirm scope first.

---

## Parallel-Safe Work

Tasks that do not share changed contracts or shared service internals may run in parallel. The issue description for each task lists which other tasks it is parallel-safe with.

Examples of parallel-safe work:

- Independent documentation files in `docs/`
- Isolated feature-module improvements that share no contract
- UI presentation adjustments that do not change shared state

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

Changes in these areas can have wide downstream impact. They must be reviewed before dependent work begins.

---

## Copilot Agent Task Expectations

When Copilot is assigned an issue:

- Work only on the assigned issue scope.
- Keep PRs small and push changes in small, incremental commits.
- Do not change files outside the requested scope.
- If unrelated issues are found, document them as follow-up tasks instead of fixing them inline.
- Preserve manual and static fallback paths.
- Stay within the declared layer, module, and impact level.
- Add meaningful tests for behavior and contracts. Do not add shallow tests for coverage only.
- If tests are not appropriate for a docs-only task, state this explicitly in the PR.
