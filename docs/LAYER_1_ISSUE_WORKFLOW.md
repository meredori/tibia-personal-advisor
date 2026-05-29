# Layer 1 Issue Workflow and Task Gate

## Purpose
This guide documents the current Layer 1 issue flow used by contributors and coding agents.

## Issue Lifecycle Labels
Current workflow labels are:

- `status:backlog` — default label on new Agent Task issues.
- `status:ready` — marks work as ready to execute.
- `status:blocked` — applied by the task gate when readiness rules are violated.

Layer label currently used by the gate:

- `layer:01-scaffold`

## Task Gate Behavior (Current State)
The `Task Gate` workflow (`.github/workflows/task-gate.yml`) runs on issue events:

- `opened`
- `labeled`
- `edited`

Gate rule currently enforced:

- If an issue has `status:ready` but does **not** have `layer:01-scaffold`, the workflow:
  - removes `status:ready`
  - adds `status:blocked`
  - posts: `Blocked by task gate: only layer:01-scaffold is currently unlocked.`

This means only Layer 1 (`layer:01-scaffold`) tasks can remain in `status:ready` right now.

## Required Agent Task Issue Fields
The Agent Task issue template (`.github/ISSUE_TEMPLATE/agent-task.yml`) requires:

- Layer
- Module
- Impact Level
- Scope
- Must Not Touch
- Acceptance Criteria
- Meaningful Tests Required
- Dependencies
- Follow-Up Work

## Assignee and Execution Expectations
To stay aligned with repository workflow guidance (`docs/AGENT_WORKFLOW.md` and `.github/copilot-instructions.md`):

- Work only on the assigned issue.
- Keep changes small and scoped to the declared layer/module.
- Do not expand into "Must Not Touch" areas.
- Record out-of-scope findings as follow-up tasks.

## Pull Request Requirements
PRs should follow `.github/pull_request_template.md` and include:

- Summary
- Scope
- Layer
- Impact Level
- Files Changed
- Tests Run
- Known Limitations
- Follow-Up Tasks
- Completed safety checklist

## Scope and Parallel-Safety Rules
Use `docs/AGENT_WORKFLOW.md` as the source of truth for parallel work.

Parallel-safe work is usually limited to isolated module/documentation updates that do not alter shared contracts.

Coordination is required for changes touching shared services, domain contracts/models, provider interfaces, recommendation scoring, cross-module state flow, or migrations.

When work is not parallel-safe, split tasks and gate risky changes behind explicit review.
