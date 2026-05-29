# AI Agent Workflow

## Purpose
This document defines how AI coding agents should execute work safely in this repository.

Principles:

- Keep changes scoped and reviewable.
- Respect architecture boundaries.
- Preserve manual/static fallback behavior.
- Prefer additive, contract-safe evolution.

## Layer-By-Layer Implementation Model
Work should generally progress from lower contracts to higher feature behavior:

1. Data source and normalization contracts
2. Domain model contracts
3. Shared services
4. Feature module logic
5. Recommendation behavior
6. UI/notification presentation

Do not skip dependency layers when a task introduces contract changes.

## Parallel-Safe Work
Parallel implementation is usually safe when agents:

- Work in different modules within the same layer
- Depend only on stable, unchanged contracts
- Avoid editing shared service internals or shared model schemas

Examples of parallel-safe task classes:

- Independent feature-module improvements
- Documentation updates for separate modules
- Isolated UI presentation adjustments that do not change shared state contracts

## When Coordination Is Required
Coordination is required for tasks touching:

- Shared services
- Domain models/contracts
- Provider interfaces
- Recommendation scoring behavior
- Cross-module state flow
- Data migration decisions

These changes can have wide downstream impact and must be explicitly reviewed.

## Impact Levels (1-5)

### Level 1: Isolated Module Change
Low risk. Usually independent.

### Level 2: Module Logic Change
Moderate risk. Requires module tests and contract checks.

### Level 3: Shared Service Change
High risk. Requires dependent module validation.

### Level 4: Domain Model/Contract Change
Very high risk. Requires coordinated updates and migration planning.

### Level 5: System Behavior Change
Highest risk. Requires explicit approval and broad regression review.

## PR Rules

### Small PRs
- Keep each PR narrow and focused on one problem.
- Avoid mixing unrelated fixes.

### Scope Control
- Modify only files/layers required by the assigned task.
- If unrelated issues are found, record them as follow-up work.

### Meaningful Tests
- Add tests that validate behavior and contracts impacted by the change.
- Avoid shallow tests added only for coverage percentages.

### Follow-Up Tasks For Out-Of-Scope Findings
- Do not fix out-of-scope problems in the same PR.
- Capture concise follow-up tasks in PR notes.

## Must-Follow Contract Rules
- Do not bypass shared services.
- Do not call external APIs directly from feature modules.
- Do not silently alter domain model contracts.
- Do not remove manual/static fallback paths.
- Preserve confidence/freshness metadata behavior.
- Do not implement gameplay automation.

## Agent Task Template
Use this template for future scoped tasks:

```text
Task:
Layer:
Module:
Impact Level:
Depends On:
Can Run In Parallel With:
Must Not Touch:
Expected Output:
Tests Required:
User-Facing Change:
```
