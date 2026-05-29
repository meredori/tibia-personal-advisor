# Copilot Instructions

This project is the Tibia Personal Advisor.

Primary rule: this is an advisory tool only. Never add gameplay automation, client scraping, memory reading, macroing, or input automation.

Development model:
- Work only on the assigned issue.
- Keep PRs small and focused.
- Do not change files outside the requested scope unless necessary.
- If you find unrelated issues, document them as follow-up work instead of fixing them in this PR.
- Preserve manual/static fallback paths.
- Feature modules must not call external APIs directly.
- Shared services and domain models require explicit scope.

Testing:
- Add meaningful tests for behavior and contracts.
- Do not add shallow tests just for coverage.
- If tests are not appropriate for a docs-only PR, say so in the PR.

PR requirements:
- Summary
- Scope
- Files changed
- Tests run
- Known limitations
- Follow-up tasks