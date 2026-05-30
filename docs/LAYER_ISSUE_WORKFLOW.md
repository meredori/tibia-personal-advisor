# Layered Implementation Workflow

## Purpose
This guide describes how to execute layered implementation work without an issue-gate process.

## Work Intake
Use direct task requests (local planning, backlog docs, or PR discussions) instead of issue labels/statuses.

Each task should still state:

- Layer
- Module
- Impact level
- Scope
- Must-not-touch boundaries
- Acceptance criteria
- Tests required

## Execution Expectations
To stay aligned with repository workflow guidance (`docs/AGENT_WORKFLOW.md` and `.github/copilot-instructions.md`):

- Work only on the assigned task scope.
- Keep changes small and scoped to the declared layer/module.
- Do not expand into must-not-touch areas.
- Record out-of-scope findings as follow-up work.

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
