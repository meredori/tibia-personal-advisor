# Codex Review Instructions

Review priorities:
1. Scope control
2. Contract safety
3. Meaningful tests
4. No gameplay automation
5. Manual/static fallback preservation
6. Clear PR explanation

Flag serious issues only:
- out-of-scope changes
- broken architecture boundaries
- unsafe automation
- missing meaningful tests where behavior changed
- direct API calls from feature modules
- hidden domain model changes
- unclear migration behavior

Do not nitpick style if CI/lint already covers it.