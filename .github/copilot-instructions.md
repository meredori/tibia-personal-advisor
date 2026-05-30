# Copilot Instructions

This project is the Tibia Personal Advisor.

Before every task, read and follow:

- docs/PRODUCT_SPEC.md
- docs/ARCHITECTURE.md
- docs/AGENT_WORKFLOW.md
- docs/SAFETY_BOUNDARIES.md

Primary rule: this is an advisory tool only. Never add gameplay automation, client scraping, memory reading, macroing, unattended play behavior, or input automation.

Development model:
- Work only on the assigned task/request.
- Keep PRs small and focused.
- Do not change files outside the requested scope unless necessary.
- If you find unrelated problems, document them as follow-up work instead of fixing them in this PR.
- Preserve manual/static fallback paths.
- Stay in the declared layer/module scope and impact level.
- Feature modules must not call external APIs directly.
- Do not bypass shared services.
- Shared services and domain models require explicit scope.

Testing:
- Add meaningful tests for behavior and contracts.
- Do not add shallow tests just for coverage.
- If tests are not appropriate for a docs-only PR, say so in the PR.

PR requirements:
- Summary
- Scope
- Layer
- Impact Level
- Files changed
- Tests run
- Known limitations
- Follow-up tasks